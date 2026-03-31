// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { TargetChannel, VignetteEffect } from "@opentui/core"
import { useTerminalDimensions } from "@opentui/solid"
import type { TuiPlugin, TuiPluginModule, TuiSlotPlugin, TuiThemeCurrent } from "@opencode-ai/plugin/tui"
import { Show, createMemo, createSignal } from "solid-js"
import {
  SettingsDialog,
  createSettingKey,
  settingByField,
  type Field,
  type NumberField,
  type SettingsState,
  type ToggleField,
} from "./settings-dialog"
import { PipBoyContext } from "./context"
import { createNukeCommand } from "./nuke-command"
import { Side } from "./side"
import { Tips } from "./tips"

const id = "vault-tec"

const home = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡶⠶⠶⢶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠘⠛⠛⠛⠛⢻⡿⠁⣠⣤⣤⣄⠈⢿⡟⠛⠛⠛⠛⠃⠀⠀⠀⠀",
  "⠶⠶⠶⠶⠶⠶⠶⠶⠶⢾⡁⠀⣿⣿⣿⣿⠀⢨⡷⠶⠶⠶⠶⠶⠶⠶⠶⠶",
  "⠀⠀⠀⠀⢤⣴⣶⣶⣶⣾⣷⡀⠙⠛⠛⠋⢀⣾⣷⣶⣶⣶⣦⡤⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠷⠶⠶⠾⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
]

const home1 = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡿⣷⣤⡾⠟⠻⠿⠛⠉⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣇⣀⣠⠷⢶⣄⣠⣤⡀⠀⠈⠻⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡏⠉⠀⢀⡤⠈⠉⠙⢷⣄⣀⣀⠻⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⣽⡿⠆⢠⡟⠀⢀⡀⠀⠈⠁⠈⣹⠀⢿⡆⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡿⠀⠉⢡⡴⠋⠀⢺⣿⠙⠂⠀⢠⣿⡉⢀⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣧⣦⠀⠸⠷⠀⠀⠘⠋⠀⠀⠀⣸⣿⣿⣾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡟⠻⣝⡓⠶⠤⠤⣿⡄⠀⠀⠈⠛⢽⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡀⠸⠿⠓⠒⠋⠛⠁⠀⠀⣀⣀⣼⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⢀⣤⣶⠶⢶⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⣠⣴⡾⠟⠛⢳⣾⣿⣄⡀⠀⠀⠀⢀⣠⣴⣿⡛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⣸⡟⠻⠷⠶⣦⣤⣽⣿⡇⠀⠀⠀⠀⢀⣼⠟⠁⠀⠀⠀⠘⠳⣤⠙⢿⣶⣂⣀⣽⢿⣩⠿⠙⢿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⣰⣿⣄⣀⣀⠀⠀⣿⠃⣿⡇⠀⠀⠀⠀⣾⠏⠀⠀⠀⠀⠀⠀⢠⡿⠀⠀⠀⠀⣴⠟⠋⠀⠀⠀⠀⠈⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣸⠟⣻⠁⠀⢹⣿⣿⣷⢾⣿⡆⠀⠀⠀⠀⣿⠀⠀⢠⡄⠀⠀⠀⣾⠁⠀⠀⠀⢰⠏⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣧⡀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⢸⡟⢠⡇⠀⠀⣾⡇⢙⣿⠟⠋⠀⠀⠀⠀⠀⣿⣀⡀⢸⡇⠀⠀⢠⡇⠀⠀⠀⠀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⡄⠀⠀⠀⠀⠀⠀",
  "⢀⣿⠃⡾⠁⠀⢰⣿⠁⣽⡿⠿⣦⣤⣶⢶⣶⣾⣯⡉⠙⠟⣷⠀⠀⣾⠁⠀⠀⠀⢀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡆⠀⠀⠀⠀⠀",
  "⢸⣷⣠⠇⠀⠀⣾⠏⢀⣿⠻⠶⣶⡟⢀⡏⢰⠏⣿⢿⣄⡀⢸⡆⠀⡟⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠘⢷⣦⡀⠀⠀⠀⠀⠈⣿⡄⠀⠀⠀⠀",
  "⢀⣾⢿⣤⣀⣼⡿⣦⣼⠇⠀⠀⠘⢿⣭⢡⣼⡀⢻⣦⣄⣉⣛⠛⠿⠧⣄⣀⡀⠀⠸⣇⣀⣀⣀⣀⣀⣠⡿⠉⠻⣦⡀⠀⠀⠀⢸⣿⠀⠀⠀⠀",
  "⢸⣏⠀⠀⠉⠙⢣⣿⠀⠀⠀⠀⠀⠀⠛⠛⠛⠛⠛⠛⠛⠋⢻⣿⠳⠦⢤⣄⣉⡙⠲⠦⠤⣀⣀⠀⠀⣾⠇⠀⠀⠹⣷⡀⠀⠀⠀⢻⡄⠀⠀⠀",
  "⠈⠛⠻⠷⣶⣤⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡟⠀⠀⠀⠈⠉⠙⠓⠶⢦⣤⣉⡙⠒⠻⣶⣤⣤⣀⣽⣷⣤⣤⠶⠻⣧⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡾⠛⠓⠶⠦⣤⣤⣤⣤⣤⣤⣤⠼⠿⠛⣿⣶⣤⣭⣝⡙⢺⡆⠀⠀⠀⣿⡀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡿⠁⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡄⠈⠹⣿⠛⣡⠄⣀⣴⣟⡻⣷⡀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⠀⠀⠀⠀⠀⠀⠀⠀⢻⡀⠀⠀⠀⠀⠀⠀⠀⠘⣷⡀⠀⠙⠛⠛⠛⠛⠋⠛⠛⠋⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡿⠀⠀⠀⠀⠀⠀⠀⢀⣴⡟⢿⣄⠀⠀⠀⠀⠀⠀⠀⢹⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⠀⠀⢠⡾⠋⠀⠈⢻⣆⠀⠀⠀⠀⠀⠀⠀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⢠⡿⠁⠀⠀⠀⠀⠻⣧⠀⠀⠀⠀⠀⠀⠘⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⣸⡇⠀⠀⠀⠀⠀⠀⢻⣧⠀⠀⠀⠀⠀⠀⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡄⠀⠀⠀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⢻⣧⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣧⠀⠀⠀⠀⣀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣧⠀⠀⠀⠀⠸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡶⠛⠛⢒⣿⣯⣭⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣷⠖⠒⠒⠛⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠿⠶⠾⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⢷⣤⣀⣴⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
]

