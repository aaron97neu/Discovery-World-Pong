import { Box } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { selectDisplayTab } from "../redux/exhibitScreensSlice";
import DisplaySelect from "./DisplaySelect";
import VisualizerButtonGroup from "./VisualizerButtonGroup";
import { FC } from "react";

const Header: FC = () => {
  const screenTabState = useAppSelector(selectDisplayTab);
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
      <DisplaySelect tabState={screenTabState}></DisplaySelect>
      {screenTabState === "vertical" && (
        <VisualizerButtonGroup></VisualizerButtonGroup>
      )}
    </Box>
  );
};

export default Header;
