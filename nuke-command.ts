// @ts-nocheck
import { TargetChannel } from "@opentui/core"
import type { TuiPlugin } from "@opencode-ai/plugin/tui"

type Api = Parameters<TuiPlugin>[0]

const FLASH_MATRIX = new Float32Array([0.9, 0.55, 0.2, 0.04, 0.65, 2.8, 0.65, 0.34, 0.2, 0.55, 0.9, 0.04, 0, 0, 0, 1])

const CLOUD_HIDE_MATRIX = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])

const FLASH_ONE_MS = 140
const FLASH_GAP_MS = 110
const FLASH_TWO_ATTACK_MS = 90
const FLASH_TWO_FADE_MS = 680
const CLOUD_FADE_MS = FLASH_TWO_FADE_MS
const CLOUD_HOLD_MS = 20_000

const FLASH_TWO_START_MS = FLASH_ONE_MS + FLASH_GAP_MS
const CLOUD_FADE_START_MS = FLASH_TWO_START_MS + FLASH_TWO_ATTACK_MS
const CLOUD_FADE_END_MS = CLOUD_FADE_START_MS + CLOUD_FADE_MS
const SEQUENCE_END_MS = CLOUD_FADE_END_MS + CLOUD_HOLD_MS

const LOGO_FADE_DELAY_MS = 500
const LOGO_FADE_MS = 600
const LOGO_FADE_START_MS = CLOUD_FADE_END_MS + LOGO_FADE_DELAY_MS
const LOGO_FADE_END_MS = LOGO_FADE_START_MS + LOGO_FADE_MS

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

const OPENCODE_LOGO = [
  "                                   ▄     ",
  "  █▀▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀▀ █▀▀█ █▀▀█ █▀▀█",
  "  █  █ █  █ █▀▀▀ █  █ █    █  █ █  █ █▀▀▀",
  "  ▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀",
]

const logoRows = OPENCODE_LOGO.map((line) => Array.from(line, (char) => char.codePointAt(0) ?? 32))
const logoWidth = Math.max(...logoRows.map((line) => line.length))

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

