import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import MQTTClient from './mqttClient';

const mqttClient = new MQTTClient();

const App = () => {
  let position = 0.5;
  let lIntervalId = null;
  let rIntervalId = null;
  const interval = process.env.REACT_APP_INTERVAL;

  useEffect(() => {
    mqttClient.connect(() => {
      mqttClient.publish('motion/position', position.toFixed(2));
    });

    // disable the pinch zoom on mobile
    const disablePinchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', disablePinchZoom, { passive: false });

    return () => {
      document.removeEventListener('touchmove', disablePinchZoom);
    };
  }, []);

  const move = (direction) => {
    console.log('move: ', direction);
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
    position = newPosition;
    mqttClient.publish('motion/position', position.toFixed(2));
  };

  const handleMouseDown = (direction) => {
    if (direction === 'L') {
      lIntervalId = setInterval(move, interval, direction);
    } else if (direction === 'R') {
      rIntervalId = setInterval(move, interval, direction);
    }
  };

  const handleMouseUp = (direction) => {
    if (direction === 'L') {
      clearInterval(lIntervalId);
      lIntervalId = null;
    } else if (direction === 'R') {
      clearInterval(rIntervalId);
      rIntervalId = null;
    }
  };

  const handleMouseLeave = (direction) => {
    if (direction === 'L' && lIntervalId) {
      clearInterval(lIntervalId);
      lIntervalId = null;
    } else if (direction === 'R' && rIntervalId) {
      clearInterval(rIntervalId);
      rIntervalId = null;
    }
  };

  return (
    <div className="App">
      <button className="split-button"
        onMouseDown={() => handleMouseDown('L')}
        onMouseUp={() => handleMouseUp('L')}
        onMouseLeave={() => handleMouseLeave('L')}
        onTouchStart={() => handleMouseDown('L')}
        onTouchEnd={() => handleMouseUp('L')}
        onTouchCancel={() => handleMouseLeave('L')}
      >
        L
      </button>
      <button className="split-button"
        onMouseDown={() => handleMouseDown('R')}
        onMouseUp={() => handleMouseUp('R')}
        onMouseLeave={() => handleMouseLeave('R')}
        onTouchStart={() => handleMouseDown('R')}
        onTouchEnd={() => handleMouseUp('R')}
        onTouchCancel={() => handleMouseLeave('R')}
      >
        R
      </button>
    </div>
  );
};

export default App;