const home2 = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣄⣴⣿⣿⣶⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣄⣠⠾⠛⠿⠃⠈⠻⣿⢿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⣸⠿⢃⣴⣿⣶⣶⠾⣶⣼⣤⣤⠸⣧⠻⣷⣦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣧⢋⣦⢶⣿⡿⣿⣿⡷⣌⣿⢿⢁⢼⣿⡎⠿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣤⣿⣿⣿⠟⠋⣼⣏⣸⡏⢣⢧⣧⣠⢹⣿⣭⢑⢕⠻⠀⠀⠀⠙⠻⣿⣿⣿⣦⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢯⣶⣿⢸⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⣿⣿⣿⡀⢿⣿⡟⣿⣿⣾⣬⣕⣕⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡸⣿⣏⢾⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⢿⠸⣛⣛⣛⣛⡭⠌⣻⣿⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⢘⣛⣃⣙⠿⣮⡛⢿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠘⢿⣶⡊⢩⣵⣾⣷⣿⡟⠝⣠⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⡛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⠿⠿⣿⡎⢿⡌⢙⣋⣀⠀⠀⠀⠀⢀⣀⣀⣌⠛⢿⣿⣿⣿⣿⣟⡁⣴⣯⢙⡻⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣶⡜⡿⠃⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣷⣄⣉⣉⣛⣡⣾⡿⢃⣾⣿⣷⣯⡳⡀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣀⣤⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡃⣶⣶⣶⣮⠕⡿⠀⣸⣿⣿⣿⣿⣿⣿⡟⣿⣿⣿⡷⢹⣿⣿⣿⠿⢟⣩⣴⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣤⣀⠀⠀",
  "⠐⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣜⣛⣂⡊⠁⠴⠿⠿⠿⠟⠛⠛⠉⠁⣿⣿⣿⡇⣿⣿⣿⡇⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠂",
  "⠀⠀⠀⠉⠛⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⢿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⢱⣿⣿⣿⢡⣿⣿⣿⣿⣶⣭⣛⠿⢿⣿⣿⣿⣿⣿⣆⠀⠀⠀⢸⣿⣿⡿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠛⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⢸⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⡏⣸⣷⢢⣿⣿⣿⣿⡟⠀⠀⠀⣼⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣆⠀⠀⠀⠀⠀⠀⢸⣿⣿⢸⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⢃⡿⣣⣿⣿⣿⣿⡟⠀⠀⠀⢠⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣴⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⣆⠀⠀⠀⠀⠀⢰⣬⣛⢸⣿⣿⣿⢸⣿⣿⣿⠿⠿⢛⠘⢡⣿⣿⣿⣿⡟⠀⠀⠀⢠⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣾⣿⣿⢀⣦⣙⠻⠿⠟⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⢭⣛⡻⠿⠿⣿⣿⣿⠿⠿⠿⢛⣃⡈⣿⣿⡟⠴⡄⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣷⣦⡀⠸⣿⣿⣿⣿⣶⣶⣶⣿⣿⣿⣿⣿⣧⠙⠛⠛⢒⣡⣾⣿⣿⠿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣷⣆⣉⠙⠛⠻⠿⠿⠿⠿⠿⠟⠛⠋⢁⣰⣾⣿⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⣿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠊⣹⠁⠀⡀⣬⢰⡆⡇⡀⠀⢀⠀⡤⠀⠀⠀⠈⠙⠛⠻⠿⠿⠿⠿⠿⠿⠿⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡞⠀⢠⠇⡼⢡⠇⡇⡞⠈⠓⠁⠃⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⣡⡞⠀⠑⠉⠀⠀⠀⠀⠀⢸⣿⢀⣿⡇⣿⢿⡇⢸⣿⢸⣿⢸⣿⠸⢿⣿⠿⠀⠸⢿⣿⠿⢸⣿⠛⢠⣾⠛⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⡱⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⢠⣿⢸⣇⢸⣿⢸⣿⢸⣿⠀⢸⣿⢠⣤⡄⢸⣿⠀⢸⣿⠶⢸⣿⠀⣉⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⡿⢸⣿⢹⣿⠸⣿⣼⡿⢸⣿⣤⢸⣿⠀⠀⠀⢸⣿⠀⠸⣿⣤⡌⣿⣤⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
]

