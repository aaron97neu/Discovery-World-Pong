import './App.css';
import React, {useEffect, useState, useRef} from 'react'
import { v4 as uuidv4 } from 'uuid';
import {PongAPI} from 'dw-state-machine';
import {useGameContext} from './GameContext';
import MainScene from './MainScene';

const uuid = uuidv4();

function App() {
  const {
    setPongAPI,
  } = useGameContext();

  const [size, setSize] = useState({ width: 800, height: 600 });

  const broker = process.env.REACT_APP_MQTT_BROKER || window.location.hostname;
  const port = process.env.REACT_APP_MQTT_PORT || 9001;
  const brokerUrl = `ws://${broker}:${port}`;
  const clientId = process.env.REACT_APP_MQTT_CLIENT_ID || 'gameboard';
  const fullClientId = `${clientId}-${uuid}`;
  const pongAPIRef = useRef(null); // Use useRef to store the PongAPI instance

  useEffect(() => {
    console.log(`broker: ${broker}`);
    console.log(`port: ${[port]}`);
    console.log(`clientId: ${clientId}`);
    console.log(`fullClientId: ${fullClientId}`);

    if (!pongAPIRef.current) {
      pongAPIRef.current = PongAPI(fullClientId, brokerUrl);
    } 

    if (pongAPIRef.current) {
      pongAPIRef.current.start();
    } 

    setPongAPI(pongAPIRef.current);

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
      <MainScene style={{ width: size.width, height: size.height }} />
    </div>
  );
}

export default App;