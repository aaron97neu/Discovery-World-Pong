import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
interface GameScreenProps {
    connectionString: string;
    height: number;
    width: number;
  }
const GameScreen: FC<GameScreenProps> = ({
    connectionString,
    width,
    height
}) => {
  return (
      <Box
        sx={{
          position: "relative",
          boxShadow:
            "0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
          width: `${width}px`,
          height: `${height}px`,
          transition: "all 0.2s ease",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `scale(${width / 1920})`,
            transformOrigin: "top left",
            transition: "all 0.2s ease"
          }}
        >
          <iframe
            src={connectionString}
            style={{
              width: "1920px",
              height: "1080px",
              border: "none",
              
            }}
          ></iframe>
        </Box>
      </Box>
  );
};

export default GameScreen;
