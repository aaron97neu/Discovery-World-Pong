import { Box } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Body from "./Body/Body";
import Header from "./Header/Header";
import {
  LogContainerKeys,
  selectLogFiltersState,
  selectSideBarState,
} from "./redux/containerInfoSlice";
import SideBarContainer from "./Sidebar/SidebarContainer";
import mqtt, { MqttClient } from "mqtt";
import {
  incrementContainerLogCount,
  selectContainerLogCount,
} from "./redux/exhibitScreensSlice";
import { format } from "util";

export type Log = {
  type: "docker" | "console";
  message: string;
  containerName: LogContainerKeys;
};

/**
 * The Main Component:
 *  Contains all web app components,
 *  Determines sidebar width
 *  Connects to MQTT
 *  Handles MQTT messages
 */
const Main: FC = () => {
  const isSideBarOpen = useAppSelector(selectSideBarState);
  const containerLogCounts = useAppSelector(selectContainerLogCount);
  const filterState = useAppSelector(selectLogFiltersState);
  const dispatch = useAppDispatch();
  const [sideBarWidth, setSideBarWidth] = useState("35%");
  const [logs, setLogs] = useState<Log[]>([]);
  const mqttClientRef = useRef<MqttClient | null>(null);
  const sideBarRef = useRef(isSideBarOpen);
  const filterStateRef = useRef(filterState);

  useEffect(() => {
    //Set the side bar width to 35% of the screen up to a max of 750px.
    const handleResize = () => {
      if (window.innerWidth * 0.35 < 750) {
        setSideBarWidth("35%");
      } else {
        setSideBarWidth("750px");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    sideBarRef.current = isSideBarOpen;
  }, [isSideBarOpen]);

  useEffect(() => {
    filterStateRef.current = filterState;
  }, [filterState]);

  useEffect(() => {
    //Connect to mqtt client
    if (!mqttClientRef.current) {
      const mqttClient = mqtt.connect("ws://localhost:9001", {
        clientId: "single-screen-dev",
        reconnectPeriod: 0,
      });
      mqttClientRef.current = mqttClient;

      //subscribe to mqtt topic
      mqttClient.on("connect", () => {
        console.log("Connected to MQTT broker");
        //subscribe to all docker log subtopics
        mqttClient.subscribe("docker/logs/#", (err) => {
          if (!err) {
            console.log("Subscribed to docker/logs/");
          } else {
            console.error("Failed to subscribe:", err);
          }
        });
        //subscribe to all app log subtopics
        mqttClient.subscribe("app/logs/#", (err) => {
          if (!err) {
            console.log("Subscribed to app/logs/");
          } else {
            console.error("Failed to subscribe:", err);
          }
        });
      });

      const originalLog = console.log;

      /*
        Overloads the console log function
        Publishes all logs to the specified mqtt topic then still logs to the console
        This overload applies to all of Main's child components
      */
      console.log = function (...args) {
        const message = format(...args);
        mqttClient.publish("app/logs/single-screen-development", message);
        originalLog.apply(console, args);
      };

      mqttClient.on("message", (topic, message) => {
        try {
          const containerName = topic.split("/").pop() as LogContainerKeys;
          let type: "docker" | "console";
          //determine if incoming message is a docker or console log
          if (topic.includes("docker/logs/")) {
            type = "docker";
          } else if (topic.includes("app/logs/")) {
            type = "console";
          }
          //determine if the container is a vertical exhibit screen
          if (containerLogCounts[containerName] !== undefined) {
            //if the sidebar is closed, then add to screen's notification badge
            if (sideBarRef.current === false) {
              dispatch(incrementContainerLogCount(containerName));
            } else {
              //if the sidebar is open but this screen's logs are not being displayed, then add to screen's notification badge
              if (
                !filterStateRef.current.logType[type!] ||
                !filterStateRef.current.containers[containerName]
              ) {
                dispatch(incrementContainerLogCount(containerName));
              }
            }
          }
          //add log to memory
          setLogs((prev) => [
            ...prev,
            {
              type: type,
              message: message.toString(),
              containerName: containerName!,
            },
          ]);
        } catch (err) {
          console.log(err);
        }
      });

      mqttClient.on("error", (err) => {
        console.error("MQTT error:", err);
      });
    }

    return () => {
      if (mqttClientRef.current) {
        mqttClientRef.current.end();
        mqttClientRef.current = null; // Reset for next mount
      }
    };
  }, []);

  return (
    <>
      <SideBarContainer
        sideBarWidth={sideBarWidth}
        logs={logs}
      ></SideBarContainer>
      <Box
        className="App"
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          backgroundColor: "#1E1E1E",
          height: "100vh",
          width: `${isSideBarOpen ? `calc(100vw - ${sideBarWidth})` : "100vw"}`,
          alignItems: "center",
          padding: `${isSideBarOpen ? `0px 25px` : "0px 90px"}`,
          marginLeft: `${isSideBarOpen ? `${sideBarWidth}` : "0px"}`,
          transition: "all 0.3s ease",
        }}
      >
        <Header></Header>
        <Body></Body>
      </Box>
    </>
  );
};
export default Main;
