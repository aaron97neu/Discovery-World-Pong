import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {GameContext} from './GameContext';
import {PlayContext, PlayState} from './PlayContext';
import * as IMAGES from './loadImages';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
import Goal from './Goal';
import Wall from './Wall';
import AudioPlayer from './AudioPlayer';
import * as TEXT from './loadText';

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
    isLevelPlaying,
    setLevelComplete,
  } = useContext(GameContext);

  const {
    level,
    setCountdown,
    topPaddlePosition,
    bottomPaddlePosition,
    setBallPosition, 
    isPaddlesReset,
    setIsPaddlesReset,
    setResetPaddles,
    topScore,
    setTopScore,
    bottomScore,
    setBottomScore,
    playState, 
    setPlayState,
  } = useContext(PlayContext);

  const ballRef = useRef();
  const topPaddleRef = useRef();
  const bottomPaddleRef = useRef();
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBall, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [isBallReset, setIsBallReset] = useState(false);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;
  const delay = 600;

  useEffect(() => {
    console.log("game constructor");
    setPlayState(PlayState.IDLE);
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
      audioPlayerRef.current.setVolume('paddleHit', audioVolume);
      audioPlayerRef.current.setVolume('pointScore', audioVolume);
      audioPlayerRef.current.setVolume('pointLose', audioVolume);
    }
  }, []);

  useEffect(() => {
    switch (playState) {
      case PlayState.IDLE:
        console.log('State: IDLE');
        setCountdown(TEXT.countdown_get_ready);
        setTimeout(() => {
        }, delay);
        break;
      case PlayState.COUNTDOWN:
        console.log('State: COUNTDOWN');
        // setIsCountdownComplete(false);
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
                // setPlayState(PlayState.PADDLE_RESET);        
              }, delay); 
            }, delay); 
          }, delay);
        }, delay);
        break;
      case PlayState.PADDLE_RESET:
        console.log('State: PADDLE_RESET ###############');
        // setIsPaddlesReset(false);
        setResetPaddles(true);
        break;
      case PlayState.RESET:
        console.log('State: RESET ###############');
        console.log(`bottomPaddlePosition: ${bottomPaddlePosition}`);
        // setResetPaddles(true);
        // setIsBallReset(false);
        if (ballRef.current) {
          ballRef.current.setTranslation(ballStartTranslation, true);
          // ballRef.current.setTranslation( {x: 0, y:-50, z: 0}, true); 
          ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          ballRef.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
          setTimeout(() => {
            setIsBallReset(true);
          }, 1000); 
        }
      break;    
      case PlayState.PLAY:
        console.log('State: PLAY');
        // setIsBallReset(false);
        ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
        break;
      case PlayState.TOP_GOAL:
        console.log('State: TOP_GOAL');
        if (audioPlayerRef.current) {
          audioPlayerRef.current.play('pointScore').catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
        setBottomScore((prev) => prev + 1);
        // setPlayState(PlayState.PADDLE_RESET);
        break;      
      case PlayState.BOTOM_GOAL:
        console.log('State: BOTOM_GOAL'); 
        if (audioPlayerRef.current) {
          audioPlayerRef.current.play('pointLose').catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
        setTopScore((prev) => prev + 1);
        // setPlayState(PlayState.PADDLE_RESET);
        if (level == 3) {
          // setPlayState(PlayState.IDLE);
          console.log(`topScore: ${topScore}`);
          console.log(`bottomScore: ${bottomScore}`);
          if (bottomScore > topScore) {
            setCountdown(TEXT.human_wins);
          }

          if (bottomScore < topScore) {
            setCountdown(TEXT.tyler_wins);
          }

          if (bottomScore == topScore) {
            setCountdown(TEXT.draw);
          }

          setLevelComplete(3);
        }
        break;
      default:
        break;
    }
  }, [playState]);

  // useFrame(() => {
  useEffect(() => {

    if (isLevelPlaying && playState == PlayState.IDLE) {
        // setPlayState(PlayState.COUNTDOWN);
      setPlayState(PlayState.PADDLE_RESET);
    }   

    if (!isLevelPlaying && playState != PlayState.IDLE) {
      setPlayState(PlayState.PADDLE_RESET);
    }  
    
    if (!isLevelPlaying && isBallReset && isPaddlesReset && playState == PlayState.RESET) {
      setPlayState(PlayState.IDLE);
    }  

    if (isCountdownComplete && playState == PlayState.COUNTDOWN) {
      // setPlayState(PlayState.PADDLE_RESET);
      setPlayState(PlayState.PLAY);
    }   

    if(isPaddlesReset && playState == PlayState.PADDLE_RESET) {
      console.log(`topPaddlePosition: ${topPaddlePosition}`);
      console.log(`bottomPaddlePosition: ${bottomPaddlePosition}`);
      console.log(`isBallReset: ${isBallReset}`);
      console.log(`isPaddlesReset: ${isPaddlesReset}`);

      setIsBallReset(false);
      setPlayState(PlayState.RESET);
    }

    // console.log(`isBallReset: ${isBallReset}`);
    // console.log(`isPaddlesReset: ${isPaddlesReset}`);
    if(isLevelPlaying && isBallReset && isPaddlesReset && playState == PlayState.RESET) {
      console.log(`bottomPaddlePosition: ${bottomPaddlePosition}`);
      console.log(`isBallReset: ${isBallReset}`);
      console.log(`isPaddlesReset: ${isPaddlesReset}`);

      // setPlayState(PlayState.PLAY);
      setIsCountdownComplete(false);
      setPlayState(PlayState.COUNTDOWN);
    }

    if (isLevelPlaying && (playState == PlayState.TOP_GOAL || playState == PlayState.BOTOM_GOAL)) {
      // setPlayState(PlayState.COUNTDOWN);
      setPlayState(PlayState.PADDLE_RESET);
    }

    if (ballRef && ballRef.current) {
      if (playState == PlayState.PLAY) {
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
  });

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