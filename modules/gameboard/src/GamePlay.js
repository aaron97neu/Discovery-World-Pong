import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PongAPI } from 'dw-state-machine';
import {useGameContext} from './GameContext';
// import GamePlayStateMachine from './GamePlayStateMachine';
import {useGamePlayContext} from './GamePlayContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';
import AudioPlayer from './AudioPlayer';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
import Goal from './Goal';
import Wall from './Wall';
import GamePlayStateMachine from './GamePlayStateMachine';

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
const resetBallPosition = {x: 0, y: -(160 / 2) + 10, z: 0};

function GamePlay() {

  const {
    pongAPI,
    gamePlayStateMachine,
  } = useGameContext();

  const {
    level,
    setCountdown,
    topPaddlePosition, setTopPaddlePosition,
    bottomPaddlePosition, setBottomPaddlePosition,
    topScore,
    setTopScore,
    bottomScore,
    setBottomScore,
    isCountdownComplete,
    setIsCountdownComplete,
    isNoCountdownComplete,
    setIsNoCountdownComplete,        
    isTopPaddleReset,
    setIsTopPaddleReset,
    isBottomPaddleReset,
    setIsBottomPaddleReset,
    isBallReset,
    setIsBallReset,
    isCollidersEnabled,
    setIsCollidersEnabled,
    setResetBall,
    // startBall,
    // setStartBall,
    setForceBallRerender,
    setForcePaddleRerender,
  } = useGamePlayContext();  
  
  const [gameStarted, setGameStarted] = useState(false);
  const [levelReset, setLevelReset] = useState(false);
  const [playReset, setPlayReset] = useState(false);
  const [countdown1, setCountdown1] = useState(false);
  const [noCountdown, setNoCountdown] = useState(false);
  const [play, setPlay] = useState(false);


  const [newScore, setNewScore] = useState(false);


  const fsmRef = useRef(null);
  const ballRef = useRef();
  const topPaddleRef = useRef();
  const bottomPaddleRef = useRef();

  const delay = 500;
  const speed = 200;
  const max = (gameboardWidth - paddleWidth) / 2;
  const min = -max;

  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);

  const [prevBallPosition, setPrevBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [ballExists, setBallExists] = useState(true);
  const [bounceCount, setBounceCount] = useState(0);

  const audioPlayerRef = useRef(null);
  const audioVolume = 0.5;

  useEffect(() => {
    if (pongAPI) {
      pongAPI.registerObserver(
        PongAPI.Topics.PADDLE_TOP_POSITION, 
        onPaddleTopPosition
      );

      pongAPI.registerObserver(
        PongAPI.Topics.PADDLE_BOTTOM_POSITION, 
        onPaddleBottomPosition
      );

      pongAPI.registerObserver(
        PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, 
        onPaddleTopStateTransition
      );

      pongAPI.registerObserver(
        PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, 
        onPaddleBottomStateTransition
      );      
    }

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioPlayer();
      audioPlayerRef.current.setVolume('paddleHit', audioVolume);
      audioPlayerRef.current.setVolume('pointScore', audioVolume);
      audioPlayerRef.current.setVolume('pointLose', audioVolume);

    }
  }, []);

  useFrame(() => {
    if (gamePlayStateMachine 
      && ballRef 
      && ballRef.current 
      && pongAPI 
      &&  pongAPI.isConnected()) {

        switch (gamePlayStateMachine.state) {
          case "gameStarted":
            if (!gameStarted) {
              console.log("State: gameStarted");
              setGameStarted(true);
            }
            break;            
          case "levelReset":
            if (!levelReset) {
              console.log("State: levelReset");
              setLevelReset(true);

              setIsTopPaddleReset(false);                 
              setIsBottomPaddleReset(false);                 
              setIsBallReset(false);
              setIsCollidersEnabled(false);
              setIsCountdownComplete(false);
    
              // ballRef.current.setTranslation(resetBallPosition, true);
              // ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
              // ballRef.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);

              const message =  { "transition": "reset" };
              pongAPI.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
              pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message ); 
            } else {
              if (isTopPaddleReset
              && isBottomPaddleReset
              && isBallReset) {
                console.log("test1");
                setIsCollidersEnabled(true);
                gamePlayStateMachine.startCountdown();

                setLevelReset(false);
              } else {
                console.log("test2");
                setIsBallReset(true);

                // console.log(`ballRef: ${JSON.stringify(ballRef, null, 2)}`);
                // console.log(`ballRef.current: ${JSON.stringify(ballRef.current, null, 2)}`);

                // const ballPosition = ballRef.current.translation();                
                // if (ballPosition.x === resetBallPosition.x
                // && ballPosition.y === resetBallPosition.y
                // && ballPosition.z === resetBallPosition.z) {
                //   console.log("my test");
                //   setIsBallReset(true);
                // }      
              }
            }
            break;
          case "playReset":
            if (!playReset) {
              console.log("State: playReset");
              setPlayReset(true);

              setIsTopPaddleReset(false);                 
              setIsBottomPaddleReset(false);                 
              setIsBallReset(false);
              setIsCollidersEnabled(false);
              setIsNoCountdownComplete(false);
    
              const message =  { "transition": "reset" };
              pongAPI.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
              pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message ); 
            } else {
              if (isTopPaddleReset
                && isBottomPaddleReset
                && isBallReset) {
                  setIsCollidersEnabled(true);
                  gamePlayStateMachine.startNoCountdown();

                  setPlayReset(false);
                } else {
                  setIsBallReset(true);
                }
            }
            break;
          case "countdown":
            if (!countdown1) {
              console.log("State: countdown");
              setCountdown1(true);

              setCountdown(TEXT.countdown_three);
              setTimeout(() => {
                  setCountdown(TEXT.countdown_two);
                  setTimeout(() => {
                      setCountdown(TEXT.countdown_one);
                      setTimeout(() => {
                          setCountdown(TEXT.countdown_go);
                          setTimeout(() => {
                              setCountdown(TEXT.blank);
                              setIsCollidersEnabled(true);    
                              console.log("begin");     
                              gamePlayStateMachine.startPlay();
                              console.log("end");     

                              setCountdown1(false);
                            }, delay); 
                      }, delay); 
                  }, delay);
              }, delay);
            }
            break;
          case "noCountdown":
            if (!noCountdown) {
              console.log("State: noCountdown");
              setNoCountdown(true);

              setTimeout(() => {
                setIsCollidersEnabled(true);
                gamePlayStateMachine.startPlay();

                setNoCountdown(false);
              }, 2000); 
            }
            break;
          case "play":
            if (!play) {
              console.log("State: play");
              setPlay(true);

              ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);  
            } else {
              try {
                const ballPosition = ballRef.current.translation();
                ballPosition.x = Math.round(ballPosition.x);
                ballPosition.y = Math.round(ballPosition.y);
                ballPosition.z = Math.round(ballPosition.z);
    
                if (ballPosition.x != prevBallPosition.x || 
                  ballPosition.y != prevBallPosition.y) 
                {
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
            
                  pongAPI.update(PongAPI.Topics.GAME_PLAY, message );
                }
    
                if (ballPosition.y > 90) {
                  // if (audioPlayerRef.current) {
                  //   audioPlayerRef.current.play('pointScore').catch((error) => {
                  //       console.error('Error playing audio:', error);
                  //   });
                  // }

                  setNewScore(true);
                  setBottomScore((prev) => prev + 1);
                  gamePlayStateMachine.startPlayReset();

                  setPlay(false);
                }
    
                if (ballPosition.y < -90) {
                  // if (audioPlayerRef.current) {
                  //   audioPlayerRef.current.play('pointLose').catch((error) => {
                  //       console.error('Error playing audio:', error);
                  //   });
                  // }
        
                  if (level === 3) {
                    gamePlayStateMachine.endGame();

                    setPlay(false);
                  } else {
                    setNewScore(true);

                    setTopScore((prev) => prev + 1);

                    gamePlayStateMachine.startPlayReset();
  
                    setPlay(false);
                  }
                }
              } catch (error) {
                console.log(`Error: ${error.message}`);
              }               
            }
            break;
          default:
            console.log("Unknown state");
        }
    }

    if (topPaddleRef.current) {
      const xfactor = ((topPaddlePosition - 0.5) * (gameboardWidth - paddleWidth));

      const newPositionX = Math.round(Math.max(min, Math.min(max, xfactor)) * 100) / 100;
      const currentPosition = topPaddleRef.current.translation();
      topPaddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
    }

    if (bottomPaddleRef.current) {
      const xfactor = ((bottomPaddlePosition - 0.5) * (gameboardWidth - paddleWidth));

      const newPositionX = Math.round(Math.max(min, Math.min(max, xfactor)) * 100) / 100;
      const currentPosition = bottomPaddleRef.current.translation();
      bottomPaddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
    }   

  });
  
  const onPaddleTopStateTransition = (message) => {
    const paddleStateTransition = message.transition;
   
    if (paddleStateTransition == "reset") {
      setIsTopPaddleReset(true);
    }     
  }

  const onPaddleBottomStateTransition = (message) => {
    const paddleStateTransition = message.transition;

    if (paddleStateTransition == "reset") {
      setIsBottomPaddleReset(true);
    }     
  } 

  const onPaddleTopPosition = (message) => {
    const paddlePosition = message.position.x;
    setTopPaddlePosition(paddlePosition);   
  }

  const onPaddleBottomPosition = (message) => {
      const paddlePosition = message.position.x;
      setBottomPaddlePosition(paddlePosition);        
  }  

  // Function to handle collision events using useCallback
  const handleCollision = useCallback((event) => {
    console.log("handleCollision");
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

        // console.log("ballRef.current before setLinvel:", JSON.stringify(newVelocity, null, 2));
        // Set the new linear velocity for the ball   
        otherObject.setLinvel(newVelocity, true);
      }
    }
  }, []);

  return (
    // Goal component was an attempt to use Rapier sensor to register goal but
    // it was duplicating collisions.

    <group position={[0, 0, 0]} >
      <GamePlayStateMachine />

      <Gameboard 
        position={[0.0, 0.0, gameboardZ]} 
        args={[gameboardWidth, gameboardHeight]} 
        map={texture} 
      />

      {/* <Goal 
        position={[0, gameboardHeight / 2 + ballRadius * 2, 0]} 
        args={[gameboardWidth, goalWidth, ballRadius * 5]} 
        onGoal={handleTopGoal} 
      />

      <Goal 
        position={[0, -gameboardHeight / 2 - ballRadius * 2, 0]} 
        args={[gameboardWidth, goalWidth, ballRadius * 5]}
        onGoal={handleBottomGoal} 
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
        paddleRef={topPaddleRef}
        isTop={true}
        position={[0.0, gameboardHeight / 2 - paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(187,30,50)" 
        handleCollision={handleCollision}
      />

      <Paddle 
        paddleRef={bottomPaddleRef}
        isTop={false}
        position={[0.0, -gameboardHeight / 2 + paddlePadding, 0.0]} 
        args={[paddleWidth, paddleHeigth]} 
        color="rgb(20,192,243)" 
        handleCollision={handleCollision}
      />

      {isBallReset && (
      <Ball 
      ballRef={ballRef}
      position={ballStartPosition} 
      args={[ballRadius, 64, 64]}  
      color="rgb(255,255,255)" 
      />
      )}

    </group>
  );
}

export default GamePlay;