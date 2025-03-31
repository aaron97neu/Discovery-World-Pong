import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {GameSessionContext} from './GameSessionContext';
// import GamePlayStateMachine from './GamePlayStateMachine';
import {GamePlayContext} from './GamePlayContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';
import AudioPlayer from './AudioPlayer';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
// import Goal from './Goal';
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
const angles = [-60, -45, -30, 0, 0, 30, 45, 60]; // Bounce angles

function GamePlay() {

  const {
    level,
    // levelComplete,
    // setLevelComplete,
    // isGamePlaying,
    isLevelIntroComplete,
    isLevelComplete,
    setIsLevelComplete,
    isGameComplete,
  } = useContext(GameSessionContext);

  const {
    startLevel, setStartLevel,
    stopLevel, setStopLevel,
    // isPlaying, setIsPlaying,
    // startPlay, setStartPlay,
    // resetBoard, setResetBoard,
    // startCountdown, setStartCountdown,
    setCountdown,
    topScore, setTopScore,
    bottomScore, setBottomScore,
    topPaddlePosition, setTopPaddlePosition,
    topPaddleState, setTopPaddleState,
    bottomPaddlePosition, setBottomPaddlePosition,
    bottomPaddleState, setBottomPaddleState,
    setBallPosition,
    setIsPaddleHit,
    setResetPaddles,
    isCountdownComplete, setIsCountdownComplete,
    includeCountDown, setIncludeCountDown,
    isBallReset, setIsBallReset,
    // isTopPaddleReset, setIsTopPaddleReset,
    // isBottomPaddleReset, setIsBottomPaddleReset,
    // setPrevLevel,
    setStateMachine,
    setForcePaddleRerender,
    setForceBallRerender,
    setResetBall,
    isDontPlay, setIsDontPlay
  } = useContext(GamePlayContext);  
  
  // const fsmRef = useRef(null);
  const ballRef = useRef();

  const delay = 500;
  const speed = 200;

  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBallPosition, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [prevLevel, setPrevLevel] = useState(0);
  const [isLevelStarted, setIsLevelStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startPlay, setStartPlay] = useState(false);
  const [resetBoard, setResetBoard] = useState(false);
  const [isResettingBoard, setIsResettingBoard] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);

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

  useFrame(() => {
    // if (fsmRef.current) {
      if (startLevel) {
        console.log(`startLevel: ${level}`);
        setStartLevel(false); 
        setIsLevelStarted(true); 
        setResetBoard(true);
      }
      
      if (stopLevel) {
        console.log(`stopLevel: ${level}`);
        setStopLevel(false); 
        setIsPlaying(false);   
        setIsLevelStarted(false); 
        setResetBoard(true);
      }

      if(startCountdown) {
        setStartCountdown(false);  
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
                        // setIsCountdownComplete(true);   
                        // setResetBoard(true);  
                        setStartPlay(true);
                    }, delay); 
                }, delay); 
            }, delay);
        }, delay);
      }

      if(resetBoard) {
        console.log(`ResetBoard`);
        setResetBoard(false);
        setIsResettingBoard(true);
        setResetPaddles(true);
        setResetBall(true);
      }

      if(isResettingBoard) {
        // console.log(`topPaddleState: ${topPaddleState}`);
        // console.log(`bottomPaddleState: ${bottomPaddleState}`);
        // console.log(`isBallReset: ${isBallReset}`);
        if (topPaddleState == "reset" && bottomPaddleState == "reset" && isBallReset) {
          console.log(`BoardReset`);
          setIsResettingBoard(false);
          setTopPaddleState("play");
          setBottomPaddleState("play");
          setIsBallReset(false);
          setForceBallRerender(prevState => !prevState);
          setForcePaddleRerender(prevState => !prevState);
          setResetBoard(false);
          setIsResettingBoard(false);
          setResetPaddles(false);
          setResetBall(false);
          if(isLevelStarted) {
            if(isPlaying) {
              setStartPlay(true);
            } else {
              setStartCountdown(true);
            }
          }
        }
      }

      if(startPlay) {
        setStartPlay(false); 
        setIsPlaying(true);   
        ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
      }

      if(isPlaying) {
        if (ballRef && ballRef.current) {
          try {
            const currentPosition = ballRef.current.translation();

            if (currentPosition.y > 90) {
              if (audioPlayerRef.current) {
                audioPlayerRef.current.play('pointScore').catch((error) => {
                    console.error('Error playing audio:', error);
                });
              }
              setBottomScore((prev) => prev + 1);
            }

            if (currentPosition.y < -90) {
              if (audioPlayerRef.current) {
                audioPlayerRef.current.play('pointLose').catch((error) => {
                    console.error('Error playing audio:', error);
                });
              }
              setTopScore((prev) => prev + 1);
              if (level === 3) {
                // setLevelComplete(3);
                setStopLevel(true);
                setIsLevelComplete(true);
              }
            }
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
        }
      }

      if(isGameComplete) {
        if (bottomScore > topScore) {
          setCountdown(TEXT.human_wins);
        }
    
        if (bottomScore < topScore) {
            setCountdown(TEXT.tyler_wins);
        }
    
        if (bottomScore == topScore) {
            setCountdown(TEXT.draw);
        }
      }
    // }
  });
 
  // useEffect(() => {
  //   if (level != prevLevel) {
  //     setPrevLevel(level);
  //     switch (number) {
  //       case 1:
  //         fsmRef.current.startLevel1();
  //         break;
  //       case 2:
  //         fsmRef.current.startLevel2();
  //         break;
  //       case 3:
  //         fsmRef.current.startLevel3();
  //         break;
  //       case 3:
  //         fsmRef.current.endGame();
  //         break;
  //       default:
  //         console.log(`Invalid game level: ${level}`);
  //         break;
  //     }
  //   }
  // }, [level]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ballRef && ballRef.current) {
        try {
          const currentPosition = ballRef.current.translation();
          currentPosition.x = Math.round(currentPosition.x);
          currentPosition.y = Math.round(currentPosition.y);
          currentPosition.z = Math.round(currentPosition.z);

          if (currentPosition.x != oldBallPosition.x || 
            currentPosition.y != oldBallPosition.y) 
          {
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
  
  // Function to handle collision events using useCallback
  const handleCollision = useCallback((event) => {
    // Extract the rigid body of the colliding object and the target object from the event
    const otherObject = event.rigidBody;
    const targetObject = event.target.rigidBody;

    // Check if the colliding object is a ball and the target object is a paddle
    if (otherObject.userData && otherObject.userData.isBall && 
      targetObject.userData && targetObject.userData.isPaddle) {

      // Play an audio clip for the paddle hit using the audio player reference
      audioPlayerRef.current.play('paddleHit').catch((error) => {
        console.error('Error playing audio:', error);
      });

      // Calculate the collision point on the paddle
      const collisionPoint = event.manifold.localContactPoint1().x;
      const regionIndex = Math.min(7, Math.floor((collisionPoint + (paddleWidth / 2)) / 2.5))

      // Check if the region index is within the valid range of angles array
      if (regionIndex >= 0 && regionIndex < angles.length) {
        // Convert the angle to radians
        const radians = (angles[regionIndex] * (Math.PI / 180));
        // Calculate the new velocity for the ball based on the collision point and angle
        // Adjust y based on whether it's the top or bottom paddle
        const newVelocity = {
          x: speed * Math.sin(radians),
          y: speed * Math.cos(radians) * (targetObject.isTop ? -1 : 1), 
          z: 0,
        };   

        // Set the new linear velocity for the ball
        otherObject.setLinvel(newVelocity, true);
      }
    }
  }, []);

  return (
    // Goal component was an attempt to use Rapier sensor to register goal but
    // it was duplicating collisions.

    <group position={[0, 0, 0]} >
      {/* <GamePlayStateMachine ref={fsmRef} ballRef={ballRef} /> */}

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
        isTop={true}
        position={[0.0, gameboardHeight / 2 - paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(187,30,50)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={topPaddlePosition}
        handleCollision={handleCollision}
      />

      <Paddle 
        isTop={false}
        position={[0.0, -gameboardHeight / 2 + paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(20,192,243)" 
        gameboardWidth={gameboardWidth} 
        paddleWidth={paddleWidth} 
        paddlePosition={bottomPaddlePosition} 
        handleCollision={handleCollision}
      />

      <Ball 
        ballRef={ballRef}
        position={ballStartPosition} 
        args={[ballRadius, 64, 64]}  
        color="rgb(255,255,255)" 
      />
    </group>
  );
}

export default GamePlay;