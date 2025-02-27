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
import PlayStateMachine from './PlayStateMachine';
// import StateMachine from 'javascript-state-machine';
import ChildComponent from './ChildComponent';

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


// playStateMachine[transition]();

function Game() {
  const childRef = useRef(null);

  const {
    // isLevelPlaying,
    level,
    levelComplete,
    setLevelComplete,
  } = useContext(GameContext);

  const {
    topPaddlePosition,
    setTopPaddlePosition,
    bottomPaddlePosition,
    setBottomPaddlePosition,
    topPaddleState,
    bottomPaddleState,
    setBallPosition, 
    isCountdownComplete, 
    setIsCountdownComplete,
    includeCountDown, 
    setIncludeCountDown,
    isPaddleReset, 
    isTopPaddleReset,
    setIsTopPaddleReset,
    isBottomPaddleReset,
    setIsBottomPaddleReset,
    isBallReset, 
    prevLevel, 
    setPrevLevel,
    stateMachine, 
    setStateMachine,
    forcePaddleRerender, 
    setForcePaddleRerender,
    setForceBallRerender,
    setIsBallReset,
    isDontPlay,
    setIsDontPlay,
    topScore,
    setTopScore,
    bottomScore,
    setBottomScore,    
  } = useContext(PlayContext);  
  
  const fsmRef = useRef(null);
  const topPaddleRef = useRef();
  const bottomPaddleRef = useRef();
  const ballRef = useRef();

  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBallPosition, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [counter, setCounter] = useState(0);

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;
  const delay = 600;

  useEffect(() => {
    // console.log("game constructor");
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
      audioPlayerRef.current.setVolume('paddleHit', audioVolume);
    }
  }, []);

  useFrame(() => {
  // useEffect(() => {
    if (fsmRef.current) {

      if(fsmRef.current.state === 'idle') {
        fsmRef.current.resetPaddle();
      }

      if(fsmRef.current.state === 'levelReset') {
        fsmRef.current.startLevel();
      }

      if(fsmRef.current.state === 'paddleReset') {
        if (isTopPaddleReset && isBottomPaddleReset) {
          fsmRef.current.resetBall();
          setForceBallRerender(prevState => !prevState);
        }
      }

      if(fsmRef.current.state === 'ballReset') {
        if(isBallReset) {
          setForcePaddleRerender(prevState => !prevState);
          fsmRef.current.resetGame();
        }
      }

      if(fsmRef.current.state === 'gameReset') {
        if (!isDontPlay) {
          if (includeCountDown) {
            fsmRef.current.startCountdown();
          } else {
            fsmRef.current.beginPlay();
          }
        }
      }

      if(fsmRef.current.state === 'countdown') {
        if (isCountdownComplete) {
          fsmRef.current.beginPlay();
        }   
      }

      if(fsmRef.current.state === 'play') {
        if (ballRef && ballRef.current) {
          try {
            const currentPosition = ballRef.current.translation();

            if (currentPosition.y > 90) {
              fsmRef.current.topGoalScored();
            }

            if (currentPosition.y < -90) {
              fsmRef.current.bottomGoalScored();
            }
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
        }
      }

      if(fsmRef.current.state === 'topGoal') {
        fsmRef.current.resetPaddle();
      }

      if(fsmRef.current.state === 'bottomGoal') {
        fsmRef.current.resetPaddle();
        console.log(`bottom goal level: ${level}`);
        if (level == 3) {
          setLevelComplete(3);
        }
      }
    }
  });

  useEffect(() => {
    if (level === 4) {
      setTopScore(0);
      setBottomScore(0);
      fsmRef.current.returnToIdle();
    } else {
      if (level > 0) {
        console.log(`level: ${level}`);
        fsmRef.current.resetLevel();
      }
    }
  }, [level]);

  useEffect(() => {
    if (levelComplete === 3) {
      console.log(`levelComplete: ${levelComplete}`);
      fsmRef.current.endGame();
    } else {
      if (levelComplete > 0) {
        console.log(`levelComplete: ${levelComplete}`);
        fsmRef.current.endLevel();
      }
    }    
  }, [levelComplete]);
 
  useEffect(() => {
    if (bottomPaddleState == "reset") {
      setIsBottomPaddleReset(true);
    }
  }, [bottomPaddleState]);

  useEffect(() => {
    if (topPaddleState == "reset") {
      setIsTopPaddleReset(true);
    }
  }, [topPaddleState]);

  useEffect(() => {
    const interval = setInterval(() => {
      // console.log('This message prints every half second');
      if (ballRef && ballRef.current) {
        try {
          const currentPosition = ballRef.current.translation();
          currentPosition.x = Math.round(currentPosition.x);
          currentPosition.y = Math.round(currentPosition.y);
          currentPosition.z = Math.round(currentPosition.z);

          if (currentPosition.x != oldBallPosition.x || currentPosition.y != oldBallPosition.y) {
            setBallPosition(currentPosition);
            setOldBallPosition(currentPosition);
          }
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }      
    }, 100);

    return () => clearInterval(interval); // Cleanup the interval on component unmount   
  });  
  
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
        otherObject.setLinvel(newVelocity, true);
      }
    }
  }, []);

  return (
    <group position={[0, 0, 0]} >
      <ChildComponent ref={childRef} />
      <PlayStateMachine ref={fsmRef} ballRef={ballRef} />

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
        // position={[gameboardWidth / 2, gameboardHeight / 2 - paddlePadding, 0.0]} 
        position={[0.0, gameboardHeight / 2 - paddlePadding, 0.0]} 
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
        // position={[gameboardWidth / 2, -gameboardHeight / 2 + paddlePadding, 0.0]} 
        position={[0.0, -gameboardHeight / 2 + paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(20,192,243)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={bottomPaddlePosition} 
        handleCollision={handleCollision}
      />

      <Ball 
        // ref={ballRef}  
        ballRef={ballRef}
        position={ballStartPosition} 
        args={[ballRadius, 64, 64]}  
        color="rgb(255,255,255)" 
      />
    </group>
  );
}

export default Game;