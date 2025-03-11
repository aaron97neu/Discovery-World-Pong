import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { LogContainerKeys, setAllContainerLogFiltersOff, setContainerLogFilter, setSidebarOpen } from "../../../redux/containerInfoSlice";
import { resetLogCounts, setContainerLogCount } from "../../../redux/exhibitScreensSlice";

interface ExhibitScreenProps {
  open: boolean;
  connectionString: string;
  width: number;
  height: number;
  container: LogContainerKeys;
}

interface BadgeProps {
  onClick: () => void;
  badgeContent: string | number;
}

const Badge: React.FC<BadgeProps> = ({ onClick, badgeContent }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%', overflow: 'visible' }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: '99',
          top: '0px',
          right: '0px',
          transform: "translate(50%, -50%)",
          backgroundColor: 'rgb(144, 202, 249)',
          color: 'black',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '12px',
          ':hover':{
            boxShadow: "0px 0px 0px 5px rgba(255, 255, 255, 0.10)"
          }
        }}
        onClick={onClick}
      >
        {badgeContent}
      </Box>
    </Box>
  );
};

const ExhibitScreen: FC<ExhibitScreenProps> = ({
  open,
  connectionString,
  width,
  height,
  container
}) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const logCountState = useAppSelector(state => state.exhibitScreens.newContainerLogCounts[container])
  const sidebarOpen = useAppSelector(state => state.containerInfo.sidebarOpen)
  const dispatch = useAppDispatch();
  useEffect(() => {
    setIframeSrc(`${connectionString}?t=${Date.now()}`);
  }, [connectionString]);
  return (
      <Box
        sx={{
          position: "relative",
          boxShadow:
            "0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
          opacity: open ? 1 : 0,
          width: open ? `${width}px` : 0,
          height: `${height}px`,
          transform: open ? "scale(1)" : "scale(0)",
          transition: "all 0.2s ease",
        }}
      >
        <Badge badgeContent={logCountState} onClick={() => {
          if(!sidebarOpen){
            dispatch(setAllContainerLogFiltersOff());
            dispatch(setContainerLogFilter(container))
            dispatch(setSidebarOpen());
            dispatch(resetLogCounts());
          }else{
            dispatch(setSidebarOpen());
          }
        }}></Badge>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `scale(${width / 1080})`,
            transformOrigin: "top left",
            transition: "all 0.2s ease"
          }}
        >
          <iframe
            src={iframeSrc}
            style={{
              width: "1080px",
              height: "1920px",
              border: "none",
              
            }}
          ></iframe>
        </Box>
      </Box>
  );
};

export default ExhibitScreen;
