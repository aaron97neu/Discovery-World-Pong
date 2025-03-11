import { Box } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "../app/hooks";
import {
  selectDisplayTab,
  selectVerticalScreens,
} from "../redux/exhibitScreensSlice";
import GameScreen from "./GameScreen";
import ExhibitScreen from "./Screen Grid/Screen/ExhibitScreen";
function Body() {
  const screenState = useAppSelector(selectVerticalScreens);
  const screenTabState = useAppSelector(selectDisplayTab);
  const verticalScreensCount = useMemo(() => {
    return Object.values(screenState).filter(Boolean).length;
  }, [screenState]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  interface WindowSize {
    width: number;
    height: number;
  }

  const [containerSize, setContainerSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [divSize, setDivSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const [gameScreenSize, setGameScreenSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const aspectRatio = 9 / 16;
  const gameScreenAspectRatio = 16 / 9;

  useEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]): void => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const containerWidth = containerSize.width;
    const containerHeight = containerSize.height;
    if(screenTabState === 'vertical'){
      let newWidth = containerWidth / (verticalScreensCount + .20);
      let newHeight = newWidth / aspectRatio;
  
      if (newHeight > containerHeight * 0.95) {
        newHeight = containerHeight * 0.95;
        newWidth = newHeight * aspectRatio;
      }
  
      setDivSize({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    }else{
      let newWidth = containerWidth;
      let newHeight = newWidth / gameScreenAspectRatio;
  
      if (newHeight > containerHeight * 0.95) {
        newHeight = containerHeight * 0.95;
        newWidth = newHeight * gameScreenAspectRatio;
      }
  
      setGameScreenSize({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    }


  }, [containerSize, verticalScreensCount]);

  return (
    <Box
      ref={containerRef}
      sx={{
        transition: "all 0.3s ease",
        width: "100%",
        height: "100%",
      }}
    >
      {screenTabState === "vertical" ? (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignContent: "flex-start",
            alignItems: "flex-start",
            justifyContent: `${verticalScreensCount < 3 ? "center" : "space-between"}`,
            gap: `${verticalScreensCount === 1 ? "0" : "12px"}`,
            transition: "all 0.3s ease",
          }}
        >
          <ExhibitScreen
            width={divSize.width}
            height={divSize.height}
            open={screenState.networkVisualizer}
            connectionString="http://localhost:5002"
            container={"neural-net-visualizer"}
          />
          <ExhibitScreen
            width={divSize.width}
            height={divSize.height}
            open={screenState.clockVisualizer}
            connectionString="http://localhost:5003"
            container={"clocktower-visualizer"}
          />
          <ExhibitScreen
            width={divSize.width}
            height={divSize.height}
            open={screenState.humanVisualizer}
            connectionString="http://localhost:5001"
            container={"human-visualizer"}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <GameScreen connectionString="http://localhost:5000" width={gameScreenSize.width} height={gameScreenSize.height}/>
        </Box>
      )}
    </Box>
  );
}

export default Body;
