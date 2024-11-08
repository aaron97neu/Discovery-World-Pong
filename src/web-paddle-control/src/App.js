import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MQTTClient from './mqttClient';

const mqttClient = new MQTTClient();

const App = () => {
  const [position, setPosition] = useState(0.5);
  const intervalRef = useRef(null);

  useEffect(() => {
    mqttClient.connect(() => {
      mqttClient.publish('motion/position', position.toFixed(2));
    });
  }, []);

  const handleMouseDown = (direction) => {
    intervalRef.current = setInterval(() => {
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
    }, 100); // Adjust the interval time as needed
  };

  const handleMouseUp = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div className="App">
      <button
        className="left"
        onMouseDown={() => handleMouseDown('L')}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        L
      </button>
      <button
        className="right"
        onMouseDown={() => handleMouseDown('R')}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        R
      </button>
    </div>
  );

  // const handleClick = (direction) => {
  //   if (!mqttClient.isConnected()) {
  //     console.log('MQTT client is not connected');
  //     return;
  //   }

  //   let newPosition = position;
  //   if (direction === 'L') {
  //     newPosition = Math.max(0.0, position - 0.01);
  //   } else if (direction === 'R') {
  //     newPosition = Math.min(1.0, position + 0.01);
  //   }
  //   setPosition(newPosition);
  //   mqttClient.publish('motion/position', position.toFixed(2));
  // };

  // return (
  //   <div className="App">
  //     <button className="left-button" onClick={() => handleClick('L')}>L</button>
  //     <button className="right-button" onClick={() => handleClick('R')}>R</button>
  //   </div>
  // );
};

export default App;
