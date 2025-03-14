import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, ButtonGroup, ButtonProps, styled } from "@mui/material";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectVerticalScreens,
  toggleSideScreenDisplays,
  VERTICAL_SCREEN_NAMES,
} from "../redux/exhibitScreensSlice";
import useScreenSize from "../app/hooks/useScreenSize";

interface VisualizerButtonProps extends ButtonProps {
  selected: boolean;
}

const StyledButton = styled(Button)<VisualizerButtonProps>(
  ({ theme, selected }) => ({
    border: `1px solid #919191`,
    borderRadius: "4px",
    backgroundColor: `${selected ? "rgba(255,255,255,0.08)" : "transparent"}`,
    color: "white",
    position: "relative",
    overflow: "hidden",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
    textTransform: "none",
    fontWeight: 500,
    padding: "0px 25px",
    zIndex: 2,
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
      backgroundColor: "rgba(255,255,255,0.08)",
      color: "#E9E9E9",
      boxShadow: theme.shadows[2],
      opacity: 0,
      transition: "opacity 0.3s ease",
      zIndex: -1,
    },
    "&:hover::before": {
      opacity: 1,
    },
  })
);

const VisualizerButton: FC<VisualizerButtonProps> = ({
  onClick,
  children,
  selected,
}) => {
  const { isMd } = useScreenSize();
  return (
    <StyledButton
      startIcon={
        selected ? (
          <CheckIcon
            fontSize="small"
            sx={{ "&.MuiSvgIcon-fontSizeSmall": { fontSize: "12px" } }}
          />
        ) : (
          <></>
        )
      }
      onClick={onClick}
      selected={selected}
      sx={{ padding: "8px", fontSize: `${isMd ? "10px" : "12px"}` }}
    >
      {children}
    </StyledButton>
  );
};
/**
 * The VisualizerButtonGroup Component:
 *  Allows the user to select and deselect vertical screens to be displayed
 *  Handles sending display state to redux
 * @returns
 */
function VisualizerButtonGroup() {
  const dispatch = useAppDispatch();
  const screenState = useAppSelector(selectVerticalScreens);

  const handleClick = (screenName: VERTICAL_SCREEN_NAMES): void => {
    dispatch(toggleSideScreenDisplays({ screenName: screenName }));
  };
  return (
    <Box className="VisualizerSelect">
      <ButtonGroup
        size="small"
        variant="outlined"
        aria-label="Basic button group"
        sx={{ height: "30px", transition: "width 0.3s ease" }}
      >
        <VisualizerButton
          selected={screenState.networkVisualizer}
          onClick={() => handleClick(VERTICAL_SCREEN_NAMES.NETWORK_VISUALIZER)}
        >
          Network Visualizer
        </VisualizerButton>
        <VisualizerButton
          selected={screenState.clockVisualizer}
          onClick={() => handleClick(VERTICAL_SCREEN_NAMES.CLOCK_VISUALIZER)}
        >
          Clock Tower Visualizer
        </VisualizerButton>
        <VisualizerButton
          selected={screenState.humanVisualizer}
          onClick={() => handleClick(VERTICAL_SCREEN_NAMES.HUMAN_VISUALIZER)}
        >
          Human Visualizer
        </VisualizerButton>
      </ButtonGroup>
    </Box>
  );
}

export default VisualizerButtonGroup;
