import {FC, useState} from "react";
import {Log} from "../../Main";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Button,
    FormControl,
    InputLabel, MenuItem,
    Select,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {commands, containers} from "./CommandsAndContainers";


const CommandPusher: FC<{dropdownWidth: string, logs: Log[]}> = ({}) =>{
    const [activeContainer, setActiveContainer] = useState('');
    const [activeCommand, setActiveCommand] = useState('');
    const reloadFrame = () => {
        let ifr = document.getElementById(activeContainer)  as HTMLIFrameElement
        console.log("reloading " + activeContainer);
        ifr.src = ifr.src;
    }

    const handleSubmit = async () => {
        let response = null;
        try {
            switch (activeCommand) {
                case "Start":
                    reloadFrame();
                    response = await fetch(`http://localhost:5006/start-container/${activeContainer}`, {
                        method: 'POST',
                    });
                    break;
                case "Stop":
                    reloadFrame();
                    response = await fetch(`http://localhost:5006/stop-container/${activeContainer}`, {
                        method: 'POST',
                    });
                    break;
                case "Build":
                    reloadFrame();
                    response = await fetch(`http://localhost:5006/build-container/${activeContainer}`, {
                        method: 'POST',
                    });
                    break;
                case "Down":
                    reloadFrame();
                    response = await fetch(`http://localhost:5006/down-container/${activeContainer}`, {
                        method: 'POST',
                    });
                    break;
                case "Up":
                    // response = await fetch(`http://localhost:5006/up-container/${activeContainer}`, {
                    //     method: 'POST',
                    // });
                    alert("TO DO")
                    break;
            }


            const result = response != null ? await response.json() : "n/a";
            console.log(result)
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Click Here to Push Commands</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display="flex" flexDirection="row" gap={2}>
                        <FormControl fullWidth>
                            <InputLabel>Select Container</InputLabel>
                            <Select
                                value={activeContainer}
                                label="Option 1"
                                onChange={(e) => setActiveContainer(e.target.value)}
                            >
                                {containers.map((container : string[]) => (
                                    <MenuItem value={container[0]}>
                                        {container[1]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Select Command</InputLabel>
                            <Select
                                value={activeCommand}
                                label="Option 2"
                                onChange={(e) => setActiveCommand(e.target.value)}
                            >
                                {commands.map((command : string) => (
                                    <MenuItem value={command}>
                                        {command}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button variant="contained" onClick= {handleSubmit}>
                            Execute
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>

    );
};

export default CommandPusher;