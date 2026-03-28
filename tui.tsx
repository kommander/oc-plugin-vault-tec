// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { VignetteEffect } from "@opentui/core"
import { useTerminalDimensions } from "@opentui/solid"
import type { TuiPlugin, TuiPluginModule, TuiSlotPlugin, TuiThemeCurrent } from "@opencode-ai/plugin/tui"
import { createMemo, createSignal } from "solid-js"
import { Tips } from "./tips"

const id = "vault-tec"

const home = [
  "__      __         _ _      _______         ",
  "\\ \\    / /        | | |    |__   __|        ",
  " \\ \\  / /_ _ _   _| | |_      | | ___  ___ ",
  "  \\ \\/ / _` | | | | | __|     | |/ _ \\/ __|",
  "   \\  / (_| | |_| | | |_      | |  __/ (__ ",
  "    \\/ \\__,_|\\__,_|_|\\__|     |_|\\___|\\___|",
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

const home2w = width(home2)

const side = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⢀⣄⠀⣠⠶⠲⠞⠁⠀⠙⠛⠳⣆⠀⠀⠀⠀⠀",
  "⠀⡟⠙⠛⠁⣀⣀⢀⡤⢤⠀⠀⠀⠙⢷⣄⠀⠀⠀",
  "⢠⡷⢄⣠⠊⠀⠀⠁⠀⡀⠑⠒⠈⢳⠀⢻⡆⠀⠀",
  "⠀⣷⠃⢠⡀⠀⠀⠀⠀⠈⠀⠀⠀⢎⠀⢸⡇⠀⠀",
  "⢠⡇⠀⠘⢁⡄⠀⠀⠉⠉⠀⠀⠀⣳⢧⣾⠃⠀⠀",
  "⢸⡇⠀⠀⠘⠆⠀⠀⢀⠀⠀⠀⠀⠁⢿⡏⠀⠀⠀",
  "⠈⣇⠸⢖⡀⠀⠐⣂⠹⡇⠀⠀⠀⣀⣼⠇⠀⠀⠀",
  "⠀⠹⣦⠀⠈⠭⠉⠀⠀⠀⠀⣠⡾⠉⠁⠀⠀⠀⠀",
  "⠀⠀⠈⠳⢦⣄⣀⣀⣠⡴⠞⠋⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
]

type Cfg = {
  enabled: boolean
  theme: string
  set: boolean
  scan: boolean
  scanSpeed: number
  vignette: number
  sidebar: boolean
  tips: boolean
}

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
        const wide = own.width >= home2w
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
        const big = lines === home2
        return lines.map((line, i) => (
          <text fg={big ? props.theme.text : i < 2 ? props.theme.textMuted : props.theme.text}>{line}</text>
        ))
      })()}
    </box>
  )
}

const Side = (props: { theme: TuiThemeCurrent }) => {
  return (
    <box
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={1}
      paddingRight={1}
      alignItems="center"
    >
      <box flexDirection="column">
        {side.map((line) => (
          <text fg={props.theme.textMuted} selectable={false}>
            {line}
          </text>
        ))}
      </box>
    </box>
  )
}

const Card = (props: { theme: TuiThemeCurrent; session: string }) => {
  return (
    <box
      paddingTop={1}
      paddingBottom={1}
      paddingLeft={2}
      paddingRight={2}
      flexDirection="column"
      gap={1}
    >
      <text fg={props.theme.primary}>
        <b>Vault-Tec monitor</b>
      </text>
      <text fg={props.theme.textMuted}>session {props.session.slice(0, 8)}</text>
      <text fg={props.theme.success}>Vault seal integrity: NOMINAL</text>
    </box>
  )
}

