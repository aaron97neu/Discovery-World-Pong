import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
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
    isLevelPlaying,
    isPaddlesReset,
    setResetPaddles,
    setTopScore,
    setBottomScore,
  } = useContext(SceneContext);

  const ballRef = useRef();
  const topPaddleRef = useRef();
  const bottomPaddleRef = useRef();
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBall, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [startPlay, setStartPlay] = useState(false);
  const [startReset, setStartReset] = useState(false);
  const [resetBall, setResetBall] = useState(false);
  const [isBallReset, setIsBallReset] = useState(false);
   const [isTopGoal, setIsTopGoal] = useState(false);
  const [isBottomGoal, setIsBottomGoal] = useState(false);
  
  useEffect(() => {
    if (startReset) {
      console.log('start reset');
      setStartPlay(false);
      setIsBallReset(false);
      setResetPaddles(true);
      setResetBall(true);
    }
  }, [startReset]);

  useEffect(() => {
    if (ballRef.current && resetBall) {
      console.log('reset ball');
      // ballRef.current.setTranslation(ballStartTranslation, true);
      ballRef.current.setTranslation( {x: 0, y:-50, z: 0}, true); 
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      ballRef.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
      setTimeout(() => {
        setIsBallReset(true);
      }, 2000); 
    }
  }, [resetBall]);

  useEffect(() => {
    console.log(`isBallReset: ${isBallReset}`);
    console.log(`isPaddlesReset: ${isPaddlesReset}`);
    if(isBallReset && isPaddlesReset) {
      setStartReset(false);
      setIsBallReset(false);
      setResetPaddles(false);
      setResetBall(false);
      console.log(`startPlay: ${startPlay}`);
      setStartPlay(true);
      console.log('reset end');
    }
  }, [isBallReset, isPaddlesReset]);

  useEffect(() => {
    if (ballRef.current && startPlay) {
      console.log('start play');
      setIsTopGoal(false);
      setIsBottomGoal(false);
      ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
      
      const currentPosition = ballRef.current.translation();
      console.log(`currentPosition: ${JSON.stringify(currentPosition, null, 2)}`);
    }
  }, [startPlay]);

  useEffect(() => {
    if(isTopGoal) {
      console.log("shotandagoal top !!!!!!!!!!!");
      console.log(`startReset: ${startReset}`);
      setStartReset(true);
      // setBottomScore((prevScore) => prevScore + 1);
    }
  }, [isTopGoal]);  
  
  useEffect(() => {
    if(isBottomGoal) {    
      console.log("shotandagoal bottom !!!!!!!!!!!!");
      setStartReset(true);
      // setTopScore((prevScore) => prevScore + 1);
    }
  }, [isBottomGoal]);

  useEffect(() => {
    if (isLevelPlaying) {
      console.log(`isLevelPlaying: ${isLevelPlaying}`);
      setStartPlay(false);
      setStartReset(true);
    }
  }, [isLevelPlaying]);

// ***********************************************

  useEffect(() => {
    if (ballRef && ballRef.current && !isTopGoal && !isBottomGoal) {
      try {
        const currentPosition = ballRef.current.translation();

        if (currentPosition.y > 90) {
          setIsTopGoal(true);
        }

        if (currentPosition.y < -90) {
          setIsBottomGoal(true);
        }
              } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  });

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
        // console.log(handleCollision);
        otherObject.setLinvel(newVelocity, true);
      }
    }
  }, []);

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

  // const handleTopGoalScored = useCallback(() => {
  //   console.log('handleTopGoalScored begin');  
  //   setBottomScore((prevScore) => prevScore + 1);
  //   // setDont(true);
  //   setPlaying(true);
  //   console.log('handleTopGoalScored end');  
  // }, []);

  // const handleBottomGoalScored = useCallback(() => {
  //   console.log('handleBottomGoalScored begin');  
  //   setTopScore((prevScore) => prevScore + 1);
  //   // setDont(true);
  //   setPlaying(true);
  //   console.log('handleBottomGoalScored end');  
  //   // checkLevel();
  // }, []);

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
        ref={topPaddleRef}
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
        ref={bottomPaddleRef}
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