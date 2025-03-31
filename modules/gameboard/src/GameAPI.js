import { useContext, useEffect, useRef } from 'react';
import {PongAPI} from 'dw-state-machine';
import {GameSessionContext} from './GameSessionContext';
import {GamePlayContext} from './GamePlayContext';

const GameAPI = ({pongAPIRef}) => {

  const {
    level,
    // isGamePlaying,
    // isIntroPlaying,
    // setIsIntroPlaying,
    // levelComplete,
    isIntroComplete,
    setIsIntroComplete,
    isLevelComplete,
    setIsGameComplete,
    isGameComplete,
  } = useContext(GameSessionContext);

  const {
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
    resetPaddles, 
  } = useContext(GamePlayContext);
  
  const prevBallPositionRef = useRef();
  // const prevLevelCompleteRef = useRef();
  const prevLevelRef = useRef(0);

  useEffect(() => {
    if (pongAPIRef.current) {
      pongAPIRef.current.registerObserver(
        PongAPI.Topics.PADDLE_TOP_POSITION, 
        onPaddleTopPosition
      );
      pongAPIRef.current.registerObserver(
        PongAPI.Topics.PADDLE_TOP_STATE, 
        onPaddleTopState
      );
      pongAPIRef.current.registerObserver(
        PongAPI.Topics.PADDLE_BOTTOM_POSITION, 
        onPaddleBottomPosition
      );
      pongAPIRef.current.registerObserver(
        PongAPI.Topics.PADDLE_BOTTOM_STATE, 
        onPaddleBottomState
      );
    }
  }, []);

  useEffect(() => {
    if (pongAPIRef.current) {     
      if ( pongAPIRef.current.isConnected()) {

        if (isGameComplete) {
          console.log(`isGameComplete: ${isGameComplete}`);
          // setIsGameComplete(false);
          const message = {
            "transition": "game_complete"
          };

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }  

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
  
          pongAPIRef.current.update(PongAPI.Topics.GAME_PLAY, message );
          prevBallPositionRef.current = ballPosition;
        }

        // if (!isIntroPlaying 
        if (!isIntroComplete
            && (topPaddleState == "start" && bottomPaddleState == "ready") 
          || (topPaddleState == "ready" && bottomPaddleState == "start")) {
          // setIsIntroPlaying(true);
          setIsIntroComplete(false);

          const message = {
            "transition": "player_ready"
          };

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

        // if (!isGamePlaying 
        //   && (topPaddleState == "start" && bottomPaddleState == "start")) {        
        if (!isGameComplete 
          && (topPaddleState == "start" && bottomPaddleState == "start")) {
          
          const message = {
            "transition": "move_intro_complete"
          };

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        } 

        if (topPaddleState == "stop" || bottomPaddleState == "stop") {
          const message = {
            "transition": "player_exit"
          };

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }  

        // if (levelComplete != prevLevelCompleteRef.current) {
        if (isLevelComplete && level != prevLevelRef.current) {
          // if (levelComplete == 1) {
          if (level == 1) {
            // console.log(`level: ${level}`)
            const message = {
              "transition": "level1_complete"
            };

            pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
          }

          // if (levelComplete == 2) {
          if (level == 2) {
            const message = {
              "transition": "level2_complete"
            };

            pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
          }

          // if (levelComplete == 3) {
          if (level == 3) {
            const message = {
              "transition": "level3_complete"
            };

            pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
          }

          // prevLevelCompleteRef.current = levelComplete;
          prevLevelRef.current = level;
        }

      }
    }
  });

  useEffect(() => {
    if (pongAPIRef.current) {     
      if ( pongAPIRef.current.isConnected()) {
        const scoreMessage = {
          "player_top": { "score": topScore },
          "player_bottom": { "score": bottomScore},
          "level": level
        };

        pongAPIRef.current.update(PongAPI.Topics.GAME_STATS, scoreMessage );
      }
    }
  }, [topScore, bottomScore]);

  useEffect(() => {
    if (pongAPIRef.current) {     
      if ( pongAPIRef.current.isConnected()) {
          if (resetPaddles) {
            const message =  { "transition": "reset" };
            pongAPIRef.current.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
            pongAPIRef.current.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );    
        }
      }
    }
  }, [resetPaddles]);

  const onPaddleTopPosition = (message) => {
      const paddlePosition = message.position.x;
      setTopPaddlePosition(paddlePosition);   
  }

  const onPaddleTopState = (message) => {
      const paddleState = message.state;
      setTopPaddleState(paddleState);      
  }

  const onPaddleBottomPosition = (message) => {
      const paddlePosition = message.position.x;
      setBottomPaddlePosition(paddlePosition);   
  }  

  const onPaddleBottomState = (message) => {
      const paddleState = message.state;
      setBottomPaddleState(paddleState);      
  }  

  return null;
}

export default GameAPI;