const width = (list: string[]) => {
  return Math.max(...list.map((line) => line.length))
}

const home1w = width(home1)
const home2w = width(home2)

type Cfg = {
  enabled: boolean
  theme: string
} & SettingsState

type Api = Parameters<TuiPlugin>[0]

const settingKey = createSettingKey(id)

const rec = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return
  return Object.fromEntries(Object.entries(value))
}

const pick = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback
  if (!value.trim()) return fallback
  return value
}

const bool = (value: unknown, fallback: boolean) => {
  if (typeof value !== "boolean") return fallback
  return value
}

const num = (value: unknown, fallback: number) => {
  if (typeof value !== "number") return fallback
  return value
}

const cfg = (opts: Record<string, unknown> | undefined): Cfg => {
  return {
    enabled: bool(opts?.enabled, true),
    theme: pick(opts?.theme, "vault-tec"),
    set: bool(opts?.set_theme, true),
    scan: bool(opts?.scanlines, true),
    scanSpeed: Math.max(0, num(opts?.scanline_speed, 0.012)),
    vignette: Math.max(0, num(opts?.vignette, 0.75)),
    sidebar: bool(opts?.sidebar, true),
    tips: bool(opts?.tips, true),
  }
}

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const withKV = (api: Api, value: Cfg): Cfg => {
  return {
    ...value,
    set: bool(api.kv.get(settingKey.set, value.set), value.set),
    scan: bool(api.kv.get(settingKey.scan, value.scan), value.scan),
    scanSpeed: Math.max(0, num(api.kv.get(settingKey.scanSpeed, value.scanSpeed), value.scanSpeed)),
    vignette: clamp(num(api.kv.get(settingKey.vignette, value.vignette), value.vignette), 0, 1),
    sidebar: bool(api.kv.get(settingKey.sidebar, value.sidebar), value.sidebar),
    tips: bool(api.kv.get(settingKey.tips, value.tips), value.tips),
  }
}

