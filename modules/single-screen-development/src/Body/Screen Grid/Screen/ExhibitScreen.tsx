import { Box } from "@mui/material";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  LogContainerKeys,
  setAllContainerLogFiltersOff,
  setContainerLogFilter,
  setSidebarOpen,
} from "../../../redux/containerInfoSlice";
import { resetLogCounts } from "../../../redux/exhibitScreensSlice";

interface ExhibitScreenProps {
  open: boolean;
  connectionString: string;
  width: number;
  height: number;
  container: LogContainerKeys;
  vertScreenCount: number;
}

interface BadgeProps {
  onClick: () => void;
  badgeContent: string | number;
}

const Badge: React.FC<BadgeProps> = ({ onClick, badgeContent }) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          zIndex: "99",
          top: "0px",
          right: "0px",
          transform: "translate(50%, -50%)",
          backgroundColor: "rgb(144, 202, 249)",
          color: "black",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "12px",
          ":hover": {
            boxShadow: "0px 0px 0px 5px rgba(255, 255, 255, 0.10)",
          },
        }}
        onClick={onClick}
      >
        {badgeContent}
      </Box>
    </Box>
  );
};

/**
 * The ExhibitScreen Component:
 *  Houses one vertical game screen and notification badge
 */
const ExhibitScreen: FC<ExhibitScreenProps> = ({
  open,
  connectionString,
  width,
  height,
  container,
  vertScreenCount
}) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const prevVertRef = useRef(3);
  const frameRef = useRef<HTMLIFrameElement>(null)
  const logCountState = useAppSelector(
    (state) => state.exhibitScreens.newContainerLogCounts[container]
  );
  const sidebarOpen = useAppSelector(
    (state) => state.containerInfo.sidebarOpen
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    setIframeSrc(`${connectionString}?t=${Date.now()}`);
  }, [connectionString]);

  /**
   * This hook updates what events our components should animate.
   * 
   * Box component animations:
   *  Scaling:
   *    We always want to animate scaling (transforming) our container.
   * 
   *    This is what allows us to have the shrink/grow animations when the screen is closed/opened.
   *  
   *  Dimension Changes:
   *    We only want to animate our dimension changes when the change is a result of a screen being closed/opened.
   * 
   *    The parent component that houses Body.tsx and Header.tsx already animates 
   *    dimension changes that are a result of the window size changing and the sidebar being opened.
   *    If we also animated within this component, then the width of the component would lag behind what it 
   *    should be based on the Parent's ongoing animation.
   * 
   * Frame component animations:
   *  Scaling:
   *    We only want to animate our Iframe scaling when a screen is closed/opened.
   * 
   *    When the window size changes or a sidebar is opened, the parent component handles the animating 
   *    the dimension change. So there is no need to animate anything in this case.
   * 
   *    When a screen is closed/opened, we need to animate scaling as 
   *    the inner frame component relies on it to maintain its aspect ratio at smaller dimensions.
   * 
   */
  useLayoutEffect(() => {
    const hasChanged = prevVertRef.current !== vertScreenCount;
    if (boxRef.current) {
      boxRef.current.style.transition = hasChanged
        ? 'all 0.2s ease'
        : 'transform 0.2s ease';
    }
    if (frameRef.current) {
      frameRef.current.style.transition = hasChanged
        ? 'transform 0.2s ease'
        : '';
    }
    prevVertRef.current = vertScreenCount;
  }, [vertScreenCount, sidebarOpen]);

  return (
    <Box
      ref={boxRef}
      sx={{
        position: "relative",
        boxShadow:
          "0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
        opacity: open ? 1 : 0,
        width: open ? `${width}px` : 0,
        height: `${height}px`,
        transform: open ? `scale(1)` : "scale(0)",
      }}
    >
      <Badge
        badgeContent={logCountState}
        onClick={() => {
          /*
            If notification badge is clicked and the sidebar is not open:
              1) Set all container filters to off
              2) Set the filter for this container to on
              3) Open the sidebar
              4) Reset the notification badges back to 0
          */
          if (!sidebarOpen) {
            dispatch(setAllContainerLogFiltersOff());
            dispatch(setContainerLogFilter(container));
            dispatch(setSidebarOpen());
            dispatch(resetLogCounts());
          } else {
            dispatch(setSidebarOpen());
          }
        }}
      ></Badge>
      {/*Streams the data from our container at a fixed resolution. Uses scaling to fit within the parent box component*/}
      <iframe
        ref={frameRef}
        src={iframeSrc}
        style={{
          border: "none",
          position: "absolute",
          top: '0',
          left: '0', 
          transformOrigin: 'top left',
          height: '1920px',
          width: '1080px',
          transform: `scale(${width / 1080})`,
        }}
      ></iframe>
    </Box>
  );
};

export default ExhibitScreen;
