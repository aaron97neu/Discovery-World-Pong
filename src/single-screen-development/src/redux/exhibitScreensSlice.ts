import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export type DisplayTabs = "game" | "vertical";

export enum VERTICAL_SCREEN_NAMES {
  NETWORK_VISUALIZER = "networkVisualizer",
  CLOCK_VISUALIZER = "clockVisualizer",
  HUMAN_VISUALIZER = "humanVisualizer",
}

interface ExhibitScreenState {
  displayTab: DisplayTabs;
  verticalScreensShowing: {
    humanVisualizer: boolean;
    clockVisualizer: boolean;
    networkVisualizer: boolean;
  };
}

const initialState: ExhibitScreenState = {
  displayTab: "vertical",
  verticalScreensShowing: {
    humanVisualizer: true,
    clockVisualizer: true,
    networkVisualizer: true,
  },
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
  },
});

export const { toggleSideScreenDisplays, setDisplayTab } =
  exhibitScreensSlice.actions;

export const selectVerticalScreens = (state: RootState) =>
  state.exhibitScreens.verticalScreensShowing;

export const selectDisplayTab = (state: RootState) =>
  state.exhibitScreens.displayTab;

export default exhibitScreensSlice.reducer;