const Home = (props: { theme: TuiThemeCurrent }) => {
  const dim = useTerminalDimensions()
  const [gap, setGap] = createSignal({
    width: 0,
    height: 0,
  })
  const logo = createMemo(() => {
    const term = dim()
    const chrome = gap()
    const h = Math.max(0, term.height - chrome.height)
    const w = Math.max(0, term.width - chrome.width)
    if (h >= home2.length && w >= home2w) return home2
    if (h >= home1.length && w >= home1w) return home1
    return home
  })

  return (
    <box
      onSizeChange={function () {
        const term = dim()
        const own = {
          width: this.width,
          height: this.height,
        }
        const next = {
          width: Math.max(0, term.width - own.width),
          height: Math.max(0, term.height - own.height),
        }
        const wide = own.width >= home1w
        setGap((prev) => {
          const width = wide ? (prev.width > 0 ? Math.min(prev.width, next.width) : next.width) : prev.width
          const height = prev.height > 0 ? Math.min(prev.height, next.height) : next.height
          if (prev.width === width && prev.height === height) return prev
          return {
            width,
            height,
          }
        })
      }}
      flexDirection="column"
      alignItems="center"
    >
      {(() => {
        const lines = logo()
        const big = lines !== home
        return lines.map((line, i) => (
          <text fg={big ? props.theme.text : i < 2 ? props.theme.textMuted : props.theme.text}>{line}</text>
        ))
      })()}
    </box>
  )
}

const vaultPrompts = {
  normal: [
    "Check Vault 101 Overseer logs for containment breaches",
    "Analyze G.E.C.K. module output for radiation leaks",
    "Audit Vault 127 reactor coolant loop for anomalies",
    "Generate S.P.E.C.I.A.L. stats for new Vault Dweller",
    "Inspect Pip-Boy V.A.T.S. targeting calibration matrix",
    "Decode holotape archive from Big MT R&D facility",
  ],
  shell: [
    "vault-tec --scan --deep --sector 7G",
    "pipboy diagnostics --module geiger --verbose",
    "robco status --vault 127 --seal-integrity",
    "grep -r 'containment breach' /vault/logs/overseer/",
    "vault-reactor --check-coolant --level B4",
    "nuka-cola --inventory --flavor quantum",
  ],
}

const slot = (api: Api, value: () => Cfg): TuiSlotPlugin[] => {
  return [
    {
      slots: {
        home_logo(ctx) {
          return <Home theme={ctx.theme.current} />
        },
        home_prompt(ctx, value) {
          type Prompt = (props: {
            workspaceID?: string
            hint?: JSX.Element
            placeholders?: {
              normal?: string[]
              shell?: string[]
            }
          }) => JSX.Element
          if (!("Prompt" in api.ui)) return null
          const view = api.ui.Prompt
          if (typeof view !== "function") return null
          const Prompt = view as Prompt
          const theme = ctx.theme.current
          const Hint = (
            <box flexShrink={0} flexDirection="row" gap={1}>
              <text fg={theme.textMuted}>
                <span style={{ fg: theme.primary }}>Vault-Tec</span> Terminal
              </text>
            </box>
          )
          return (
            <Prompt
              workspaceID={value.workspace_id}
              hint={Hint}
              placeholders={{ normal: vaultPrompts.normal, shell: vaultPrompts.shell }}
            />
          )
        },
      },
    },
    {
      order: 50,
      slots: {
        sidebar_content(ctx) {
          return (
            <Show when={value().sidebar}>
              <Side theme={ctx.theme.current} />
            </Show>
          )
        },
      },
    },
    {
      order: 51,
      slots: {
        sidebar_content(ctx, input) {
          return (
            <Show when={value().sidebar}>
              <PipBoyContext theme={ctx.theme.current} api={api} sessionId={input.session_id} />
            </Show>
          )
        },
      },
    },
    {
      order: 100,
      slots: {
        home_bottom(ctx) {
          const hide = createMemo(() => api.kv.get("tips_hidden", false))
          const first = createMemo(() => api.state.session.count() === 0)
          const show = createMemo(() => !first() && !hide())
          return (
            <Show when={value().tips}>
              <Tips theme={ctx.theme.current} show={show()} />
            </Show>
          )
        },
      },
    },
  ]
}

