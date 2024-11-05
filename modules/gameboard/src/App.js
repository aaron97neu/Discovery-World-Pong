import './App.css';

import React, {useEffect, useRef, useContext} from 'react'

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

  const sceneContext = useContext(SceneContext);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  useEffect(() => {
    const gameState = new GameState();
    const gamePlay = new GamePlay(gameState, sceneContext);
    const gameStateMachine = new GameStateMachine(gameState, sceneContext);
    const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL || 'ws://localhost:1883';
    // const broker_url = process.env.REACT_APP_URL;
    // const mqttClient = new MQTTClient(brokerUrl, 'gameboard', gameState, gameStateMachine);
    const mqttClient = new MQTTClient(brokerUrl, 'gameboard', gameState);
    
    mqttClient.start();
    gameStateMachine.startMachine();

    return () => {
      // Cleanup if necessary
      mqttClient.stop();
    };
  }, []);

  return (
    <div className="App">
      <MainScene width={screenWidth} height={screenHeight} />
    </div>
  );
}

export default App;