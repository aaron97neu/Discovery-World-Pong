import { Box } from "@mui/material";
import { FC } from "react";
interface GameScreenProps {
  connectionString: string;
  height: number;
  width: number;
}
/**
 * The GameScreen Component:
 *  Houses the main game screen
 */
const GameScreen: FC<GameScreenProps> = ({
  connectionString,
  width,
  height,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        boxShadow:
          "0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
        <iframe
          src={connectionString}
          style={{
            border: "none",
            position: "absolute",
            top: '0',
            left: '0', 
            transformOrigin: 'top left',
            height: '1080px',
            width: '1920px',
            transform: `scale(${width / 1920})`
          }}
        ></iframe>
    </Box>
  );
};

export default GameScreen;
