// @ts-nocheck
import { TargetChannel } from "@opentui/core"
import type { TuiPlugin } from "@opencode-ai/plugin/tui"

type Api = Parameters<TuiPlugin>[0]

const FLASH_MATRIX = new Float32Array([
  0.9,
  0.55,
  0.2,
  0.04,
  0.65,
  2.8,
  0.65,
  0.34,
  0.2,
  0.55,
  0.9,
  0.04,
  0,
  0,
  0,
  1,
])

const CLOUD_HIDE_MATRIX = new Float32Array([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
])

const FLASH_ONE_MS = 140
const FLASH_GAP_MS = 110
const FLASH_TWO_ATTACK_MS = 90
const FLASH_TWO_FADE_MS = 680
const CLOUD_FADE_MS = FLASH_TWO_FADE_MS
const CLOUD_HOLD_MS = 10_000

const FLASH_TWO_START_MS = FLASH_ONE_MS + FLASH_GAP_MS
const CLOUD_FADE_START_MS = FLASH_TWO_START_MS + FLASH_TWO_ATTACK_MS
const CLOUD_FADE_END_MS = CLOUD_FADE_START_MS + CLOUD_FADE_MS
const SEQUENCE_END_MS = CLOUD_FADE_END_MS + CLOUD_HOLD_MS

const BRAILLE_BLANK = 0x2800

const MUSHROOM_CLOUD = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡤⠦⣦⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⣠⣴⣴⣦⣐⠰⢆⠀⠀⢀⣶⣖⣀⣈⡙⣿⣤⡇⠀⢶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⢸⣿⡟⣟⣋⢻⣯⢛⣞⡙⣯⣿⣿⣿⣿⣿⣿⣿⣷⣶⣤⣀⠘⣿⣧⡀⣀⣀⣀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⣠⣼⣿⣿⣷⣾⣿⣯⣿⣿⣿⣿⣟⡛⣭⣿⣽⢭⣫⣿⣿⣿⣿⣹⣷⡜⣿⡛⡛⠿⣿⣿⣿⣿⣿⣀⠀⠀⠀⠀⠀",
  "⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣁⣉⣷⣿⣿⣿⣿⣷⣶⠀⠀⠀",
  "⠀⠘⡿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡄⠀",
  "⢀⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡋⠀",
  "⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄",
  "⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀",
  "⠀⠀⠉⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀",
  "⠀⠀⠀⠀⠉⠻⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠏⠉⠁⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠉⠉⠋⠉⠉⣻⣿⣿⣿⣿⣿⣿⡟⠉⠉⠉⠁⠈⠉⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣧⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⣿⣿⣿⣿⣿⣿⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣟⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠟⣿⡟⠁⢹⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣦⣴⣦⣀⣠⣴⣾⣿⣶⣿⣷⣿⣜⢻⣿⣿⣿⣿⣷⣷⣶⣶⣶⣶⣶⣶⣄⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠠⣴⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀",
]

const cloudRows = MUSHROOM_CLOUD.map((line) => Array.from(line, (char) => char.codePointAt(0) ?? 32))
const cloudWidth = Math.max(...cloudRows.map((line) => line.length))

type CloudGlyph = {
  x: number
  y: number
  codePoint: number
  isBraille: boolean
  baseDensity: number
  rowNorm: number
  drift: number
  phase: number
  capWeight: number
  stemWeight: number
  torusWeight: number
  baseR: number
  baseG: number
  baseB: number
}

const CLOUD_TOP = {
  r: 0.2,
  g: 1,
  b: 0.2,
}

const CLOUD_BOTTOM = {
  r: 0.08,
  g: 0.48,
  b: 0.09,
}

const STEM_START_ROW = 0.66
const TORUS_CENTER_ROW = 0.36
const TORUS_HALF_WIDTH = 0.18

const BRAILLE_SHADE_RAMP = new Uint32Array([0x2801, 0x2803, 0x2807, 0x280f, 0x281f, 0x283f, 0x287f, 0x28ff])
const SHADE_LAST = BRAILLE_SHADE_RAMP.length - 1

