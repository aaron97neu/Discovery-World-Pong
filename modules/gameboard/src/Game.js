import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
import Goal from './Goal';
import Wall from './Wall';

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
    topPaddlePosition,
    bottomPaddlePosition,
    setBallPosition, 
    playing, 
    setPlaying,
    isPlaying, 
    setIsPlaying,
    setTopScore,
    setBottomScore, 
    // setIsReset,
    // isReset,
    isPaddlesReset, 
    setIsPaddlesReset,
    resetPaddles, 
    setResetPaddles,
  } = useContext(SceneContext);

  const ballRef = useRef();
  const topPaddleRef = useRef();
  const bottomPaddleRef = useRef();
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBall, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [resetBall, setResetBall] = useState(false);
  const [isBallReset, setIsBallReset] = useState(false);
  const [dont, setDont] = useState(false);

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
  }, []);

  useEffect(() => {
    if (resetBall) {
      console.log('stop ball');  
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      console.log('reset ball');
      ballRef.current.setTranslation(ballStartTranslation, true);
      setIsBallReset(true);
      setResetBall(false);
    }
  }, [resetBall]);

  useEffect(() => {
    if(isBallReset && isPaddlesReset) {
      console.log('paddles reset');  
      console.log('start ball');  
      if(!dont) {
        ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
      }
      setIsPlaying(true);
      setIsPaddlesReset(false);
      setIsBallReset(false);
    }
  }, [isBallReset, isPaddlesReset]);

  useEffect(() => {
    if(playing) {
      console.log("playing true");
      console.log(`resetPaddles: ${resetPaddles}`);
      console.log(`resetBall: ${resetBall}`);
      console.log(`playing: ${playing}`);
      setResetPaddles(true);
      setResetBall(true);
      setPlaying(false);
    } else {
      setIsPlaying(false);
    }
  }, [playing]);

  const handleTopGoalScored = useCallback(() => {
    console.log('handleTopGoalScored begin');  
    setBottomScore((prevScore) => prevScore + 1);
    setDont(true);
    setPlaying(true);
    console.log('handleTopGoalScored end');  
  }, []);

  const handleBottomGoalScored = useCallback(() => {
    console.log('handleBottomGoalScored begin');  
    setTopScore((prevScore) => prevScore + 1);
    setDont(true);
    setPlaying(true);
    console.log('handleBottomGoalScored end');  
    // checkLevel();
  }, []);

  // const checkLevel = () => {
  //   if (level == 3) {
  //     setLevelComplete(3); 

  //     if (bottomScore > topScore) {
  //       setCountdown(TEXT.human_wins);
  //     }

  //     if (bottomScore < topScore) {
  //       setCountdown(TEXT.tyler_wins);
  //     }

  //     if (bottomScore == topScore) {
  //       setCountdown(TEXT.draw);
  //     }      

  //   }
  // };
  
  const handleCollision = useCallback((event) => {
    const otherObject = event.rigidBody;
    const targetObject = event.target.rigidBody;

    if (otherObject.userData && otherObject.userData.isBall && 
      targetObject.userData && targetObject.userData.isPaddle) {

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
      <Gameboard 
        position={[0.0, 0.0, gameboardZ]} 
        args={[gameboardWidth, gameboardHeight]} 
        map={texture} 
      />

      <Goal 
        position={[0, gameboardHeight / 2 + ballRadius * 2, 0]} 
        args={[gameboardWidth, goalWidth, ballRadius * 5]} 
        onGoal={handleTopGoalScored} 
        // onProcess={reset} 
        // isReset={isReset}
      />

      <Goal 
        position={[0, -gameboardHeight / 2 - ballRadius * 2, 0]} 
        args={[gameboardWidth, goalWidth, ballRadius * 5]}
        onGoal={handleBottomGoalScored} 
        // onProcess={reset} 
        // isReset={isReset}
      />

      <Wall 
        position={[gameboardWidth / 2, 0, 0]} 
        args={[wallWidth, gameboardHeight]} 
      />

      <Wall 
        position={[-gameboardWidth / 2, 0, 0]} 
        args={[wallWidth, gameboardHeight]} 
      />

      <Paddle
        ref={topPaddleRef}
        isTop={true}
        position={[gameboardWidth / 2, gameboardHeight / 2 - paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(187,30,50)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={topPaddlePosition}
        handleCollision={handleCollision}
        // isReset={isReset}
      />

      <Paddle 
        ref={bottomPaddleRef}
        isTop={false}
        position={[gameboardWidth / 2, -gameboardHeight / 2 + paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(20,192,243)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={bottomPaddlePosition} 
        handleCollision={handleCollision}
        // isReset={isReset}
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