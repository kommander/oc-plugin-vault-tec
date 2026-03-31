// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiThemeCurrent, TuiPlugin } from "@opencode-ai/plugin/tui"
import { createMemo, Show } from "solid-js"

type Api = Parameters<TuiPlugin>[0]

const BAR_W = 12

const bar = (ratio: number): string => {
  const r = Math.max(0, Math.min(1, ratio))
  const n = Math.round(r * BAR_W)
  return "\u2588".repeat(n) + "\u2591".repeat(BAR_W - n)
}

const pct = (ratio: number): string => {
  return Math.round(Math.max(0, Math.min(1, ratio)) * 100) + "%"
}

const fmt = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 10_000) return Math.round(n / 1_000) + "K"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

const fmtCaps = (n: number): string => {
  if (n >= 1) return "$" + n.toFixed(2)
  if (n >= 0.01) return "$" + n.toFixed(3)
  return "$" + n.toFixed(4)
}

export const PipBoyContext = (props: {
  theme: TuiThemeCurrent
  api: Api
  sessionId: string
}) => {
  const data = createMemo(() => {
    const messages = props.api.state.session.messages(props.sessionId)
    let totalInput = 0
    let totalOutput = 0
    let totalCacheRead = 0
    let totalCost = 0
    let lastInput = 0
    let lastModelID = ""
    let lastProviderID = ""

    for (const msg of messages) {
      if (msg.role !== "assistant") continue
      totalInput += msg.tokens.input
      totalOutput += msg.tokens.output
      totalCacheRead += msg.tokens.cache.read
      totalCost += msg.cost
      lastInput = msg.tokens.input
      lastModelID = msg.modelID
      lastProviderID = msg.providerID
    }

    let contextLimit = 0
    let outputLimit = 0

    for (const provider of props.api.state.provider) {
      const model =
        provider.id === lastProviderID
          ? provider.models[lastModelID]
          : undefined
      if (model) {
        contextLimit = model.limit.context
        outputLimit = model.limit.output
        break
      }
    }

    if (!contextLimit && lastModelID) {
      for (const provider of props.api.state.provider) {
        const model = provider.models[lastModelID]
        if (model) {
          contextLimit = model.limit.context
          outputLimit = model.limit.output
          break
        }
      }
    }

    return {
      lastInput,
      totalOutput,
      totalCost,
      contextLimit,
      outputLimit,
      contextRatio: contextLimit > 0 ? Math.min(1, lastInput / contextLimit) : 0,
      outputRatio: outputLimit > 0 ? Math.min(1, totalOutput / outputLimit) : 0,
      cacheRatio: totalInput > 0 ? Math.min(1, totalCacheRead / totalInput) : 0,
      hasData: totalInput > 0 || totalOutput > 0,
    }
  })

  const ctxColor = createMemo(() => {
    const r = data().contextRatio
    if (r > 0.9) return props.theme.error
    if (r > 0.7) return props.theme.warning
    return props.theme.primary
  })

  return (
    <Show when={data().hasData}>
      <box
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        width="100%"
        flexDirection="column"
      >
        <text fg={props.theme.primary}>
          <b>PIP-BOY 3000 MKIV</b>
        </text>
        <Show when={data().contextLimit > 0}>
          <text fg={props.theme.textMuted}>
            {fmt(data().lastInput)} / {fmt(data().contextLimit)} tokens
          </text>
        </Show>
        <text>
          <span style={{ fg: props.theme.textMuted }}>CTX </span>
          <span style={{ fg: ctxColor() }}>[{bar(data().contextRatio)}]</span>
          <span style={{ fg: props.theme.text }}> {pct(data().contextRatio)}</span>
        </text>
        <text>
          <span style={{ fg: props.theme.textMuted }}>OUT </span>
          <span style={{ fg: props.theme.primary }}>[{bar(data().outputRatio)}]</span>
          <span style={{ fg: props.theme.text }}> {fmt(data().totalOutput)}</span>
        </text>
        <text>
          <span style={{ fg: props.theme.textMuted }}>CSH </span>
          <span style={{ fg: props.theme.success }}>[{bar(data().cacheRatio)}]</span>
          <span style={{ fg: props.theme.text }}> {pct(data().cacheRatio)}</span>
        </text>
        <text>
          <span style={{ fg: props.theme.textMuted }}>CAPS </span>
          <span style={{ fg: props.theme.warning }}>{fmtCaps(data().totalCost)}</span>
        </text>
      </box>
    </Show>
  )
}
