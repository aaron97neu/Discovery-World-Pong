import './App.css';

import React, {useEffect} from 'react'

import GameState from './GameState';
import GameStateMachine from './GameStateMachine';
import {MQTTClient} from 'dw-state-machine';
// import { logger } from 'dw-utils';
import Scene from './Scene';

const logger = require('./logger');

function App() {
  logger.info('This is a winston info message');

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  useEffect(() => {
    const gameState = new GameState();
    const gameStateMachine = new GameStateMachine(gameState);
    const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL || 'ws://localhost:1883';
    // const broker_url = process.env.REACT_APP_URL;
    console.log('App: brokerUrl %s', brokerUrl)
    const mqttClient = new MQTTClient(brokerUrl, 'gameboard', gameState, gameStateMachine);
    console.log('App: d1');

      // const client = mqtt.connect('ws://localhost:9001', {
      //     clientId: "client_id",
      //     keepalive: 60
      // });

    mqttClient.start();
    console.log('App: d2');
    gameStateMachine.startMachine();
    console.log('App: d3');

    // Example state change
    // gameState.setState('game_state', 'idle', null);
    // gameState.setState('game_state_transition', 'player_ready', null);
    // console.log('App: d4');

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div className="App">
      <Scene width={screenWidth} height={screenHeight} />
    </div>
  );
}

export default App;