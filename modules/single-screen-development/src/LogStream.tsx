import { Box } from "@mui/material";
import mqtt from "mqtt";
import { MqttClient } from "mqtt/*";
import { useEffect, useState } from "react";

function LogStream() {
  const [logs, setLogs] = useState<string[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect("ws://localhost:9001", {
      clientId: "mqtt-logger-ui",
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      // Subscribe to the logs topic
      mqttClient.subscribe("docker/logs/log-server", (err) => {
        if (!err) {
          console.log("Subscribed to docker/logs/log-server");
        } else {
          console.error("Failed to subscribe:", err);
        }
      });
      mqttClient.subscribe("app/logs/clocktower-visualizer", (err) => {
        if (!err) {
          console.log("Subscribed to app/logs/log-server");
        } else {
          console.error("Failed to subscribe:", err);
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      if (topic === "docker/logs/log-server" || topic === "app/logs/clocktower-visualizer") {
        // Add the new log message to the state
        setLogs((prevLogs) => [...prevLogs, message.toString()]);
      }
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    // Save the client instance to state
    setClient(mqttClient);

    // Cleanup on component unmount
    return () => {
      if (mqttClient) {
        mqttClient.end(); // Disconnect the client
      }
    };
  }, []);

  return (
    <div>
      <h1>MQTT Logs</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default LogStream;
