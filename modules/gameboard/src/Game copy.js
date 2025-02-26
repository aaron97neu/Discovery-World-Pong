import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {GameContext} from './GameContext';
import {PlayContext} from './PlayContext';
import * as IMAGES from './loadImages';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
import Goal from './Goal';
import Wall from './Wall';
import AudioPlayer from './AudioPlayer';
import * as TEXT from './loadText';
import StateMachine from 'javascript-state-machine';

const fsm = new StateMachine({
  init: 'idle',
  transitions: [
    { name: 'start', from: 'idle', to: 'paddleReset' },
    { name: 'resetPaddle', from: 'paddleReset', to: 'ballReset' },
    { name: 'resetBall', from: 'ballReset', to: 'reset' },
    { name: 'resetGame', from: 'reset', to: 'countdown' },
    { name: 'skipCountdown', from: 'reset', to: 'play' },
    { name: 'startCountdown', from: 'countdown', to: 'play' },
    { name: 'beginPlay', from: 'play', to: 'topGoal' },
    { name: 'beginPlayBottom', from: 'play', to: 'bottomGoal' },
    { name: 'goalScored', from: ['topGoal', 'bottomGoal'], to: 'gameFinished' },
    { name: 'finishGame', from: 'gameFinished', to: 'idle' },
  ],
  methods: {
    // Method called when entering the 'idle' state
    onEnterIdle: () => {
      console.log('Entering idle state');
      setIncludeCountDown(true);
      setCountdown(TEXT.countdown_get_ready);
      setTimeout(() => {
      }, delay);
    },
    // Method called when leaving the 'idle' state
    onLeaveIdle: () => {
      console.log('Leaving idle state');
    },    
    // Method called when entering the 'paddleReset' state
    onEnterPaddleReset: () => {
      console.log('Entering paddleReset state');
    },
    // Method called when leaving the 'paddleReset' state
    onLeavePaddleReset: () => {
      console.log('Leaving paddleReset state');
              // setTopPaddleState("resetting");
        // setBottomPaddleState("resetting");
        setIsPaddleReset(false);
        setResetPaddles(true);
    },
    // Method called when entering the 'ballReset' state
    onEnterBallReset: () => {
      console.log('Entering ballReset state');
      setIsBallReset(false);
      if (ballRef.current) {
        ballRef.current.setTranslation(ballStartTranslation, true);
        // ballRef.current.setTranslation( {x: 0, y:-50, z: 0}, true); 
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        ballRef.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        setTimeout(() => {
          setIsBallReset(true);
        }, 500); 
      }
    },
    // Method called when leaving the 'ballReset' state
    onLeaveBallReset: () => {
      console.log('Leaving ballReset state');
    },
    // Method called when entering the 'reset' state
    onEnterReset: () => {
      console.log('Entering reset state');
    },
    // Method called when leaving the 'reset' state
    onLeaveReset: () => {
      console.log('Leaving reset state');
    },
    // Method called when entering the 'countdown' state
    onEnterCountdown: () => {
      console.log('Entering countdown state');
      setCountdown(TEXT.countdown_three);
      setTimeout(() => {
        setCountdown(TEXT.countdown_two);
        setTimeout(() => {
          setCountdown(TEXT.countdown_one);
          setTimeout(() => {
            setCountdown(TEXT.countdown_go);
            setTimeout(() => {
              setCountdown(TEXT.blank);
              setIsCountdownComplete(true);     
            }, delay); 
          }, delay); 
        }, delay);
      }, delay);
    },
    // Method called when leaving the 'countdown' state
    onLeaveCountdown: () => {
      console.log('Leaving countdown state');
    },
    // Method called when entering the 'play' state
    onEnterPlay: () => {
      console.log('Entering play state');
      setResetPaddles(false);
      // setIsBallReset(false);
      ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
    },
    // Method called when leaving the 'play' state
    onLeavePlay: () => {
      console.log('Leaving play state');
    },
    // Method called when entering the 'topGoal' state
    onEnterTopGoal: () => {
      console.log('Entering topGoal state');
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play('pointScore').catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setBottomScore((prev) => prev + 1);
    },
    // Method called when leaving the 'topGoal' state
    onLeaveTopGoal: () => {
      console.log('Leaving topGoal state');
    },
    // Method called when entering the 'bottomGoal' state
    onEnterBottomGoal: () => {
      console.log('Entering bottomGoal state');
      if (audioPlayerRef.current) {
        audioPlayerRef.current.play('pointLose').catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setTopScore((prev) => prev + 1);
      if (level == 3) {
        setLevelComplete(3);
      }
    },
    // Method called when leaving the 'bottomGoal' state
    onLeaveBottomGoal: () => {
      console.log('Leaving bottomGoal state');
    },
    // Method called when entering the 'gameFinished' state
    onEnterGameFinished: () => {
      console.log('Entering gameFinished state');
      prevLevelRef.current = 0;
      if (bottomScore > topScore) {
        setCountdown(TEXT.human_wins);
      }

      if (bottomScore < topScore) {
        setCountdown(TEXT.tyler_wins);
      }

      if (bottomScore == topScore) {
        setCountdown(TEXT.draw);
      }
    },
    // Method called when leaving the 'gameFinished' state
    onLeaveGameFinished: () => {
      console.log('Leaving gameFinished state');
    },
  },
});

const speed = 200;
const gameboardHeight = 160; // height used in AI 
const gameboardWidth = 192; // width used in AI
const gameboardZ = -3.0;
const paddleWidth = 20;
const paddleHeigth = 3.0;
const paddlePadding = 3.0
const ballRadius = 4.0;
const wallWidth = 1.0;
const goalWidth = 0.1;
const ballStartPosition = [0, -(gameboardHeight / 2) + 10, 0];
const ballStartTranslation = {x: 0, y: -(gameboardHeight / 2) + 10, z: 0};
const angles = [-60, -45, -30, 0, 0, 30, 45, 60]; // Bounce angles
// const regionSize = paddleWidth / 8;

function Game() {

  const {
    // isLevelPlaying,
    level,
    levelComplete,
    setLevelComplete,
  } = useContext(GameContext);

  const {
    setCountdown,
    topPaddlePosition,
    bottomPaddlePosition,
    topPaddleState,
    setTopPaddleState,
    setBottomPaddleState,
    bottomPaddleState,
    setBallPosition, 
    setResetPaddles,
    topScore,
    setTopScore,
    bottomScore,
    setBottomScore,
  } = useContext(PlayContext);

  const ballRef = useRef();
  const prevLevelRef = useRef(0);
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  // const [playState, setPlayState] = useState(PlayState.IDLE);
  // const [state, setState] = useState(fsm.state);
  const [oldBall, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [isPaddleReset, setIsPaddleReset] = useState(false);
  const [isBallReset, setIsBallReset] = useState(false);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [includeCountDown, setIncludeCountDown] = useState(true);

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;
  const delay = 600;

  useEffect(() => {
    // console.log("game constructor");
    // setPlayState(PlayState.IDLE);
    fsm.start();
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
      audioPlayerRef.current.setVolume('paddleHit', audioVolume);
      audioPlayerRef.current.setVolume('pointScore', audioVolume);
      audioPlayerRef.current.setVolume('pointLose', audioVolume);
    }
  }, []);

  useEffect(() => {

    if(playState == PlayState.IDLE) {
      if (level != prevLevelRef.current) {
        prevLevelRef.current = level;
        setPlayState(PlayState.PADDLE_RESET);
        fsm[transition]();
        // setState(fsm.state);
      }

      if (levelComplete == 3) {
        setPlayState(PlayState.GAME_FINISHED);
      }
    }

    if(playState == PlayState.PADDLE_RESET) {
      if (isPaddleReset) {
        console.log(`reset &&&&&&&&&&&&&&&&&`);
        console.log(`topPaddleState: ${topPaddleState}`);
        console.log(`bottomPaddleState: ${bottomPaddleState}`);
        console.log(`topPaddlePosition: ${topPaddlePosition}`);
        console.log(`bottomPaddlePosition: ${bottomPaddlePosition}`);
  
        setPlayState(PlayState.BALL_RESET);
      }
    }

    if(playState == PlayState.BALL_RESET) {
      if(isBallReset) {
        setPlayState(PlayState.RESET);
      }
    }

    if(playState == PlayState.RESET) {
      // if(isBallReset && isPaddlesReset) {
  
        // console.log(`topPaddlePosition: ${topPaddlePosition}`);
        // console.log(`bottomPaddlePosition: ${bottomPaddlePosition}`);
        // console.log(`isBallReset: ${isBallReset}`);
        // console.log(`isPaddlesReset: ${isPaddlesReset}`);
  
        // setPlayState(PlayState.PLAY);
        console.log(`includeCountDown: ${includeCountDown}`);
        if (includeCountDown) {
          setIsCountdownComplete(false);
          setPlayState(PlayState.COUNTDOWN);
        } else {
          setPlayState(PlayState.PLAY);
        }
      // }
    }

    if(playState == PlayState.COUNTDOWN) {
      if (isCountdownComplete) {
        setPlayState(PlayState.PLAY);
      }   
    }

    if(playState == PlayState.PLAY) {
      if (ballRef && ballRef.current) {
        try {
          const currentPosition = ballRef.current.translation();

          if (currentPosition.y > 90) {
            setPlayState(PlayState.TOP_GOAL);
          }

          if (currentPosition.y < -90) {
            setPlayState(PlayState.BOTOM_GOAL);
          }
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }
    }

    if(playState == PlayState.TOP_GOAL) {
      setIncludeCountDown(false);
      setPlayState(PlayState.PADDLE_RESET);
    }

    if(playState == PlayState.BOTOM_GOAL) {
      setIncludeCountDown(false);
      setPlayState(PlayState.PADDLE_RESET);
    }

    if(playState == PlayState.GAME_FINISHED) {
      setPlayState(PlayState.IDLE);
    }

  });

  useEffect(() => {
    console.log(`111111111111 bottomPaddleState: ${bottomPaddleState}`);
    if (bottomPaddleState == "reset" && topPaddleState == "reset") {
      setIsPaddleReset(true);
    }
  }, [bottomPaddleState]);

  useEffect(() => {
    console.log(`111111111111 topPaddleState: ${topPaddleState}`);
    if (bottomPaddleState == "reset" && topPaddleState == "reset") {
      setIsPaddleReset(true);
    }
  }, [topPaddleState]);

  useEffect(() => {
    console.log(`111111111111 bottomPaddlePosition: ${bottomPaddlePosition}`);
  }, [bottomPaddlePosition]);

  useEffect(() => {
    console.log(`111111111111 topPaddlePosition: ${topPaddlePosition}`);
  }, [topPaddlePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This message prints every half second');
      if (ballRef && ballRef.current) {
        try {
          const currentPosition = ballRef.current.translation();
          currentPosition.x = Math.round(currentPosition.x);
          currentPosition.y = Math.round(currentPosition.y);
          currentPosition.z = Math.round(currentPosition.z);

          if (currentPosition.x != oldBall.x || currentPosition.y != oldBall.y) {
            setBallPosition(currentPosition);
            setOldBallPosition(currentPosition);
          }
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }      
    }, 100);

    return () => clearInterval(interval); // Cleanup the interval on component unmount   
  },);  
  
  const handleCollision = useCallback((event) => {
    const otherObject = event.rigidBody;
    const targetObject = event.target.rigidBody;

    if (otherObject.userData && otherObject.userData.isBall && 
      targetObject.userData && targetObject.userData.isPaddle) {

      audioPlayerRef.current.play('paddleHit').catch((error) => {
        console.error('Error playing audio:', error);
      });

      const collisionPoint = event.manifold.localContactPoint1().x;
      const d = (collisionPoint + (paddleWidth / 2));
      const regionIndex = Math.min(7, Math.floor((collisionPoint + (paddleWidth / 2)) / 2.5))

      if (regionIndex >= 0 && regionIndex < angles.length) {
        const radians = (angles[regionIndex] * (Math.PI / 180)); // Convert angle to radians
        const newVelocity = {
          x: speed * Math.sin(radians),
          y: speed * Math.cos(radians) * (targetObject.isTop ? -1 : 1), // Adjust y based on whether it's the top or bottom paddle
          z: 0,
        };   
        // console.log(handleCollision);
        otherObject.setLinvel(newVelocity, true);
      }
    }
  }, []);
  
  return (
    <group position={[0, 0, 0]} >
      <Gameboard 
        position={[0.0, 0.0, gameboardZ]} 
        args={[gameboardWidth, gameboardHeight]} 
        map={texture} 
      />

      {/* <Goal 
        position={[0, gameboardHeight / 2 + ballRadius * 2, 0]} 
        args={[gameboardWidth, goalWidth, ballRadius * 5]} 
        onGoal={handleTopGoalScored} 
      />

      <Goal 
        position={[0, -gameboardHeight / 2 - ballRadius * 2, 0]} 
        args={[gameboardWidth, goalWidth, ballRadius * 5]}
        onGoal={handleBottomGoalScored} 
      /> */}

      <Wall 
        position={[gameboardWidth / 2, 0, 0]} 
        args={[wallWidth, gameboardHeight]} 
      />

      <Wall 
        position={[-gameboardWidth / 2, 0, 0]} 
        args={[wallWidth, gameboardHeight]} 
      />

      <Paddle
        // ref={topPaddleRef}
        isTop={true}
        position={[gameboardWidth / 2, gameboardHeight / 2 - paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(187,30,50)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={topPaddlePosition}
        handleCollision={handleCollision}
      />

      <Paddle 
        // ref={bottomPaddleRef}
        isTop={false}
        position={[gameboardWidth / 2, -gameboardHeight / 2 + paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(20,192,243)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={bottomPaddlePosition} 
        handleCollision={handleCollision}
      />

      <Ball 
        ref={ballRef}  
        position={ballStartPosition} 
        args={[ballRadius, 64, 64]}  
        color="rgb(255,255,255)" 
      />
    </group>
  );
}

export default Game;