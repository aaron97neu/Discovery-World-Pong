import './App.css';

import React, {useEffect, useRef} from 'react'

import GameState from './GameState';
import GameStateMachine from './GameStateMachine';
import {MQTTClient} from 'dw-state-machine';
// import { logger } from 'dw-utils';
import MainScene from './MainScene';

const logger = require('./logger');

function App() {
  logger.info('This is a winston info message');

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const mainSceneRef = useRef(null);

  const gameState = new GameState();
  const gameStateMachine = new GameStateMachine(gameState);
  const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL || 'ws://localhost:1883';
  // const broker_url = process.env.REACT_APP_URL;
  console.log('App: brokerUrl %s', brokerUrl)
  const mqttClient = new MQTTClient(brokerUrl, 'gameboard', gameState, gameStateMachine);

  useEffect(() => {
    mqttClient.start();
    gameStateMachine.setMainSceneRef(mainSceneRef);
    gameStateMachine.startMachine();

    return () => {
      // Cleanup if necessary
      mqttClient.stop();
    };
  }, []);

  return (
    <div className="App">
      <MainScene ref={mainSceneRef} width={screenWidth} height={screenHeight} />
    </div>
  );
}

export default App;