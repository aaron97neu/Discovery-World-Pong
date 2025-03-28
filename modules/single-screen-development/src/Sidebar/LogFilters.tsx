import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { FC } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  LogContainerFilters,
  LogTypeFilters,
  selectLogFiltersState,
  setContainerLogFilter,
  setLogTypeFilter,
} from "../redux/containerInfoSlice";
import useScreenSize from "../app/hooks/useScreenSize";

interface FilterProps {
  filters: Array<[string, any]>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

// creates styled dropdown based on filters given
const FilterDropdown: FC<FilterProps> = ({ filters, onChange, title }) => {
  const { isLg } = useScreenSize();
  return (
    <Accordion
      disableGutters
      sx={{ backgroundColor: "rgba(0,0,0,0)" }}
      elevation={0}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ paddingLeft: "0px" }}
      >
        <Typography
          component="span"
          sx={{ fontSize: `${isLg ? "15px" : "13px"}`, fontWeight: "500" }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingLeft: "0px" }}>
        <FormControl>
          <FormGroup>
            {/*Create checkbox for each filter*/}
            {filters.map(([k, v]) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#F58025",
                        "&.Mui-checked": {
                          color: "#F58025",
                        },
                        transform: "scale(0.8)",
                      }}
                      size={"small"}
                      checked={v}
                      onChange={onChange}
                      name={k}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: `${isLg ? "13px" : "10px"}` }}>
                      {k}
                    </Typography>
                  }
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
};

/**
 * The LogFilters Component:
 *  Contains all filters for log display
 *  Handles dispatching filter changes to redux
 */
const LogFilters: FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const filterState = useAppSelector(selectLogFiltersState);
  const dispatch = useAppDispatch();

  const handleLogTypeFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setLogTypeFilter(event.target.name as keyof LogTypeFilters));
  };

  const handleContainerFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setContainerLogFilter(event.target.name as keyof LogContainerFilters)
    );
  };

  return (
    <Box
      className="logging-filters"
      sx={{
        display: `${isOpen ? "block" : "none"}`,
        overflowY: "auto",
        height: "100%",
        "&::-webkit-scrollbar": {
          width: "0px",
        },
      }}
    >
      <FilterDropdown
        filters={Object.entries(filterState.logType)}
        onChange={handleLogTypeFilterChange}
        title={"Log Types"}
      ></FilterDropdown>
      <FilterDropdown
        filters={Object.entries(filterState.containers)}
        onChange={handleContainerFilterChange}
        title={"Containers"}
      ></FilterDropdown>
    </Box>
  );
};

export default LogFilters;
