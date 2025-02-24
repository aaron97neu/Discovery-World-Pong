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
    setLevel,
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
    isPaddlesReset,
    setIsPaddlesReset,
    resetPaddles, 
    setResetPaddles,
    playState, 
  } = useContext(PlayContext);
  
  const prevBallPositionRef = useRef();
  const prevLevelCompleteRef = useRef();

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
          setLevel(1);

          const message = {
            "transition": "player_ready"
          };
          console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

        if (topPaddleState == "start" && bottomPaddleState == "start") {
          const message = {
            "transition": "intro_complete"
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

        if (playState == PlayState.PADDLE_RESET) {
          if (resetPaddles) { 
              console.log(`transition to reset $$$$$$$$$$$$$$`);
              setResetPaddles(false);
              setIsPaddlesReset(false);
              setTopPaddleState("resetting");
              setBottomPaddleState("resetting");
              console.log(`topPaddleState: ${topPaddleState}`);
              console.log(`bottomPaddleState: ${bottomPaddleState}`);
    
              const message =  { "transition": "reset" };
              console.log(`message: ${JSON.stringify(message, null, 2)}`);
              pongAPIRef.current.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
              pongAPIRef.current.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );    
          } else {
            if (!isPaddlesReset && topPaddleState == "reset" && bottomPaddleState == "reset") {
              console.log(`reset &&&&&&&&&&&&&&&&&`);
              console.log(`topPaddleState: ${topPaddleState}`);
              console.log(`bottomPaddleState: ${bottomPaddleState}`);
              setIsPaddlesReset(true);
            }
          }
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

        if (levelComplete != prevLevelCompleteRef.current) {
          if (levelComplete == 1) {
            setLevel(2);
            const message = {
              "transition": "level1_complete"
            };
            // console.log(`message: ${JSON.stringify(message, null, 2)}`);

            pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
          }

          if (levelComplete == 2) {
            setLevel(3);
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

          prevLevelCompleteRef.current = levelComplete;
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