import './App.css';
import React, {useEffect, useState, useContext, useRef} from 'react'
import GameStateMachine from './GameStateMachine';
import GamePlay from './GamePlay';
import {PongAPI} from 'dw-state-machine';
import MainScene from './MainScene';
import {GameContext} from './GameContext';
import { v4 as uuidv4 } from 'uuid';
// const logger = require('./logger');

function App() {
  // logger.info('This is a winston info message');

  const [size, setSize] = useState({ width: 800, height: 600 });

  const gameContext = useContext(GameContext);

  const {
    isAppInitialized, 
    setisAppInitialized,
    setIsGameComplete,
  } = useContext(GameContext);

  const broker = process.env.REACT_APP_MQTT_BROKER || window.location.hostname;
  const port = process.env.REACT_APP_MQTT_PORT || 9001;
  const brokerUrl = `ws://${broker}:${port}`;
  const clientId = process.env.REACT_APP_MQTT_CLIENT_ID || 'gameboard';
  const uuid = uuidv4();
  const fullClientId = `${clientId}-${uuid}`;

  const onPongApiConnection = () => {
    if (!isAppInitialized) {
      setisAppInitialized(true);
      setIsGameComplete(true);
    }
  }  
  
  const onPongApiDisconnection = () => {
  }

  const pongAPIRef = useRef(new PongAPI(fullClientId, brokerUrl, onPongApiConnection, onPongApiDisconnection));
  const gameStateMachineRef = useRef();

  useEffect(() => {
    console.log(`broker: ${broker}`);
    console.log(`port: ${[port]}`);
    console.log(`clientId: ${clientId}`);
    console.log(`fullClientId: ${fullClientId}`);

    // const gameStateMachine = new GameStateMachine(pongAPIRef.current, GameContext);

    if (pongAPIRef.current) {
      pongAPIRef.current.start();
    }

    if (!gameStateMachineRef.current) {
      gameStateMachineRef.current = new GameStateMachine(pongAPIRef.current, gameContext);
      gameStateMachineRef.current.startMachine();
    }

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup if necessary
      window.removeEventListener('resize', handleResize);
      if (pongAPIRef.current) {
        pongAPIRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="App" >
      <GamePlay pongAPIRef={pongAPIRef} />
      <MainScene style={{ width: size.width, height: size.height }} />
    </div>
  );
}

export default App;