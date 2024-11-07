import React, { useState, useEffect } from 'react';
import './App.css';
import MQTTClient from './mqttClient';

const mqttClient = new MQTTClient();

const App = () => {
  const [position, setPosition] = useState(0.5);

  useEffect(() => {
    mqttClient.connect(() => {
      mqttClient.publish('motion/position', position.toFixed(2));
    });
  }, []);

  const handleClick = (direction) => {
    if (!mqttClient.isConnected()) {
      console.log('MQTT client is not connected');
      return;
    }

    let newPosition = position;
    if (direction === 'L') {
      newPosition = Math.max(0.0, position - 0.01);
    } else if (direction === 'R') {
      newPosition = Math.min(1.0, position + 0.01);
    }
    setPosition(newPosition);
    mqttClient.publish('motion/position', position.toFixed(2));
  };

  return (
    <div className="App">
      <button className="left-button" onClick={() => handleClick('L')}>L</button>
      <button className="right-button" onClick={() => handleClick('R')}>R</button>
    </div>
  );
};

export default App;