const slot = (api: Parameters<TuiPlugin>[0], value: Cfg): TuiSlotPlugin[] => {
  return [
    {
      slots: {
        home_logo(ctx) {
          return <Home theme={ctx.theme.current} />
        },
      },
    },
    ...(value.sidebar
      ? [
          {
            order: 50,
            slots: {
              sidebar_content(ctx) {
                return <Side theme={ctx.theme.current} />
              },
            },
          },
          {
            order: 650,
            slots: {
              sidebar_content(ctx, input) {
                return <Card theme={ctx.theme.current} session={input.session_id} />
              },
            },
          },
        ]
      : []),
    ...(value.tips
      ? [
          {
            order: 100,
            slots: {
              home_bottom(ctx) {
                const hide = createMemo(() => api.kv.get("tips_hidden", false))
                const first = createMemo(() => api.state.session.count() === 0)
                const show = createMemo(() => !first() && !hide())
                return <Tips theme={ctx.theme.current} show={show()} />
              },
            },
          },
        ]
      : []),
  ]
}

const scan = (v: number, speed: number) => {
  const vignette = new VignetteEffect(v)
  let time = 0
  return (buf: Parameters<typeof vignette.apply>[0], dt: number) => {
    const w = buf.width
    const h = buf.height
    const fg = buf.buffers.fg
    const bg = buf.buffers.bg
    time += dt

    // Multiple v-sync bands moving bottom-to-top at the same speed
    // Each band has a different size, boost, and phase offset
    const bands = [
      { size: 6, boost: 0.35, phase: 0 },
      { size: 8, boost: 0.25, phase: 0.35 },
      { size: 5, boost: 0.3, phase: 0.7 },
    ]

    // Build per-row brightness multiplier
    const rowBoost = new Float32Array(h)
    for (const band of bands) {
      // All bands move upward at the same speed, offset by phase
      const pos = (1 - (((time * speed) / h + band.phase) % 1)) * h
      const half = band.size / 2
      for (let i = 0; i < band.size; i++) {
        const y = Math.floor(pos + i) % h
        const dist = Math.abs(i - half) / half
        rowBoost[y] += (1 - dist * dist) * band.boost
      }
    }

    // Apply per-row
    for (let y = 0; y < h; y++) {
      const b = rowBoost[y]
      if (b === 0) continue
      const mult = 1 + b
      for (let x = 0; x < w; x++) {
        const ci = (y * w + x) * 4
        fg[ci] = Math.min(1, fg[ci] * mult)
        fg[ci + 1] = Math.min(1, fg[ci + 1] * mult)
        fg[ci + 2] = Math.min(1, fg[ci + 2] * mult)
        bg[ci] = Math.min(1, bg[ci] * mult)
        bg[ci + 1] = Math.min(1, bg[ci + 1] * mult)
        bg[ci + 2] = Math.min(1, bg[ci + 2] * mult)
      }
    }

    // Vignette
    vignette.apply(buf)
  }
}

const tui: TuiPlugin = async (api, options) => {
  const value = cfg(rec(options))
  if (!value.enabled) return

  await api.theme.install("./vault-tec.json")
  if (value.set) {
    api.theme.set(value.theme)
  }

  let tips = false
  if (value.tips) {
    const row = api.plugins.list().find((item) => item.id === "internal:home-tips")
    if (row?.enabled) {
      tips = await api.plugins.deactivate("internal:home-tips")
    }

    api.command.register(() => [
      {
        title: api.kv.get("tips_hidden", false) ? "Show tips" : "Hide tips",
        value: "tips.toggle",
        keybind: "tips_toggle",
        category: "System",
        hidden: api.route.current.name !== "home",
        onSelect() {
          api.kv.set("tips_hidden", !api.kv.get("tips_hidden", false))
          api.ui.dialog.clear()
        },
      },
    ])
  }

  let post: ReturnType<typeof scan> | undefined
  let live = false
  if (value.scan) {
    post = scan(value.vignette, value.scanSpeed)
    api.renderer.addPostProcessFn(post)
    api.renderer.requestLive()
    live = true
  }
  api.lifecycle.onDispose(async () => {
    if (tips) {
      await api.plugins.activate("internal:home-tips")
    }
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
}

const plugin: TuiPluginModule & { id: string } = {
  id,
  tui,
}

export default plugin
