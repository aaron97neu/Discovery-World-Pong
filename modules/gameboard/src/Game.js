import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';
import Gameboard from './Gameboard';
import Ball from './Ball';
import Paddle from './Paddle';
import Goal from './Goal';
import Wall from './Wall';

function Game() {
  const {
    setTopPaddlePosition,
    topPaddlePosition, 
    bottomPaddlePosition,
    setBottomPaddlePosition, 
    setBallPosition, 
    isPlaying, 
    setIsPlaying,
    topScore, 
    setTopScore,
    bottomScore, 
    setBottomScore, 
    level,
    setLevelComplete,
    setCountdown
  } = useContext(SceneContext);

  const groupRef = useRef();
  const ballRef = useRef();
  const topPaddleRef = useRef();
  const bottomPaddleRef = useRef();
  const [oldBall, setOldBallPosition] = useState({x: 0.0, y: 0.0, z: 0.0});
  const [isReset, setIsReset] = useState(false);

  const speed = 200;
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);
  const gameboardY = 160; // height used in AI 
  const gameboardX = 192; // width used in AI
  const gameboardZ = -3.0;
  const paddleX = 20;
  const paddleY = 3.0;
  const paddlePadding = 3.0
  const ballRadius = 4.0;
  const wallX = 1.0;
  const goalY = 0.1;
  const ballStartPositionY = -(gameboardY / 2) + 10;
  const ballStartTranslation = {x: 0, y: -(gameboardY / 2) + 10, z: 0};

  useEffect(() => {
      if (ballRef && ballRef.current) {
      if (isReset) {
        console.log("reset2222");
        // const currentPosition1 = ballRef.current.translation();
        // console.log(`translation: ${JSON.stringify(currentPosition1, null, 2)}`);
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        ballRef.current.setTranslation(ballStartTranslation, true);
        // const currentPosition2 = ballRef.current.translation();
        // console.log(`translation: ${JSON.stringify(currentPosition2, null, 2)}`);
      }
      // if(isPlaying && !isReset) {
      if(!isReset && isPlaying) {
        console.log("isPlaying2");
        ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
      }

      if(!isPlaying) {
        console.log("!isPlaying");

        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        ballRef.current.setTranslation(ballStartTranslation, true);
        setTopPaddlePosition(0.5);
        setBottomPaddlePosition(0.5);
      }
    } 
  }, [ballRef, isReset, isPlaying]);

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
            // const newPosition = { x: currentX, y: currentY, z: currentZ };
            // console.log(`currentPosition: ${JSON.stringify(currentPosition, null, 2)}`);
            // console.log(`newPosition: ${JSON.stringify(newPosition, null, 2)}`);
            setBallPosition(currentPosition);
            setOldBallPosition(currentPosition);
          }
        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }      
    }, 100);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [ballRef]);

  const handleTopGoalScored = useCallback(() => {
    setBottomScore(bottomScore + 1);
  }, [bottomScore]);

  const handleBottomGoalScored = useCallback(() => {
    setTopScore(topScore + 1);  
    if (level == 3) {
      console.log(`level3: ${level}`);
      setIsPlaying(false);
      setLevelComplete(3); 

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
  }, [topScore, bottomScore, level]);
  
  const reset = useCallback(() => {
    setIsReset(true);
    setTopPaddlePosition(0.5);
    setBottomPaddlePosition(0.5);
    setTimeout(() => setIsReset(false), 1000); 
  }, []);

  return (
    <group position={[0, 0, 0]} ref={groupRef}>
     <Gameboard position={[0.0, 0.0, gameboardZ]} args={[gameboardX, gameboardY]} map={texture} />

     <Goal 
        position={[0, gameboardY / 2 + ballRadius * 2, 0]} 
        args={[gameboardX, goalY, ballRadius * 2]} 
        onGoal={handleTopGoalScored} 
        onProcess={reset} 
        isReset={isReset}
      />

      <Goal 
        position={[0, -gameboardY / 2 - ballRadius * 2, 0]} 
        args={[gameboardX, goalY, ballRadius * 2]}
        onGoal={handleBottomGoalScored} 
        onProcess={reset} 
        isReset={isReset}
      />

      <Wall position={[gameboardX / 2, 0, 0]} 
            args={[wallX, gameboardY]} />

      <Wall position={[-gameboardX / 2, 0, 0]} 
            args={[wallX, gameboardY]} />

      <Paddle paddleRef={topPaddleRef}
              color="rgb(187,30,50)" 
              position={[gameboardX / 2, gameboardY / 2 - paddlePadding, 0.0]} 
              gameboardWidth={gameboardX} 
              paddleWidth={paddleX} 
              args={[paddleX, paddleY]} 
              isTop={true} 
              paddlePosition={topPaddlePosition} 
              speed={speed} 
              isReset={isReset}
              />

      <Paddle paddleRef={bottomPaddleRef}
              color="rgb(20,192,243)" 
              position={[-gameboardX / 2, -gameboardY / 2 + paddlePadding, 0.0]} 
              gameboardWidth={gameboardX} 
              paddleWidth={paddleX} 
              args={[paddleX, paddleY]} 
              isTop={false} 
              paddlePosition={bottomPaddlePosition} 
              speed={speed}
              isReset={isReset}
              />

            <Ball ballRef={ballRef}  
              color="rgb(255,255,255)" 
              position={[0, ballStartPositionY, 0]} 
              args={[ballRadius, 64, 64]}  />
    </group>
  );
}

export default Game;