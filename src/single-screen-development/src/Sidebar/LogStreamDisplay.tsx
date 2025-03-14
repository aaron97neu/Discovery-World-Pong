import { Box, Typography } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import useScreenSize from "../app/hooks/useScreenSize";
import {
  LogContainerColors,
  selectLogFiltersState,
} from "../redux/containerInfoSlice";
import { Log } from "../Main";

/**
 * The LogStreamDisplayComponent
 *  Contains all logs
 *  Determines which logs to display based on filter state
 */
const LogStreamDisplay: FC<{ logs: Log[] }> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const logFilterState = useAppSelector(selectLogFiltersState);
  const { isLg } = useScreenSize();
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    //autoscroll user if already scrolled to bottom of container
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 1;
      autoScrollRef.current = isAtBottom;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    /*
      If the user is not scrolled to the bottom of the container,
      then hold their current place so they don't get scrolled up as new messages get added.
    */
    const check = () => {
      if (autoScrollRef.current && containerRef.current) {
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
      }
    };
    setTimeout(check, 3);
  }, [logs]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "rgba(255,255,255, .12)",
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        padding: "0px 5px",
        gap: "4px",
        "&::-webkit-scrollbar": {
          width: "10px",
        },
        "&::-webkit-scrollbar-corner": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "darkgray",
          borderRadius: "2px",
          minHeight: "25px",
          transition: "all .3s ease",
        },
      }}
    >
      {/*Filter out logs based on current filters, then create component for remaining logs*/}
      {logs
        .filter(
          (log) =>
            logFilterState.logType[log.type] &&
            logFilterState.containers[log.containerName]
        )
        .map((entry, index) => (
          <Typography
            sx={{ fontSize: `${isLg ? "12px" : "10px"}` }}
            key={index}
          >
            <span
              style={{
                color: `${LogContainerColors[entry.containerName]}`,
                fontWeight: 700,
              }}
            >
              {entry.containerName + " | "}
            </span>
            {entry.message}
          </Typography>
        ))}
    </Box>
  );
};

export default LogStreamDisplay;
