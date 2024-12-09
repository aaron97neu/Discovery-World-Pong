import './App.css';

import React, {useEffect, useState, useContext} from 'react'
import { v4 as uuidv4 } from 'uuid';

import GameState from './GameState';
import GameStateMachine from './GameStateMachine';
import GamePlay from './GamePlay';
import {MQTTClient} from 'dw-state-machine';
// import { logger } from 'dw-utils';
import MainScene from './MainScene';
import {SceneContext, SceneProvider} from './SceneContext';

const logger = require('./logger');

function App() {
  logger.info('This is a winston info message');

  const [size, setSize] = useState({ width: 800, height: 600 });

  const sceneContext = useContext(SceneContext);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  useEffect(() => {
    const gameState = new GameState();
    const gamePlay = new GamePlay(gameState, sceneContext);
    const gameStateMachine = new GameStateMachine(gameState, sceneContext);
    const broker = process.env.REACT_APP_MQTT_BROKER || window.location.hostname;
    const port = process.env.REACT_APP_MQTT_PORT || 9001;
    const brokerUrl = `ws://${broker}:${port}`;
    const clientId = process.env.REACT_APP_MQTT_CLIENT_ID || 'gameboard';
    const uuid = uuidv4();
    const fullClientId = `${clientId}-${uuid}`;

    console.log("broker: ", broker);
    console.log("port: ", port);
    console.log("clientId: ", clientId);
    console.log("fullClientId: ", fullClientId);

    const mqttClient = new MQTTClient(brokerUrl, fullClientId, gameState);
    
    mqttClient.start();
    gameStateMachine.startMachine();

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
      <MainScene style={{ width: size.width, height: size.height }} />
    </div>
  );
}

export default App;