const SCAN_GAIN_MATRIX = new Float32Array([
  2,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  0,
  2,
  0,
  0,
  0,
  0,
  1,
])

const SCAN_BAND_SIZES = new Int32Array([6, 8, 5])
const SCAN_BAND_BOOSTS = new Float32Array([0.35, 0.25, 0.3])
const SCAN_BAND_PHASES = new Float32Array([0, 0.35, 0.7])
const SCAN_MAX_ACTIVE_ROWS = 19

const createScanBandWeights = () => {
  const count = SCAN_BAND_SIZES.length
  const weights = new Array<Float32Array>(count)
  for (let band = 0; band < count; band++) {
    const size = SCAN_BAND_SIZES[band]
    const half = size * 0.5
    const boost = SCAN_BAND_BOOSTS[band]
    const rowWeights = new Float32Array(size)
    for (let i = 0; i < size; i++) {
      const dist = Math.abs(i - half) / half
      rowWeights[i] = (1 - dist * dist) * boost
    }
    weights[band] = rowWeights
  }
  return weights
}

const scan = (v: number, speed: number, enabled: boolean) => {
  const vignette = v > 0 ? new VignetteEffect(v) : undefined
  const bandWeights = createScanBandWeights()

  let time = 0
  let cachedWidth = -1
  let cachedHeight = -1

  let rowBoost = new Float32Array(0)
  const activeRows = new Int32Array(SCAN_MAX_ACTIVE_ROWS)
  const rowBaseOffset = new Int32Array(SCAN_MAX_ACTIVE_ROWS)
  let cellMask = new Float32Array(0)

  const ensureCache = (width: number, height: number) => {
    if (width === cachedWidth && height === cachedHeight) return

    cachedWidth = width
    cachedHeight = height
    rowBoost = new Float32Array(height)
    cellMask = new Float32Array(width * SCAN_MAX_ACTIVE_ROWS * 3)

    for (let row = 0; row < SCAN_MAX_ACTIVE_ROWS; row++) {
      const base = row * width * 3
      rowBaseOffset[row] = base
      let idx = base
      for (let x = 0; x < width; x++) {
        cellMask[idx] = x
        idx += 3
      }
    }
  }

  return (buf: Parameters<VignetteEffect["apply"]>[0], dt: number) => {
    if (enabled) {
      const width = buf.width
      const height = buf.height

      if (width > 0 && height > 0) {
        ensureCache(width, height)
        rowBoost.fill(0)

        time += dt
        const basePhase = (time * speed) / height

        for (let band = 0; band < SCAN_BAND_SIZES.length; band++) {
          const size = SCAN_BAND_SIZES[band]
          const weights = bandWeights[band]

          let phase = basePhase + SCAN_BAND_PHASES[band]
          phase -= Math.floor(phase)
          const start = Math.floor((1 - phase) * height)

          for (let i = 0; i < size; i++) {
            let y = start + i
            if (y >= height) y %= height
            rowBoost[y] += weights[i]
          }
        }

        let rowCount = 0
        for (let y = 0; y < height; y++) {
          if (rowBoost[y] <= 0) continue
          activeRows[rowCount++] = y
        }

        for (let row = 0; row < SCAN_MAX_ACTIVE_ROWS; row++) {
          const y = row < rowCount ? activeRows[row] : 0
          const strength = row < rowCount ? rowBoost[y] : 0
          let idx = rowBaseOffset[row] + 1
          for (let x = 0; x < width; x++) {
            cellMask[idx] = y
            cellMask[idx + 1] = strength
            idx += 3
          }
        }

        buf.colorMatrix(SCAN_GAIN_MATRIX, cellMask, 1.0, TargetChannel.Both)
      }
    }

    if (vignette) {
      vignette.apply(buf)
    }
  }
}

