import { useContext, useEffect, useState, useRef } from 'react';
import {GameContext} from './GameContext';
import {PlayContext, PlayState} from './PlayContext';
import {PongAPI} from 'dw-state-machine';

// class GamePlay {
const GamePlay = ({pongAPIRef}) => {

  const {
    isGamePlaying,
    setIsGamePlaying,
    levelComplete,
  } = useContext(GameContext);

  const {
    level,
    topScore,
    bottomScore,
    topPaddlePosition,
    setTopPaddlePosition, 
    bottomPaddlePosition,
    setBottomPaddlePosition, 
    setTopPaddleState, 
    topPaddleState, 
    setBottomPaddleState, 
    bottomPaddleState, 
    ballPosition,
    setIsPaddlesReset,
    resetPaddles, 
    setResetPaddles,
    playState, 
  } = useContext(PlayContext);
  
  const prevBallPositionRef = useRef();

  useEffect(() => {
    if (pongAPIRef.current) {
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_TOP_POSITION, onPaddleTopPosition);
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_TOP_STATE, onPaddleTopState);
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_BOTTOM_POSITION, onPaddleBottomPosition);
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_BOTTOM_STATE, onPaddleBottomState);
    }
  }, []);

  useEffect(() => {
    if (pongAPIRef.current) {     
      if ( pongAPIRef.current.isConnected()) {

        if (prevBallPositionRef.current !== ballPosition) {
          const message = {
            "ball": {
              "position": {
                "x": ballPosition.x,
                "y": ballPosition.y
              }
            },
            "paddle_top": {
              "position": {
                "x": topPaddlePosition
              }
            },
            "paddle_bottom": {
              "position": {
                "x":bottomPaddlePosition
              }
            }
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);
  
          pongAPIRef.current.update(PongAPI.Topics.GAME_PLAY, message );
          prevBallPositionRef.current = ballPosition;
        }

        if (!isGamePlaying && (topPaddleState == "ready" || topPaddleState == "start") && (bottomPaddleState == "ready" || bottomPaddleState == "start")) {
          setIsGamePlaying(true);
          const message = {
            "transition": "player_ready"
          };
          console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

        if (topPaddleState == "start" && bottomPaddleState == "start") {
          const message = {
            "transition": "start_game"
          };
          console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }        

        if (topPaddleState == "stop" || bottomPaddleState == "stop") {
          const message = {
            "transition": "player_exit"
          };
          console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }  

        if (resetPaddles) { 
            // console.log(`transition to reset`);
            setResetPaddles(false);
            setIsPaddlesReset(false);
  
            const message =  { "transition": "reset" };
            console.log(`message: ${JSON.stringify(message, null, 2)}`);
            pongAPIRef.current.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
            pongAPIRef.current.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );    
        }

        if (topPaddleState == "reset" && bottomPaddleState == "reset") {
          setIsPaddlesReset(true);
        }

        if (playState == PlayState.TOP_GOAL || playState == PlayState.BOTOM_GOAL) {
          const scoreMessage = {
            "player_top": { "score": topScore },
            "player_bottom": { "score": bottomScore},
            "level": level
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATS, scoreMessage );
        }

        if (levelComplete == 1) {
          const message = {
            "transition": "level1_complete"
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

        if (levelComplete == 2) {
          const message = {
            "transition": "level2_complete"
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

        if (levelComplete == 3) {
          const message = {
            "transition": "level3_complete"
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

      }
    }
  });

  const onPaddleTopPosition = (message) => {
      const paddlePosition = message.position.x;
      console.log('top  paddlePosition:', paddlePosition);
      setTopPaddlePosition(paddlePosition);   
  }

  const onPaddleTopState = (message) => {
      const paddleState = message.state;
      // console.log('top paddleState:', paddleState);
      setTopPaddleState(paddleState);      
  }

  const onPaddleBottomPosition = (message) => {
      const paddlePosition = message.position.x;
      console.log('bottom paddlePosition:', paddlePosition);
      setBottomPaddlePosition(paddlePosition);   
  }  

  const onPaddleBottomState = (message) => {
      const paddleState = message.state;
      // console.log('bottom paddleState:', paddleState);
      setBottomPaddleState(paddleState);      
  }  

  return null;
}

export default GamePlay;