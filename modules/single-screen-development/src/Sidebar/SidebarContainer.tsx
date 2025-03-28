import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { Log } from "../Main";
import { selectSideBarState } from "../redux/containerInfoSlice";
import LogFilters from "./LogFilters";
import LogStreamDisplay from "./LogStreamDisplay";

/**
 * The SideBarContainer Component:
 *  Contains the entire sidebar
 *  Opens and closes based on redux state
 */
const SideBarContainer: FC<{ sideBarWidth: string; logs: Log[] }> = ({
  sideBarWidth,
  logs,
}) => {
  const isOpen = useAppSelector(selectSideBarState);
  const [areFiltersOpen, setAreFiltersOpen] = useState<boolean>(false);
  return (
    <Drawer
      sx={{
        width: `${sideBarWidth}`,
        backgroundColor: "#1E1E1E",
        flexShrink: 0,
        overflow: "hidden",
        "& .MuiDrawer-paper": {
          width: `${sideBarWidth}`,
          boxSizing: "border-box",
          display: "flex",
          backgroundColor: "#171717",
          flexDirection: "column",
          padding: "20px 5px",
        },
      }}
      variant="persistent"
      anchor="left"
      open={isOpen}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          width: "100%",
          marginBottom: "17px",
        }}
      >
        <Typography
          sx={{ color: "#E9E9E9", fontWeight: "700", fontSize: "18px" }}
        >
          Container Information
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflowY: "hidden",
          flexDirection: "column",
        }}
        className="main-sidebar-container"
      >
        <Box
          className="sidebar-button-container"
          sx={{
            display: "flex",
            justifyContent: "start",
            width: "100%",
          }}
        >
          <IconButton
            sx={{ color: "#E9E9E9" }}
            size="small"
            onClick={() => setAreFiltersOpen((prev) => !prev)}
          >
            <FilterAltOutlinedIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            overflowY: "hidden",
            display: "flex",
          }}
          className="main-logging-container"
        >
          <LogFilters isOpen={areFiltersOpen}></LogFilters>
          <LogStreamDisplay logs={logs} />
        </Box>
      </Box>
    </Drawer>
  );
};
export default SideBarContainer;
