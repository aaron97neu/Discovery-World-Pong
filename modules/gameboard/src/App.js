import './App.css';

import React, { useEffect } from 'react';
import GameState from './GameState';
import GameStateMachine from './GameStateMachine';
import {MQTTClient} from 'dw-state-machine';
// import { logger } from 'dw-utils';
// import mqtt from 'mqtt';
import Gameboard from './Gameboard';

const logger = require('./logger');
// const mqtt = require('mqtt')


function App() {
  console.log('App: yup');
  logger.info('This is a winston info message');
  useEffect(() => {
    const gameState = new GameState();
    const gameStateMachine = new GameStateMachine(gameState);
    const broker_url = process.env.REACT_APP_URL;
    console.log('App: broker_url %s', broker_url)
    const mqttClient = new MQTTClient(broker_url, 'gameboard', gameState, gameStateMachine);
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
    gameState.setState('game_state', 'idle', null);
    gameState.setState('game_state_transition', 'player_ready', null);
    console.log('App: d4');

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <Gameboard />
  );
}

export default App;