import { useContext, useEffect, useState, useRef } from 'react';
import {SceneContext} from './SceneContext';
import AudioPlayer from './AudioPlayer';
import {PongAPI} from 'dw-state-machine';

// class GamePlay {
const GamePlay = ({pongAPIRef}) => {
  const {
    level,
    levelComplete,
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
    isPaddleHit,
    setIsPaddleHit,
    setIsPaddlesReset,
    resetPaddles, 
    setResetPaddles,
  } = useContext(SceneContext);

  const [prevTopScore, setPrevTopScore] = useState(0);
  const [prevBottomScore, setPrevBottomScore] = useState(0);

  const [topPaddleReset, setTopPaddleReset] = useState(false);
  const [bottomPaddleReset, setBottomPaddleReset] = useState(false);

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;

  useEffect(() => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
      audioPlayerRef.current.setVolume('paddleHit', audioVolume);
      audioPlayerRef.current.setVolume('pointScore', audioVolume);
      audioPlayerRef.current.setVolume('pointLose', audioVolume);
    }
  }, []);
  
  useEffect(() => {
    if (pongAPIRef.current) {
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_TOP_POSITION, onPaddleTopPosition);
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_TOP_STATE, onPaddleTopState);
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_BOTTOM_POSITION, onPaddleBottomPosition);
      pongAPIRef.current.registerObserver(PongAPI.Topics.PADDLE_BOTTOM_STATE, onPaddleBottomState);
    }
  }, [pongAPIRef]);

  useEffect(() => {
    if (isPaddleHit && audioPlayerRef.current) {
      // console.log("####################################");
      setIsPaddleHit(false);
      audioPlayerRef.current.play('paddleHit').catch((error) => {
        console.error('Error playing audio:', error);
      });
      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    }
  }, [isPaddleHit]);
 
  useEffect(() => {
    if (pongAPIRef.current) {     
      if ( pongAPIRef.current.isConnected()) {
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
      }
    }
    // console.log(`ballPosition: ${JSON.stringify(ballPosition, null, 2)}`);
  }, [ballPosition, topPaddlePosition, bottomPaddlePosition]);
  // }, [pongAPIRef, ballPosition]);

  useEffect(() => {
    // console.log('GamePlay Entered useEffect2');
    // console.log(`posistion: ${JSON.stringify(ballPosition, null, 2)}`);
    if (pongAPIRef.current) {
      // console.log(`pongAPI.isConnected(): ${pongAPIRef.current.isConnected()}`);
      // console.log(`3pongAPI id: ${pongAPIRef.current.getInstanceId()}`);
      // console.log(`saved pongAPI id: ${pongAPIsaved.instanceId()}`);

      if ( pongAPIRef.current.isConnected()) {
        // console.log('topPaddleState:', topPaddleState);
        // console.log('bottomPaddleState:', bottomPaddleState);

        if ((topPaddleState == "ready" || topPaddleState == "start") && (bottomPaddleState == "ready" || bottomPaddleState == "start")) {
          const message = {
            "transition": "player_ready"
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }

        if (topPaddleState == "start" && bottomPaddleState == "start") {
          const message = {
            "transition": "start_game"
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }        

        if (topPaddleState == "stop" || bottomPaddleState == "stop") {
          const message = {
            "transition": "player_exit"
          };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          pongAPIRef.current.update(PongAPI.Topics.GAME_STATE, message );
        }
      }
    }

    // console.log(`ballPosition: ${JSON.stringify(ballPosition, null, 2)}`);

  }, [topPaddleState, bottomPaddleState]);

  useEffect(() => {
    if (topPaddleReset && bottomPaddleReset) {
      // console.log(`topPaddleReset: ${topPaddleReset}`);
      // console.log(`bottomPaddleReset: ${bottomPaddleReset}`);
      setIsPaddlesReset(true);
    }
  }, [topPaddleReset, bottomPaddleReset]);

  useEffect(() => {
    // console.log(`transition to reset5`);
    if (resetPaddles) {
      if (pongAPIRef.current) {
        if ( pongAPIRef.current.isConnected()) {     
          const message =  { "transition": "reset" };
          // console.log(`message: ${JSON.stringify(message, null, 2)}`);

          // console.log(`transition to reset`);
          setTopPaddleReset(false);
          setBottomPaddleReset(false);
          pongAPIRef.current.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
          pongAPIRef.current.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );    
          // setIsPaddlesReset(false);
          setResetPaddles(false);
        }
      }
    }
  }, [resetPaddles]);

  useEffect(() => {
    if (pongAPIRef.current) {
      if ( pongAPIRef.current.isConnected()) {     
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
  }, [levelComplete]);

  useEffect(() => {
    if (topScore > prevTopScore) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play('pointScore').catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setPrevTopScore(topScore);
    }

    if (bottomScore > prevBottomScore) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play('pointLose').catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setPrevBottomScore(bottomScore);
    }

    if (pongAPIRef.current) {
      if ( pongAPIRef.current.isConnected()) {     
        const scoreMessage = {
          "player_top": { "score": topScore },
          "player_bottom": { "score": bottomScore},
          "level": level
        };
        // console.log(`message: ${JSON.stringify(message, null, 2)}`);

        pongAPIRef.current.update(PongAPI.Topics.GAME_STATS, scoreMessage );
        
        const stateMessage =  { "transition": "reset" };
        // console.log(`message: ${JSON.stringify(message, null, 2)}`);
        // console.log(`message: ${JSON.stringify(message, null, 2)}`);

        // console.log(`transition to reset1`);
        // pongAPIRef.current.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION, stateMessage );
        // pongAPIRef.current.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, stateMessage );
      }
    }
  }, [topScore, bottomScore, level]);

  const onPaddleTopPosition = (message) => {
      const paddlePosition = message.position.x;
      // console.log('top  paddlePosition:', paddlePosition);
      setTopPaddlePosition(paddlePosition);   
  }

  const onPaddleTopState = (message) => {
      const paddleState = message.state;
      // console.log('top paddleState:', paddleState);
      if (paddleState == "reset") {
        setTopPaddleReset(true);
      }
      setTopPaddleState(paddleState);      
  }

  const onPaddleBottomPosition = (message) => {
      const paddlePosition = message.position.x;
      // console.log('bottom paddlePosition:', paddlePosition);
      setBottomPaddlePosition(paddlePosition);   
  }  

  const onPaddleBottomState = (message) => {
      const paddleState = message.state;
      // console.log('bottom paddleState:', paddleState);
      if (paddleState == "reset") {
        setBottomPaddleReset(true);
      }
      setBottomPaddleState(paddleState);      
  }  

  return null;
}

export default GamePlay;