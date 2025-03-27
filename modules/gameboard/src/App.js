import './App.css';
import React, {useEffect, useState, useContext, useRef} from 'react'
import { v4 as uuidv4 } from 'uuid';
import {PongAPI} from 'dw-state-machine';
import GameAPI from './GameAPI';
import {GameSessionContext} from './GameSessionContext';
import {GamePlayContext} from './GamePlayContext';
import GameSessionStateMachine from './GameSessionStateMachine';
import MainScene from './MainScene';

function App() {
  const [size, setSize] = useState({ width: 800, height: 600 });

  const gameSessionContext = useContext(GameSessionContext);
  const gamePlayContext = useContext(GamePlayContext);

  const {
    isAppInitialized, 
    setisAppInitialized,
    // setIsGameComplete,
  } = useContext(GameSessionContext);

  const broker = process.env.REACT_APP_MQTT_BROKER || window.location.hostname;
  const port = process.env.REACT_APP_MQTT_PORT || 9001;
  const brokerUrl = `ws://${broker}:${port}`;
  const clientId = process.env.REACT_APP_MQTT_CLIENT_ID || 'gameboard';
  const uuid = uuidv4();
  const fullClientId = `${clientId}-${uuid}`;

  const onPongApiConnection = () => {
    if (!isAppInitialized) {
      setisAppInitialized(true);
      // setIsGameComplete(true);
    }
  }  
  
  const onPongApiDisconnection = () => {
  }

  const pongAPIRef = useRef(new PongAPI(
    fullClientId, 
    brokerUrl, 
    onPongApiConnection, 
    onPongApiDisconnection)
  );

  const GameSessionStateMachineRef = useRef();

  useEffect(() => {
    console.log(`broker: ${broker}`);
    console.log(`port: ${[port]}`);
    console.log(`clientId: ${clientId}`);
    console.log(`fullClientId: ${fullClientId}`);

    if (pongAPIRef.current) {
      pongAPIRef.current.start();
    }

    if (!GameSessionStateMachineRef.current) {
      GameSessionStateMachineRef.current = new GameSessionStateMachine(
        pongAPIRef.current, 
        gameSessionContext,
        gamePlayContext
      );
      GameSessionStateMachineRef.current.startMachine();
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
      <GameAPI pongAPIRef={pongAPIRef} />
      <MainScene style={{ width: size.width, height: size.height }} />
    </div>
  );
}

export default App;