const tui: TuiPlugin = async (api, options) => {
  const boot = cfg(rec(options))
  if (!boot.enabled) return

  const [value, setValue] = createSignal(withKV(api, boot))

  await api.theme.install("./vault-tec.json")
  if (value().set) {
    api.theme.set(value().theme)
  }

  let tips = false
  const disableTips = async () => {
    if (tips) return
    const item = api.plugins.list().find((entry) => entry.id === "internal:home-tips")
    if (!item?.enabled || !item.active) return
    const ok = await api.plugins.deactivate("internal:home-tips")
    if (!ok) {
      api.ui.toast({
        variant: "warning",
        message: "Vault tips enabled, but default tips could not be disabled.",
      })
      return
    }
    tips = true
  }

  const restoreTips = async () => {
    if (!tips) return
    const ok = await api.plugins.activate("internal:home-tips")
    if (!ok) {
      api.ui.toast({
        variant: "warning",
        message: "Failed to restore default home tips.",
      })
      return
    }
    tips = false
  }

  const write = (key: Field, next: unknown) => {
    api.kv.set(settingKey[key], next)
  }

  let post: ReturnType<typeof scan> | undefined
  let live = false
  const applyScan = () => {
    if (post) {
      api.renderer.removePostProcessFn(post)
      post = undefined
    }

    const state = value()
    const hasVignette = state.vignette > 0
    if (!state.scan && !hasVignette) {
      if (live) {
        api.renderer.dropLive()
        live = false
      }
      return
    }

    post = scan(state.vignette, state.scanSpeed, state.scan)
    api.renderer.addPostProcessFn(post)

    if (state.scan && !live) {
      api.renderer.requestLive()
      live = true
    }

    if (!state.scan && live) {
      api.renderer.dropLive()
      live = false
    }
  }

  const update = (key: Field, next: unknown) => {
    const prev = value()
    if (prev[key] === next) return
    const state = {
      ...prev,
      [key]: next,
    }
    setValue(state)
    write(key, state[key])

    if (key === "set" && state.set) {
      api.theme.set(state.theme)
    }

    if (key === "scan" || key === "scanSpeed" || key === "vignette") {
      applyScan()
    }

    if (key === "tips") {
      if (state.tips) {
        void disableTips()
      } else {
        void restoreTips()
      }
    }
  }

  const flip = (key: ToggleField) => {
    update(key, !value()[key])
  }

  const tune = (key: NumberField, dir: -1 | 1) => {
    const item = settingByField[key]
    if (!item || item.kind !== "number") return
    let next = value()[key] + (item.step ?? 1) * dir
    if (typeof item.min === "number") next = Math.max(item.min, next)
    if (typeof item.max === "number") next = Math.min(item.max, next)
    next = Number(next.toFixed(item.digits ?? 3))
    update(key, next)
  }

  const showSettings = () => {
    api.ui.dialog.replace(() => <SettingsDialog api={api} value={value} flip={flip} tune={tune} />)
  }

  if (value().tips) {
    await disableTips()
  }
  await api.plugins.deactivate("internal:sidebar-context")
  applyScan()

  const nuke = createNukeCommand(api)

  api.command.register(() => [
    {
      title: "Vault-Tec settings",
      value: "vault-tec.settings",
      category: "System",
      onSelect() {
        showSettings()
      },
    },
    {
      title: api.kv.get("tips_hidden", false) ? "Show tips" : "Hide tips",
      value: "tips.toggle",
      keybind: "tips_toggle",
      category: "System",
      hidden: api.route.current.name !== "home" || !value().tips,
      onSelect() {
        if (!value().tips) return
        api.kv.set("tips_hidden", !api.kv.get("tips_hidden", false))
        api.ui.dialog.clear()
      },
    },
    nuke.command,
  ])

  api.lifecycle.onDispose(async () => {
    nuke.dispose()
    await restoreTips()
    if (post) {
      api.renderer.removePostProcessFn(post)
    }
    if (live) {
      api.renderer.dropLive()
    }
  })

  for (const item of slot(api, value)) {
    api.slots.register(item)
  }

  api.renderer.targetFps = 30
  api.renderer.maxFps = 30
}

const plugin: TuiPluginModule & { id: string } = {
  id,
  tui,
}

export default plugin
