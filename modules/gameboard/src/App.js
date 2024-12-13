import './App.css';
import React, {useEffect, useState, useContext, useRef} from 'react'
import GameStateMachine from './GameStateMachine';
import GamePlay from './GamePlay';
import {PongAPI} from 'dw-state-machine';
import MainScene from './MainScene';
import {SceneContext} from './SceneContext';
import { v4 as uuidv4 } from 'uuid';

const logger = require('./logger');

function App() {
  logger.info('This is a winston info message');

  const [size, setSize] = useState({ width: 800, height: 600 });

  const sceneContext = useContext(SceneContext);

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

  const pongAPI = new PongAPI(fullClientId, brokerUrl);
  const pongAPIRef = useRef(pongAPI);
  const gameStateMachine = new GameStateMachine(pongAPI, sceneContext);
  const gameStateMachineRef = useRef(gameStateMachine);
  const gamePlay = new GamePlay(pongAPI, sceneContext);
  // const gamePlayRef = useRef(gamePlay);

  useEffect(() => {   
    const pongAPI = pongAPIRef.current;
    const gameStateMachine = gameStateMachineRef.current;
    // const gamePlay = gamePlayRef.current;

    pongAPI.start();
    gameStateMachine.startMachine();

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup if necessary
      window.removeEventListener('resize', handleResize);
      pongAPI.stop();
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