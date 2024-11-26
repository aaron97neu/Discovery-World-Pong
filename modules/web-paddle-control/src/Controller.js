import React, { useEffect } from 'react';

const Controller = ({gameState}) => {
  let position = 0.5;
  let lIntervalId = null;
  let rIntervalId = null;
  // const interval = process.env.REACT_APP_INTERVAL || 70;
  const interval = process.env.REACT_APP_INTERVAL || 70;
  const increment = process.env.REACT_APP_INCREMENT || 0.05;
  const max = process.env.REACT_APP_MAX || 1.0;
  const min = process.env.REACT_APP_MIN || 0.0;
  const paddleId = process.env.REACT_APP_PADDLE_ID || 'bottom';
  // const paddleId = process.env.REACT_APP_PADDLE_ID || 'top';

  console.log(`interval: ${interval}`);
  console.log(`increment: ${increment}`);
  console.log(`max: ${max}`);
  console.log(`min: ${min}`);

  useEffect(() => {
    // mqttClient.connect(() => {
    //   mqttClient.publish('bottom_paddle/position', position.toFixed(2));
    // });

    gameState.setState(`game_${paddleId}_paddle_position`, position.toFixed(2));

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

    let newPosition = position;
    if (direction === 'L') {
      newPosition = Math.max(min, position - increment);
    } else if (direction === 'R') {
      newPosition = Math.min(max, position + increment);
    }
    position = newPosition;
    gameState.setState(`game_${paddleId}_paddle_position`, position.toFixed(2));
  };

  const handleMouseDown = (direction) => {
    if (direction === 'L') {
      move(direction);
      lIntervalId = setInterval(move, interval, direction);
    } else if (direction === 'R') {
      move(direction);
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

export default Controller;
