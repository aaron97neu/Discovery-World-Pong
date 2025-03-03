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
import PlayStateMachine from './PlayStateMachine';
import * as TEXT from './loadText';
import { useRapier } from '@react-three/rapier';

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
// const regionSize = paddleWidth / 8;

function Game() {

  const {
    level,
    levelComplete,
    setLevelComplete,
    isGamePlaying,
    isGameComplete,
    setIsGameComplete,
  } = useContext(GameContext);

  const {
    countdown, setCountdown,
    topScore, setTopScore,
    bottomScore, setBottomScore,
    topPaddlePosition, setTopPaddlePosition,
    topPaddleState, setTopPaddleState,
    bottomPaddlePosition, setBottomPaddlePosition,
    bottomPaddleState, setBottomPaddleState,
    ballPosition, setBallPosition,
    isPaddleHit, setIsPaddleHit,
    isPlaying, setIsPlaying,
    resetPaddles, setResetPaddles,
    isCountdownComplete, setIsCountdownComplete,
    includeCountDown, setIncludeCountDown,
    isBallReset, setIsBallReset,
    isTopPaddleReset, setIsTopPaddleReset,
    isBottomPaddleReset, setIsBottomPaddleReset,
    prevLevel, setPrevLevel,
    stateMachine, setStateMachine,
    // forcePaddleRerender, setForcePaddleRerender,
    // forceBallRerender, setForceBallRerender,
    resetBall, setResetBall,
    isDontPlay, setIsDontPlay,
    isLevelComplete, setIsLevlComplete,
    isScoreComplete, setIsScoreComplete,
  } = useContext(PlayContext);  
  
  const fsmRef = useRef(null);
  const ballRef = useRef();

  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [oldBallPosition, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;

  const { world, setWorld, rapier } = useRapier();
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (world) {
      console.log("takeSnapshot $$$$$$$$$$$$$$$$$$$");

      // rapier.reset();
      setSnapshot(world.takeSnapshot());
      // You can now interact with the Rapier object and world
      // For example, accessing Rapier classes or methods
    }
  }, []);

  useEffect(() => {

    if (world) {
      if (isGameComplete, isLevelComplete, isScoreComplete) {
        console.log("restoreSnapshot @@@@@@@@@@@@@@@@@@@@@@@@");
        setWorld(rapier.World.restoreSnapshot(snapshot))
      }
    }
  }, [isGameComplete, isLevelComplete, isScoreComplete ]);

  // useEffect(() => {
  //   if (rapier && world) {
  //     console.log('Rapier object:', rapier);
  //     console.log('Rapier world:', world);
  //     // rapier.reset();
  //     setSnapshot(world.takeSnapshot());
  //     // You can now interact with the Rapier object and world
  //     // For example, accessing Rapier classes or methods
  //   }
  // }, [rapier, world]);

  // useEffect(() => {

  //     if (isGameComplete) {
  //       console.log("game complete @@@@@@@@@@@@@@@@@@@@@@@@");
  //       // world.restoreSnapshot(snapshot);
  //       setWorld(rapier.World.restoreSnapshot(snapshot))
  //     }
  // }, [isGameComplete, world]);

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
  setIsBallReset(false);
  setIsTopPaddleReset(false);
  setIsBottomPaddleReset(false);
  setPrevLevel(0);
  setStateMachine(null);
  // setForcePaddleRerender(false);
  // setForceBallRerender(false);
  setResetBall(false);
  setIsDontPlay(true);
  setIsLevlComplete(false);
  setIsScoreComplete(false);

        fsmRef.current.startGame();
      }
      
      if(fsmRef.current.state === 'idle') {
        fsmRef.current.resetPaddle();
      }

      if(fsmRef.current.state === 'levelReset') {
        fsmRef.current.startLevel();
      }

      if(fsmRef.current.state === 'paddleReset') {
        if (isTopPaddleReset && isBottomPaddleReset) {
          fsmRef.current.resetBall();
          // setForcePaddleRerender(prevState => !prevState);
        }
      }

      if(fsmRef.current.state === 'ballReset') {
        if(isBallReset) {
          fsmRef.current.resetGame();
          // setForceBallRerender(prevState => !prevState);
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
        setIsScoreComplete(false);
      }

      if(fsmRef.current.state === 'bottomGoal') {
        fsmRef.current.resetPaddle();
        setIsScoreComplete(false);

        if (level == 3) {
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

        setIsGameComplete(true);
      }

      // if (!isGamePlaying) {
      //   console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%");
      //   fsmRef.current.returnToIdle();
      // }
    }

  });

  useEffect(() => {
      if (level > 0) {
        fsmRef.current.resetLevel();
        setIsLevlComplete(false);
      }
  }, [level]);

  useEffect(() => {
    if (levelComplete === 3) {
      fsmRef.current.endGame();
    } else {
      if (levelComplete > 0) {
        fsmRef.current.endLevel();
      }
    }    
  }, [levelComplete]);

  useEffect(() => {
    if (isGamePlaying === false) {
      fsmRef.current.returnToIdle();
    }    
  }, [isGamePlaying]);
 
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

      // audioPlayerRef.stop('paddleHit');
      audioPlayerRef.current.play('paddleHit').catch((error) => {
        console.error('Error playing audio:', error);
      });

      console.log(`ballCurrentPostion: ${otherObject.translation().x}`);
      console.log(`paddleCurrentPostion: ${targetObject.translation().x}`);
      const collisionPoint = event.manifold.localContactPoint1().x;
      console.log(`collisionPoint: ${collisionPoint}`);
      const d = (collisionPoint + (paddleWidth / 2));
      const regionIndex = Math.min(7, Math.floor((collisionPoint + (paddleWidth / 2)) / 2.5))
      console.log(`regionIndex: ${regionIndex}`);

      if (regionIndex >= 0 && regionIndex < angles.length) {
        const radians = (angles[regionIndex] * (Math.PI / 180)); // Convert angle to radians
        const newVelocity = {
          x: speed * Math.sin(radians),
          y: speed * Math.cos(radians) * (targetObject.isTop ? -1 : 1), // Adjust y based on whether it's the top or bottom paddle
          z: 0,
        };   

        console.log(`newVelocity: ${JSON.stringify(newVelocity, null, 2)}`);
        otherObject.setLinvel(newVelocity, true);
      }
    }
  }, []);

  return (
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