const BRAILLE_DOT_COUNT = new Uint8Array(256)
for (let bits = 0; bits < BRAILLE_DOT_COUNT.length; bits++) {
  let value = bits
  let count = 0
  while (value) {
    value &= value - 1
    count++
  }
  BRAILLE_DOT_COUNT[bits] = count
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const phaseFromXY = (x: number, y: number) => {
  const hash = ((x * 73856093) ^ (y * 19349663)) >>> 0
  return ((hash & 1023) / 1023) * Math.PI * 2
}

const isBraille = (codePoint: number) => {
  return codePoint >= 0x2800 && codePoint <= 0x28ff
}

const brailleDensity = (codePoint: number) => {
  if (!isBraille(codePoint)) return 1
  return BRAILLE_DOT_COUNT[codePoint - 0x2800] / 8
}

const isCloudInk = (codePoint: number) => {
  if (codePoint === BRAILLE_BLANK) return false
  return !/\s/u.test(String.fromCodePoint(codePoint))
}

const clamp01 = (value: number) => {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

const createNukePostProcess = (onDone: () => void) => {
  let elapsed = 0
  let finished = false

  let fullMaskWidth = -1
  let fullMaskHeight = -1
  let fullMask = new Float32Array(0)

  let cloudLayoutWidth = -1
  let cloudLayoutHeight = -1
  let cloudGlyphs: CloudGlyph[] = []
  let cloudMask = new Float32Array(0)

  const ensureFullMask = (width: number, height: number) => {
    if (width === fullMaskWidth && height === fullMaskHeight) return
    fullMaskWidth = width
    fullMaskHeight = height

    const size = width * height * 3
    fullMask = new Float32Array(size)

    let idx = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        fullMask[idx++] = x
        fullMask[idx++] = y
        fullMask[idx++] = 1
      }
    }
  }

  const ensureCloudLayout = (width: number, height: number) => {
    if (width === cloudLayoutWidth && height === cloudLayoutHeight) return
    cloudLayoutWidth = width
    cloudLayoutHeight = height

    const nextGlyphs: CloudGlyph[] = []
    const nextMask: number[] = []

    const startX = Math.floor((width - cloudWidth) * 0.5)
    const startY = Math.max(0, height - cloudRows.length)
    const rows = Math.max(1, cloudRows.length - 1)
    const cols = Math.max(1, cloudWidth - 1)

    for (let row = 0; row < cloudRows.length; row++) {
      const y = startY + row
      if (y < 0 || y >= height) continue
      const line = cloudRows[row]
      const rowNorm = row / rows
      const warmth = 1 - row / rows
      const stemWeight = clamp01((rowNorm - STEM_START_ROW) / (1 - STEM_START_ROW))
      const capWeight = 1 - stemWeight
      const torusWeight = capWeight * clamp01(1 - Math.abs(rowNorm - TORUS_CENTER_ROW) / TORUS_HALF_WIDTH)

      for (let col = 0; col < line.length; col++) {
        const x = startX + col
        if (x < 0 || x >= width) continue
        const codePoint = line[col]
        if (!isCloudInk(codePoint)) continue
        const drift = (col / cols) * 2 - 1
        const baseR = lerp(CLOUD_BOTTOM.r, CLOUD_TOP.r, warmth)
        const baseG = lerp(CLOUD_BOTTOM.g, CLOUD_TOP.g, warmth)
        const baseB = lerp(CLOUD_BOTTOM.b, CLOUD_TOP.b, warmth)
        nextGlyphs.push({
          x,
          y,
          codePoint,
          isBraille: isBraille(codePoint),
          baseDensity: brailleDensity(codePoint),
          rowNorm,
          drift,
          phase: phaseFromXY(x, y),
          capWeight,
          stemWeight,
          torusWeight,
          baseR,
          baseG,
          baseB,
        })
        nextMask.push(x, y, 1)
      }
    }

    cloudGlyphs = nextGlyphs
    cloudMask = new Float32Array(nextMask)
  }

  const drawCloud = (buf: any) => {
    const width = buf.width
    const chars = buf.buffers.char
    const attrs = buf.buffers.attributes
    const fg = buf.buffers.fg
    const time = elapsed * 0.001

    for (let i = 0; i < cloudGlyphs.length; i++) {
      const glyph = cloudGlyphs[i]
      const index = glyph.y * width + glyph.x
      const colorIndex = index * 4

      const capRoll = Math.sin(time * 2.9 + glyph.drift * 7.1 + glyph.phase)
      const capBillow = Math.sin(time * 4.0 - glyph.rowNorm * 6.4 + glyph.phase * 1.2)
      const torusSpin = Math.sin(time * 6.5 - glyph.drift * 12.8 + glyph.phase * 0.85)
      const stemRise = Math.sin(time * 8.3 + glyph.rowNorm * 15 + glyph.phase * 1.6)

      const motion =
        (capRoll * 0.45 + capBillow * 0.35) * glyph.capWeight +
        torusSpin * 0.9 * glyph.torusWeight +
        stemRise * 0.78 * glyph.stemWeight

      const density = clamp01(glyph.baseDensity * 0.72 + 0.18 + motion * 0.24)
      const shadeIndex = Math.min(SHADE_LAST, Math.max(0, Math.round(density * SHADE_LAST)))

      chars[index] = glyph.isBraille ? BRAILLE_SHADE_RAMP[shadeIndex] : glyph.codePoint
      attrs[index] = 0

      const flicker = motion * 0.08 + torusSpin * glyph.torusWeight * 0.12 + stemRise * glyph.stemWeight * 0.06

      fg[colorIndex] = clamp01(glyph.baseR + flicker * 0.15)
      fg[colorIndex + 1] = clamp01(glyph.baseG + flicker * 0.34 + glyph.torusWeight * 0.04)
      fg[colorIndex + 2] = clamp01(glyph.baseB + flicker * 0.1)
      fg[colorIndex + 3] = 1
    }
  }

  const firstFlashStrength = () => {
    if (elapsed >= FLASH_ONE_MS) return 0
    const progress = clamp01(elapsed / FLASH_ONE_MS)
    return Math.sin(progress * Math.PI) * 0.9
  }

  const secondFlashStrength = () => {
    if (elapsed < FLASH_TWO_START_MS) return 0
    const localTime = elapsed - FLASH_TWO_START_MS

    if (localTime <= FLASH_TWO_ATTACK_MS) {
      return clamp01(localTime / FLASH_TWO_ATTACK_MS)
    }

    if (localTime <= FLASH_TWO_ATTACK_MS + FLASH_TWO_FADE_MS) {
      const fade = (localTime - FLASH_TWO_ATTACK_MS) / FLASH_TWO_FADE_MS
      return 1 - clamp01(fade)
    }

    return 0
  }

  const cloudAlpha = () => {
    if (elapsed < CLOUD_FADE_START_MS) return 0
    if (elapsed >= CLOUD_FADE_END_MS) return 1
    return clamp01((elapsed - CLOUD_FADE_START_MS) / CLOUD_FADE_MS)
  }

  return (buf: any, dt: number) => {
    if (finished) return

    elapsed += dt

    const width = buf.width
    const height = buf.height

    if (width <= 0 || height <= 0) {
      if (elapsed >= SEQUENCE_END_MS) {
        finished = true
        onDone()
      }
      return
    }

    ensureFullMask(width, height)

    const flash = Math.max(firstFlashStrength(), secondFlashStrength())
    if (flash > 0) {
      buf.colorMatrix(FLASH_MATRIX, fullMask, flash, TargetChannel.Both)
    }

    if (elapsed >= CLOUD_FADE_START_MS) {
      ensureCloudLayout(width, height)
      drawCloud(buf)

      const reveal = cloudAlpha()
      if (reveal < 1 && cloudMask.length > 0) {
        buf.colorMatrix(CLOUD_HIDE_MATRIX, cloudMask, 1 - reveal, TargetChannel.Foreground)
      }
    }

    if (elapsed >= SEQUENCE_END_MS) {
      finished = true
      onDone()
    }
  }
}

export const createNukeCommand = (api: Api) => {
  let postProcess: ((buf: any, dt: number) => void) | undefined
  let requestedLive = false

  const stop = () => {
    if (postProcess) {
      api.renderer.removePostProcessFn(postProcess)
      postProcess = undefined
    }

    if (requestedLive) {
      api.renderer.dropLive()
      requestedLive = false
    }
  }

  const run = () => {
    stop()
    postProcess = createNukePostProcess(stop)
    api.renderer.addPostProcessFn(postProcess)
    api.renderer.requestLive()
    requestedLive = true
  }

  return {
    command: {
      title: "/nuke",
      value: "/nuke",
      slash: {
        name: "nuke",
      },
      onSelect() {
        run()
      },
    },
    dispose() {
      stop()
    },
  }
}