type LogoGlyph = {
  x: number
  y: number
  codePoint: number
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
const BRAILLE_RAMP_DOWN = new Uint32Array([0x2801, 0x2809, 0x280b, 0x281b, 0x281f, 0x283f, 0x287f, 0x28ff])
const BRAILLE_RAMP_UP = new Uint32Array([0x2840, 0x28c0, 0x28c4, 0x28e4, 0x28e6, 0x28f6, 0x28f7, 0x28ff])
const SHADE_LAST = BRAILLE_RAMP_DOWN.length - 1

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

  let logoLayoutWidth = -1
  let logoLayoutHeight = -1
  let logoGlyphs: LogoGlyph[] = []

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

      const ramp = glyph.stemWeight > 0 ? BRAILLE_RAMP_UP : BRAILLE_RAMP_DOWN
      chars[index] = glyph.isBraille ? ramp[shadeIndex] : glyph.codePoint
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

  const ensureLogoLayout = (width: number, height: number) => {
    if (width === logoLayoutWidth && height === logoLayoutHeight) return
    logoLayoutWidth = width
    logoLayoutHeight = height

    const nextLogo: LogoGlyph[] = []

    const startX = Math.floor((width - logoWidth) * 0.5)
    const startY = Math.floor((height - logoRows.length) * 0.5)

    for (let row = 0; row < logoRows.length; row++) {
      const y = startY + row
      if (y < 0 || y >= height) continue
      const line = logoRows[row]
      for (let col = 0; col < line.length; col++) {
        const x = startX + col
        if (x < 0 || x >= width) continue
        const codePoint = line[col]
        if (!isCloudInk(codePoint)) continue
        nextLogo.push({ x, y, codePoint })
      }
    }

    logoGlyphs = nextLogo
  }

  const drawLogo = (buf: any, reveal: number) => {
    const width = buf.width
    const chars = buf.buffers.char
    const attrs = buf.buffers.attributes
    const fg = buf.buffers.fg

    for (let i = 0; i < logoGlyphs.length; i++) {
      const g = logoGlyphs[i]
      const index = g.y * width + g.x
      const colorIndex = index * 4
      chars[index] = g.codePoint
      attrs[index] = 0
      fg[colorIndex] = 0.25 * reveal
      fg[colorIndex + 1] = 1.0 * reveal
      fg[colorIndex + 2] = 0.25 * reveal
      fg[colorIndex + 3] = 1
    }
  }

  const logoAlpha = () => {
    if (elapsed < LOGO_FADE_START_MS) return 0
    if (elapsed >= LOGO_FADE_END_MS) return 1
    return clamp01((elapsed - LOGO_FADE_START_MS) / LOGO_FADE_MS)
  }

  const glitchStrength = () => {
    // Brief pulse during first flash
    if (elapsed < FLASH_ONE_MS) {
      return Math.sin(clamp01(elapsed / FLASH_ONE_MS) * Math.PI) * 0.15
    }
    // Quiet during gap
    if (elapsed < FLASH_TWO_START_MS) return 0

    // EMP: ramp during second flash attack, peak at cloud start, quadratic decay
    let emp = 0
    if (elapsed < CLOUD_FADE_START_MS) {
      emp = clamp01((elapsed - FLASH_TWO_START_MS) / FLASH_TWO_ATTACK_MS) * 0.85
    } else {
      const decay = (elapsed - CLOUD_FADE_START_MS) / 800
      if (decay < 1) emp = (1 - decay) * (1 - decay) * 0.85
    }

    // Periodic aftershocks — high-power sins for sharp deterministic spikes
    const t = elapsed * 0.001
    const s1 = Math.pow(Math.max(0, Math.sin(t * 1.7 + 0.3)), 14) * 0.25
    const s2 = Math.pow(Math.max(0, Math.sin(t * 2.3 - 1.1)), 18) * 0.2
    const s3 = Math.pow(Math.max(0, Math.sin(t * 0.7 + 2.5)), 22) * 0.35

    return clamp01(emp + s1 + s2 + s3)
  }

  const applyGlitch = (buf: any, strength: number) => {
    const width = buf.width
    const height = buf.height
    const chars = buf.buffers.char
    const attrs = buf.buffers.attributes
    const fg = buf.buffers.fg
    const frameSeed = (((elapsed / 40) | 0) * 7919) >>> 0

    for (let y = 0; y < height; y++) {
      const rowHash = ((y * 73856093) ^ frameSeed) >>> 0
      if ((rowHash & 1023) / 1023 > strength) continue

      const rowStart = y * width
      const effect = (rowHash >> 10) & 3

      if (effect <= 1) {
        // Horizontal row displacement
        const maxShift = Math.ceil(strength * 5)
        const shift = ((rowHash >> 12) % (maxShift * 2 + 1)) - maxShift || 1

        if (shift > 0) {
          for (let x = width - 1; x >= shift; x--) {
            const di = rowStart + x,
              si = di - shift
            chars[di] = chars[si]
            attrs[di] = attrs[si]
            const dc = di * 4,
              sc = si * 4
            fg[dc] = fg[sc]
            fg[dc + 1] = fg[sc + 1]
            fg[dc + 2] = fg[sc + 2]
            fg[dc + 3] = fg[sc + 3]
          }
        } else {
          const s = -shift
          for (let x = 0; x < width - s; x++) {
            const di = rowStart + x,
              si = di + s
            chars[di] = chars[si]
            attrs[di] = attrs[si]
            const dc = di * 4,
              sc = si * 4
            fg[dc] = fg[sc]
            fg[dc + 1] = fg[sc + 1]
            fg[dc + 2] = fg[sc + 2]
            fg[dc + 3] = fg[sc + 3]
          }
        }
      } else if (effect === 2) {
        // Scanline flash — bright green-biased line
        const boost = strength * 0.7
        for (let x = 0; x < width; x++) {
          const ci = (rowStart + x) * 4
          fg[ci] = clamp01(fg[ci] + boost * 0.5)
          fg[ci + 1] = clamp01(fg[ci + 1] + boost)
          fg[ci + 2] = clamp01(fg[ci + 2] + boost * 0.4)
        }
      } else {
        // Chromatic aberration — offset green channel by 2 cells
        for (let x = width - 1; x >= 2; x--) {
          fg[(rowStart + x) * 4 + 1] = fg[(rowStart + x - 2) * 4 + 1]
        }
      }
    }
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

    if (elapsed >= LOGO_FADE_START_MS) {
      ensureLogoLayout(width, height)
      const logoReveal = logoAlpha()
      if (logoReveal > 0) {
        drawLogo(buf, logoReveal)
      }
    }

    const glitch = glitchStrength()
    if (glitch > 0.01) {
      applyGlitch(buf, glitch)
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
