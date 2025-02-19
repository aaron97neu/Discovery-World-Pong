import React, { useEffect, useCallback } from 'react';
import {PongAPI} from 'dw-state-machine';

const Controller = ({pongAPIRef}) => {
  let position = 0.5;
  let lIntervalId = null;
  let rIntervalId = null;
  let paddlePositionTopic = PongAPI.Topics.PADDLE_BOTTOM_POSITION;
  let paddleStateTopic = PongAPI.Topics.PADDLE_BOTTOM_STATE;
  let paddleStateTransitionTopic = PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION;
  // const interval = process.env.REACT_APP_INTERVAL || 70;
  const interval = process.env.REACT_APP_INTERVAL || 70;
  const increment = parseFloat(process.env.REACT_APP_INCREMENT) || 0.05;
  const max = process.env.REACT_APP_MAX || 1.0;
  const min = process.env.REACT_APP_MIN || 0.0;
  const paddleId = process.env.REACT_APP_PADDLE_ID || 'bottom';
  // const paddleId = process.env.REACT_APP_PADDLE_ID || 'top';

  if (paddleId === 'top') {
    paddleStateTopic = PongAPI.Topics.PADDLE_TOP_STATE;
    paddlePositionTopic = PongAPI.Topics.PADDLE_TOP_POSITION;
    paddleStateTransitionTopic = PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION;
  } else {
    paddleStateTopic = PongAPI.Topics.PADDLE_BOTTOM_STATE;
    paddlePositionTopic = PongAPI.Topics.PADDLE_BOTTOM_POSITION;
    paddleStateTransitionTopic = PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION;
  }

  console.log(`paddleId: ${paddleId}`);
  console.log(`paddleTopic: ${paddleStateTopic}`);
  console.log(`paddleStateTransitionTopic: ${paddleStateTransitionTopic}`);
  console.log(`interval: ${interval}`);
  console.log(`increment: ${increment}`);
  console.log(`max: ${max}`);
  console.log(`min: ${min}`);

  useEffect(() => {
    // mqttClient.connect(() => {
    //   mqttClient.publish('bottom_paddle/position', position.toFixed(2));
    // });

    // gameState.setState(`game_${paddleId}_paddle_position`, position.toFixed(2));

    if (pongAPIRef.current) {
        // pongAPIRef.current.update(paddleTopic, { position: { x: position.toFixed(2) } });

        pongAPIRef.current.registerObserver(paddleStateTransitionTopic, onPaddleStateTransition);

        pongAPIRef.current.update(paddleStateTopic, { state: "ready" });
    }

  
    // disable the pinch zoom on mobile
    const disablePinchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', disablePinchZoom, { passive: false });

    return () => {
      document.removeEventListener('touchmove', disablePinchZoom);
      pongAPIRef.current.update(paddleStateTopic, { state: "not_ready" });
    };
  }, [pongAPIRef]);

  const onPaddleStateTransition = (message) => {
      console.log('Paddle Message:', message);
      const paddleStateTransition = message.transition;
      if (paddleStateTransition == 'reset') {
        console.log('######################################');
        console.log('Paddle Message:', message);
        position = 0.5;
      }
  }

  const move = useCallback((direction) => {
    console.log('move: ', direction);

    let newPosition = position;
    if (direction === 'L') {
      console.log(`min: ${min}`);
      console.log(`position - increment: ${position - increment}`);
      console.log(`Math.max(min, position - increment): ${Math.max(min, position - increment)}`);
      newPosition = Math.max(min, position - increment);
    } else if (direction === 'R') {
      console.log(`max: ${max}`);
      console.log(`position + increment: ${position + increment}`);
      console.log(`Math.min(max, position + increment): ${Math.min(max, position + increment)}`);
      newPosition = Math.min(max, position + increment);
    }
    position = newPosition;
    // gameState.setState(`game_${paddleId}_paddle_position`, position.toFixed(2));
    console.log(`position: ${position}`);
    pongAPIRef.current.update(paddlePositionTopic, { position: { x: parseFloat(position.toFixed(2)) } });

  }, [pongAPIRef]);

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

  const startButton = useCallback(() => {
    console.log("Start button clicked");
    // Add code to handle the start button click here
    pongAPIRef.current.update(paddleStateTopic, { state: "start" });
  }, [pongAPIRef]);

  const stopButton = useCallback(() => {
    console.log("Stop button clicked");
    pongAPIRef.current.update(paddleStateTopic, { state: "stop" });
  }, [pongAPIRef]);


  const readyButton = useCallback(() => {
    console.log("Ready button clicked");
    pongAPIRef.current.update(paddleStateTopic, { state: "ready" });
  }, [pongAPIRef]);
  
  return (
    <div className="Controller">
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
      <div className="right-panel">
      <button className="small-button" onClick={stopButton}>
          <i className="fas fa-stop" style={{ color: 'red' }}></i>
      </button>
      <button className="small-button" onClick={startButton}>
          <i className="fas fa-play" style={{ color: 'green' }}></i>
      </button>
      <button className="small-button" onClick={readyButton}>
          <i className="fas fa-check" style={{ color: 'blue' }}></i>
      </button>
      </div>
    </div>
  );
};

export default Controller;
