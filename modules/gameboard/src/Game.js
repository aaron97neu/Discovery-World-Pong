import React, { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {useGameContext} from './GameContext';
import {useGamePlayContext} from './GamePlayContext';
import GameStateMachine from './GameStateMachine';
import { PongAPI } from 'dw-state-machine';

const Game = () => {
  const {
    setGameStateMachine,
    gameStateMachine,
    pongAPI,
  } = useGameContext();

  const {
    topPaddleState, setTopPaddleState,
    bottomPaddleState, setBottomPaddleState,
  } = useGamePlayContext();  

  useEffect(() => {
    if (gameStateMachine) {
      gameStateMachine.start();
    }
  }, [gameStateMachine]);

  useEffect(() => {
    if (pongAPI) {
      pongAPI.registerObserver(
        PongAPI.Topics.PADDLE_TOP_STATE, 
        onPaddleTopState
      );

      pongAPI.registerObserver(
        PongAPI.Topics.PADDLE_BOTTOM_STATE, 
        onPaddleBottomState
      );
    }
  }, [pongAPI]);

  useEffect(() => {
    if (gameStateMachine) {
      if (pongAPI &&  pongAPI.isConnected()) {     
        if (gameStateMachine.state != "idle"
          && (topPaddleState == "stop" || bottomPaddleState == "stop")) {
            console.log("000000000000000000000000");
            console.log(`gameStateMachine.state: ${gameStateMachine.state}`);
          const message = {
            "transition": "player_exit"
          };
    
          pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        }  
    
        if (gameStateMachine.state === "idle"
          && (topPaddleState == "start" && bottomPaddleState == "ready") 
          || (topPaddleState == "ready" && bottomPaddleState == "start")) {
    
          const message = {
            "transition": "player_ready"
          };
    
          pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        }
    
        if (gameStateMachine.state === "idle" 
          && (topPaddleState == "start" && bottomPaddleState == "start")) {
          
          const message = {
            "transition": "move_intro_complete"
          };
    
          pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        } 
      }
    }

  });

  const onPaddleTopState = (message) => {
    const paddleState = message.state;
    setTopPaddleState(paddleState);      
  }

  const onPaddleBottomState = (message) => {
    const paddleState = message.state;
    setBottomPaddleState(paddleState);      
  } 

  return (
    <GameStateMachine />
  );
  
};

export default Game;