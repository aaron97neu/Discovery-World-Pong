import { FormControl, MenuItem, Select, styled } from "@mui/material";
import { FC, useRef } from "react";
import { useAppDispatch } from "../app/hooks";
import { DisplayTabs, setDisplayTab } from "../redux/exhibitScreensSlice";
import useScreenSize from "../app/hooks/useScreenSize";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: "#E9E9E9",
  border: "solid darkgray 1.2px",
  borderRadius: "4px",
  height: "40px",
  width: "160px",
  fontSize: '14px',
  transition:
    "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
  boxShadow: theme.shadows[1],
  fontWeight: 700,
  "&:hover": {
    borderColor: `white`,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.12)",
    boxShadow: theme.shadows[2],
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  },
  "&:hover::before": {
    opacity: 1,
  },
}));

interface DisplaySelectProps {
  tabState: DisplayTabs;
}

const DisplaySelect: FC<DisplaySelectProps> = ({ tabState }) => {
  const dispatch = useAppDispatch();
  const selectRef = useRef<HTMLDivElement | null>(null);
  const { isLg } = useScreenSize();
  const handleChange = (tab: DisplayTabs) => {
    dispatch(setDisplayTab({ tab: tab }));
  };

  const handleClose = () => {
    if (selectRef.current) {
      const input = selectRef.current.querySelector("div");
      if (input) {
        input.classList.remove("Mui-focused");
      }
    }
  };

  const handleOpen = () => {
    if (selectRef.current) {
      const input = selectRef.current.querySelector("div");
      if (input) {
        input.classList.add("Mui-focused");
      }
    }
  };

  return (
    <FormControl size="small" ref={selectRef}>
      <Select
        id="display-select"
        value={tabState}
        onChange={(e) => handleChange(e.target.value as DisplayTabs)}
        onClose={handleClose}
        onOpen={handleOpen}
        MenuProps={{
          sx: { transform: `translateY(10px) ` },
          MenuListProps: { sx: { paddingTop: "0px", paddingBottom: "0px" } },
        }}
        sx={{
          color: "#E9E9E9",
          fontWeight: "700",
          width: "160px",
          fontSize: '14px',
          "&:hover, &.Mui-focused": {
            backgroundColor: "rgba(255,255,255,0.12)",
            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.2)",
          },
          "&.MuiOutlinedInput-root": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent !important",
            },
          },
        }}
      >
        <StyledMenuItem
          sx={{ display: `${tabState === "vertical" ? "none" : ""}` }}
          value={"vertical"}
        >
          Vertical Display
        </StyledMenuItem>
        <StyledMenuItem
          sx={{
            display: `${tabState === "game" ? "none" : ""}`
          }}
          value={"game"}
        >
          Game Display
        </StyledMenuItem>
      </Select>
    </FormControl>
  );
};

export default DisplaySelect;
