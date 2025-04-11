import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface LogTypeFilters {
  docker: boolean;
  console: boolean;
}

export type LogContainerKeys =
  | "mqtt-broker"
  | "mqtt-explorer"
  | "ai-paddle-control"
  | "log-server"
  | "game-engine"
  | "human-paddle-control"
  | "human-visualizer"
  | "neural-net-visualizer"
  | "clocktower-visualizer"
  | "audio-engine"
  | "single-screen-development";

export enum LogContainerColors {
  "mqtt-broker" = "#FF007F",
  "mqtt-explorer" = "#00FF7F",
  "ai-paddle-control" = "#007FFF",
  "log-server" = "#FF7F00",
  "game-engine" = "#7F00FF",
  "human-paddle-control" = "#00FFFF",
  "human-visualizer" = "#FF00FF",
  "neural-net-visualizer" = "#7FFF00",
  "clocktower-visualizer" = "#F54266",
  "audio-engine" = "#FFD700",
  "single-screen-development" = "#00FF00",
}

export type LogContainerFilters = Record<LogContainerKeys, boolean>;

interface ContainerInfoState {
  sidebarOpen: boolean;
  filters: {
    logType: LogTypeFilters;
    containers: LogContainerFilters;
  };
}
const initialState: ContainerInfoState = {
  sidebarOpen: false,
  filters: {
    logType: {
      docker: true,
      console: true,
    },
    containers: {
      "mqtt-broker": true,
      "mqtt-explorer": true,
      "ai-paddle-control": true,
      "log-server": true,
      "game-engine": true,
      "human-paddle-control": true,
      "human-visualizer": true,
      "neural-net-visualizer": true,
      "clocktower-visualizer": true,
      "audio-engine": true,
      "single-screen-development": true,
    },
  },
};

/**
 * The containerInfoSlice contains:
 *  If the sidebar is open
 *  What filters are set for the log display
 */
export const containerInfoSlice = createSlice({
  name: "containerInfo",
  initialState,
  reducers: {
    setSidebarOpen: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setLogTypeFilter: (state, action: PayloadAction<keyof LogTypeFilters>) => {
      state.filters.logType[action.payload] =
        !state.filters.logType[action.payload];
    },
    setContainerLogFilter: (state, action: PayloadAction<LogContainerKeys>) => {
      state.filters.containers[action.payload] =
        !state.filters.containers[action.payload];
    },
    setAllContainerLogFiltersOff: (state) => {
      Object.keys(state.filters.containers).forEach((k) => {
        state.filters.containers[k as LogContainerKeys] = false;
      });
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSidebarOpen,
  setLogTypeFilter,
  setContainerLogFilter,
  setAllContainerLogFiltersOff,
  resetFilters,
} = containerInfoSlice.actions;

export const selectSideBarState = (state: RootState) =>
  state.containerInfo.sidebarOpen;

export const selectLogFiltersState = (state: RootState) =>
  state.containerInfo.filters;

export default containerInfoSlice.reducer;
