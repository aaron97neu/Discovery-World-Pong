import './App.css';

import React, {useEffect, useState} from 'react'

// import {MQTTClient, BaseState} from 'dw-state-machine';
import {BaseState} from 'dw-state-machine';
// import { logger } from 'dw-utils';
import Controller from './Controller'
import AppMQTTClient from './AppMQTTClient';

const logger = require('./logger');

function App() {
  logger.info('This is a winston info message');
  const [size, setSize] = useState({ width: 800, height: 600 });
  // const screenWidth = window.innerWidth;
  // const screenHeight = window.innerHeight;
  const gameState = new BaseState();

  useEffect(() => {

    const broker = process.env.REACT_APP_MQTT_BROKER || window.location.hostname;
    const port = process.env.REACT_APP_MQTT_PORT || 9001;
    const brokerUrl = `ws://${broker}:${port}`;
    const clientId = process.env.REACT_APP_MQTT_CLIENT_ID || 'web-paddle-control';
    const paddleId = process.env.REACT_APP_PADDLE_ID || 'bottom';
    const fullClientId = `${paddleId}-${clientId}`;

    console.log("broker: ", broker);
    console.log("port: ", port);
    console.log("clientId: ", clientId);
    console.log("paddleId: ", paddleId);
    console.log("fullClientId: ", fullClientId);

    // const mqttClient = new AppMQTTClient(brokerUrl, { fullClientId }, gameState);
    const mqttClient = new AppMQTTClient(brokerUrl, fullClientId, gameState);
    
    mqttClient.start();

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup if necessary
      window.removeEventListener('resize', handleResize);
      mqttClient.stop();
    };
  }, []);

  return (
    <div className="App" >
      {/* <MainScene width={screenWidth} height={screenHeight} /> */}
      <Controller gameState={gameState} style={{ width: size.width, height: size.height }} />
    </div>
  );
}

export default App;