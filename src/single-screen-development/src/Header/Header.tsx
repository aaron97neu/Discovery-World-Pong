import { Box, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectDisplayTab } from "../redux/exhibitScreensSlice";
import DisplaySelect from "./DisplaySelect";
import VisualizerButtonGroup from "./VisualizerButtonGroup";
import ViewSidebarRoundedIcon from '@mui/icons-material/ViewSidebarRounded';
import { FC } from "react";
import { setSidebarOpen } from "../redux/containerInfoSlice";

const Header: FC = () => {
  const screenTabState = useAppSelector(selectDisplayTab);
  const dispatch = useAppDispatch();
  const handleSidebarButtonClick = () => {
    dispatch(setSidebarOpen());
  }
  return (
    <Box
      className="Header"
      sx={{
        display: "flex",
        minHeight: "65px",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
        <Box sx={{
          display: "flex"
        }}>
          <IconButton onClick={handleSidebarButtonClick}>
            <ViewSidebarRoundedIcon ></ViewSidebarRoundedIcon>
          </IconButton>
          <DisplaySelect tabState={screenTabState}></DisplaySelect>
        </Box>
      {screenTabState === "vertical" && (
        <VisualizerButtonGroup></VisualizerButtonGroup>
      )}
    </Box>
  );
};

export default Header;
