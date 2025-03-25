import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {GameContext} from './GameContext';
import {PlayContext} from './PlayContext';
import * as IMAGES from './loadImages';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
// import Goal from './Goal';
import Wall from './Wall';
import AudioPlayer from './AudioPlayer';
import PlayStateMachine from './PlayStateMachine';
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
const angles = [-60, -45, -30, 0, 0, 30, 45, 60]; // Bounce angles

function Game() {

  const {
    level,
    levelComplete,
    setLevelComplete,
    isGamePlaying,
  } = useContext(GameContext);

  const {
    setCountdown,
    topScore, setTopScore,
    bottomScore, setBottomScore,
    topPaddlePosition, setTopPaddlePosition,
    topPaddleState, setTopPaddleState,
    bottomPaddlePosition, setBottomPaddlePosition,
    bottomPaddleState, setBottomPaddleState,
    setBallPosition,
    setIsPaddleHit,
    setIsPlaying,
    setResetPaddles,
    isCountdownComplete, setIsCountdownComplete,
    includeCountDown, setIncludeCountDown,
    // isBallReset, setIsBallReset,
    // isTopPaddleReset, setIsTopPaddleReset,
    // isBottomPaddleReset, setIsBottomPaddleReset,
    setPrevLevel,
    setStateMachine,
    setForcePaddleRerender,
    setForceBallRerender,
    setResetBall,
    isDontPlay, setIsDontPlay
  } = useContext(PlayContext);  
  
  const fsmRef = useRef(null);
  const ballRef = useRef();

  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBallPosition, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;

  useEffect(() => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
      audioPlayerRef.current.setVolume('paddleHit', audioVolume);
    }
  }, []);

  useFrame(() => {
    if (fsmRef.current) {

      if(fsmRef.current.state === 'gameStarted') {
        setCountdown(TEXT.blank);
        setTopScore(0);
        setBottomScore(0);
        setTopPaddlePosition(0.5);
        setTopPaddleState("not_ready");
        setBottomPaddlePosition(0.5);
        setBottomPaddleState("not_ready");
        setBallPosition({x: 0.0, y: 0.0});
        setIsPaddleHit(false);
        setIsPlaying(false);
        setResetPaddles(false);
        setIsCountdownComplete(false);
        setIncludeCountDown(true);
        // setIsBallReset(false);
        // setIsTopPaddleReset(false);
        // setIsBottomPaddleReset(false);
        setPrevLevel(0);
        setStateMachine(null);
        setForcePaddleRerender(false);
        setForceBallRerender(false);
        setResetBall(false);
        setIsDontPlay(true);

        fsmRef.current.startGame();
      }
      
      if(fsmRef.current.state === 'idle') {
        fsmRef.current.resetPaddle();
      }

      if(fsmRef.current.state === 'levelReset') {
        fsmRef.current.startLevel();
      }

      if(fsmRef.current.state === 'paddleReset') {
        if (topPaddleState == "reset" && bottomPaddleState == "reset") {
          fsmRef.current.resetBall();
        }
      }

      if(fsmRef.current.state === 'ballReset') {
        if(isBallReset) {
          fsmRef.current.resetGame();
        }
      }

      if(fsmRef.current.state === 'gameReset') {
        if (levelComplete === 3) {
          fsmRef.current.endGame();
        } else {
          if (!isDontPlay) {
            if (includeCountDown) {
              fsmRef.current.startCountdown();
            } else {
              fsmRef.current.beginPlay();
            }
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

        if (level === 3) {
          setLevelComplete(3);
        }
      }

      if(fsmRef.current.state === 'gameFinished') {
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
    }

  });

  useEffect(() => {
    if (level === 4) {
      fsmRef.current.endGame();
    } else {
      if (level > 0) {
        fsmRef.current.resetLevel();
      }
    }
  }, [level]);

  useEffect(() => {
      if (levelComplete > 0) {
        fsmRef.current.endLevel();
      }
  }, [levelComplete]);

  useEffect(() => {
    if (isGamePlaying === false) {
      fsmRef.current.returnToIdle();
    }    
  }, [isGamePlaying]);
 
  // useEffect(() => {
  //   if (bottomPaddleState == "reset") {
  //     setIsBottomPaddleReset(true);
  //   }
  // }, [bottomPaddleState]);

  // useEffect(() => {
  //   if (topPaddleState == "reset") {
  //     setIsTopPaddleReset(true);
  //   }
  // }, [topPaddleState]);

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

export default Game;