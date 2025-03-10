import { Box } from "@mui/material";
import { FC } from "react";

interface GameScreenProps {
  connectionString: string;
}

const GameScreen: FC<GameScreenProps> = ({}) => {
  return (
    <>
      <Box
        className="Body"
        sx={{
          height: "95%",
          margin: "0 auto",
          backgroundColor: "green",
          boxShadow:
            "0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
          aspectRatio: "16 / 9",
        }}
      ></Box>
    </>
  );
};

export default GameScreen;
