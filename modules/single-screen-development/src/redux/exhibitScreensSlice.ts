import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export type DisplayTabs = "game" | "vertical";

export enum VERTICAL_SCREEN_NAMES {
  NETWORK_VISUALIZER = "networkVisualizer",
  CLOCK_VISUALIZER = "clockVisualizer",
  HUMAN_VISUALIZER = "humanVisualizer",
}

interface ContainerLogCounts extends Record<string, number>{
  "human-visualizer": number;
  "neural-net-visualizer": number;
  "clocktower-visualizer": number;
  "game-engine": number;
}

interface ExhibitScreenState {
  displayTab: DisplayTabs;
  sidebarOpen: boolean;
  verticalScreensShowing: {
    humanVisualizer: boolean;
    clockVisualizer: boolean;
    networkVisualizer: boolean;
  };
  newContainerLogCounts: ContainerLogCounts
}

const initialState: ExhibitScreenState = {
  displayTab: "vertical",
  sidebarOpen: false,
  verticalScreensShowing: {
    humanVisualizer: true,
    clockVisualizer: true,
    networkVisualizer: true,
  },
  newContainerLogCounts : {
    "human-visualizer": 0,
    "neural-net-visualizer": 0,
    "clocktower-visualizer": 0,
    "game-engine": 0
  }
};



export const exhibitScreensSlice = createSlice({
  name: "exhibitScreens",
  initialState,
  reducers: {
    toggleSideScreenDisplays: (
      state,
      action: PayloadAction<{ screenName: VERTICAL_SCREEN_NAMES }>
    ) => {
      state.verticalScreensShowing[action.payload.screenName] =
        !state.verticalScreensShowing[action.payload.screenName];
    },
    setDisplayTab: (state, action: PayloadAction<{ tab: DisplayTabs }>) => {
      state.displayTab = action.payload.tab;
    },
    setContainerLogCount: (state, action: PayloadAction<{ container: string, value: number }>) => {
      state.newContainerLogCounts[action.payload.container] = action.payload.value;
    },
    resetLogCounts: (state) => {
      state.newContainerLogCounts = initialState.newContainerLogCounts;
    },
    incrementContainerLogCount: (state, action: PayloadAction<string>) => {
      state.newContainerLogCounts[action.payload] = state.newContainerLogCounts[action.payload] + 1;
    },
  },
});

export const { toggleSideScreenDisplays, setDisplayTab, setContainerLogCount, incrementContainerLogCount, resetLogCounts } =
  exhibitScreensSlice.actions;

export const selectVerticalScreens = (state: RootState) =>
  state.exhibitScreens.verticalScreensShowing;

export const selectDisplayTab = (state: RootState) =>
  state.exhibitScreens.displayTab;

export const selectContainerLogCount = (state: RootState) =>
  state.exhibitScreens.newContainerLogCounts;

export default exhibitScreensSlice.reducer;
