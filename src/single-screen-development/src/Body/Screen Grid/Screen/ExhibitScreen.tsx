import { Box } from "@mui/material";
import { FC } from "react";

interface ExhibitScreenProps {
  open: boolean;
  connectionString: string;
  width: number;
  height: number;
}

const ExhibitScreen: FC<ExhibitScreenProps> = ({
  open,
  connectionString,
  width,
  height,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "green",
        boxShadow:
          "0px 20px 25px -5px rgba(0, 0, 0, 0.3), 0px 10px 10px -5px rgba(0, 0, 0, 0.2)",
        opacity: open ? 1 : 0,
        overflow: "hidden",
        width: open ? `${width}px` : 0,
        height: `${height}px`,
        transform: open ? "scale(1)" : "scale(0)",
        transition: "all 0.3s ease",
      }}
    >
      <h2>{connectionString}</h2>
    </Box>
  );
};

export default ExhibitScreen;
