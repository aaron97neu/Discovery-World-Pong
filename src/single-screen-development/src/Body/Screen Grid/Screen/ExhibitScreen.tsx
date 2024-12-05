import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";

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
  const [iframeSrc, setIframeSrc] = useState("");

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
        overflow: "hidden",
        width: open ? `${width}px` : 0,
        height: `${height}px`,
        transform: open ? "scale(1)" : "scale(0)",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${width / 1080})`,
          transformOrigin: "top left",
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
