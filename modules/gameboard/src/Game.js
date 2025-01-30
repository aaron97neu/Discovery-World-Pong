import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';

function Ball({ position, args, ballRef, speed }) {

  useEffect(() => {
    if (ballRef.current) {
      console.log(`############## Ball useEffect`); 

      const currentPosition = ballRef.current.translation();
      console.log(`currentPosition: ${JSON.stringify(currentPosition, null, 2)}`);
    }
  }, [speed, ballRef]);

  useFrame(() => {
    if (ballRef.current) {
      const linvel = ballRef.current.linvel();
      const currentSpeed = Math.sqrt(linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2);
      if (currentSpeed > 0) {
        const scalingFactor = speed / currentSpeed;
        ballRef.current.setLinvel({
          x: linvel.x * scalingFactor,
          y: linvel.y * scalingFactor,
          z: linvel.z * scalingFactor,
        });
      }
    }
  });

  return (
    <RigidBody ref={ballRef} position={position} colliders="ball" userData={{ isBall: true }}>
      <mesh >
        <sphereGeometry args={args}  />
        {/* <circleGeometry args={[3.0, 64]} /> */}
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
}

function Paddle({ position, args, gameboardWidth, paddleWidth, isTop, positionX, color, speed }) {
  const paddleRef = useRef();
  const angles = [-60, -45, -30, 0, 0, 30, 45, 60]; // Bounce angles
  const regionSize = paddleWidth / 8;

  useEffect(() => {
    console.log(`x: ${positionX}`);
    if (paddleRef.current) {
      const max = (gameboardWidth - paddleWidth) / 2;
      const min = -max;
      const xfactor = ((positionX - 0.5) * (gameboardWidth - paddleWidth));

      const newPositionX = Math.max(min, Math.min(max, xfactor));
      const currentPosition = paddleRef.current.translation();
      paddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z });
    }
  }, [gameboardWidth, paddleWidth, positionX]);

  const handleCollision = (event) => {
    const otherObject = event.rigidBody;
    if (otherObject.userData && otherObject.userData.isBall) {
      const collisionPoint = Math.round(event.manifold.localContactPoint1().x);
      const regionIndex = Math.round(collisionPoint / regionSize + 4);

      if (regionIndex >= 0 && regionIndex < angles.length) {

        const angle = (angles[regionIndex] * (Math.PI / 180)); // Convert angle to radians
        const newVelocity = {
          x: speed * Math.sin(angle),
          y: speed * Math.cos(angle) * (isTop ? -1 : 1), // Adjust y based on whether it's the top or bottom paddle
          z: 0,
        };
        otherObject.setLinvel(newVelocity);
      }
    }
  };

  return (
    <RigidBody ref={paddleRef} position={position} type="fixed" colliders="cuboid" onCollisionEnter={handleCollision} userData={{ isPaddle: true }} >
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}

function Wall({ position, args }) {
  return (
    <RigidBody type="fixed" position={position} colliders="cuboid" restitution={1}>
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color="red" transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  );
}

function Goal({ position, args, onGoal }) {
  const handleGoal = (event) => {
    const otherObject = event.rigidBody;
    if (otherObject.userData && otherObject.userData.isBall) {
      console.log('Goal scored!');
      // Reset ball position or handle goal logic here
    }
  };

  return (
    <RigidBody position={position} type="fixed" colliders="cuboid" onIntersectionEnter={handleGoal} sensor userData={{ isGoal: true }}>
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color="green" transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  );
}

function Gameboard( {position, args, map} ) {

  return (
     <mesh position={position}>
       <planeGeometry attach="geometry" args={args} />
       <meshBasicMaterial attach="material" map={map} transparent opacity={1.0} />
     </mesh>
  );
}

function Game() {
  const {topPaddlePosition, bottomPaddlePosition, setBallPosition} = useContext(SceneContext);
  const groupRef = useRef();
  const ballRef = useRef();
  const [oldBall, setOldBall] = useState({x: 0.0, y: 0.0, z: 0.0});

  const speed = 40;
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);
  // const aspectRatio = texture.image.width / texture.image.height;
  // const scale = 24.0;
  // const scale = 18.0;
  // const gameboardHeight = scale;
  // const gameboardWidth = aspectRatio * scale;
  // const paddleWidth = 2;
  const gameboardY = 160; // height used in AI 
  const gameboardX = 192; // width used in AI
  const gameboardZ = -3.0;
  const paddleX = 30;
  const paddleY = 3.0;
  const paddleZ = 0.0;
  const ballRadius = 3.0;
  const wallX = 1.0;
  const wallZ = 2.5;
  const goalY = 1.0;
  const goalZ = 2.5;

  // console.log(`texture.image.width: ${texture.image.width}`);
  // console.log(`texture.image.height: ${texture.image.height}`);
  // console.log(`aspectRatio: ${aspectRatio}`);

  // console.log(`gameboardHeight: ${gameboardY}`);
  // console.log(`gameboardWidth: ${gameboardX}`);

  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.setLinvel({ x: 0, y: speed, z: 0 });
    }

    if (groupRef.current) {
      // groupRef.current.rotation.x = -Math.PI / 4;
    }
  }, [ballRef]);
  
  useFrame(() => {
    if (ballRef.current) {
      const currentPosition = ballRef.current.translation();
      const currentX = Math.round(currentPosition.x);
      const currentY = Math.round(currentPosition.y);
      const currentZ = Math.round(currentPosition.z);

      if (currentX != oldBall.x || currentY != oldBall.y) {
        const newPosition = { x: currentX, y: currentY, z: currentZ };
        console.log(`currentPosition: ${JSON.stringify(currentPosition, null, 2)}`);
        console.log(`newPosition: ${JSON.stringify(newPosition, null, 2)}`);
        setBallPosition(newPosition);
        setOldBall({ x: currentX, y: currentY, z: currentZ });
      }
    }
  });

  return (
    <group position={[0, 0, 0]} ref={groupRef}>
     {/* <Gameboard position={[0.0, 0.0, -0.2]} args={[aspectRatio * scale, scale]} map={texture} /> */}
     <Gameboard position={[0.0, 0.0, gameboardZ]} args={[gameboardX, gameboardY]} map={texture} />
     <Goal position={[0, gameboardY / 2, 0]} 
           args={[gameboardX, goalY, goalZ]} />
     <Goal position={[0, -gameboardY / 2, 0]} 
           args={[gameboardX, goalY, goalZ]} />
      <Wall position={[gameboardX / 2, 0, 0]} 
            args={[wallX, gameboardY, wallZ]} />
      <Wall position={[-gameboardX / 2, 0, 0]} 
            args={[wallX, gameboardY, wallZ]} />
      <Paddle color="rgb(187,30,50)" 
              position={[gameboardX / 2, gameboardY / 2, 0.0]} 
              gameboardWidth={gameboardX} 
              paddleWidth={paddleX} 
              args={[paddleX, paddleY, paddleZ]} 
              isTop={true} 
              positionX={topPaddlePosition} 
              speed={speed} />
      <Paddle color="rgb(20,192,243)" 
              position={[-gameboardX / 2, -gameboardY / 2, 0.0]} 
              gameboardWidth={gameboardX} 
              paddleWidth={paddleX} 
              args={[paddleX, paddleY, paddleZ]} 
              isTop={false} 
              positionX={bottomPaddlePosition} 
              speed={speed} />
      <Ball color="rgb(255,255,255)" 
            position={[0, 0, 0]} 
            args={[ballRadius, 64, 64]} 
            ballRef={ballRef} 
            speed={speed} />
    </group>
  );

  // return (
  //   <group position={[0, 0, 0]} ref={groupRef}>
  //     <mesh position={[0, 0, 0]}>
  //       <planeGeometry args={[5, 5]} />
  //       <meshStandardMaterial color="yellow" />
  //     </mesh>
  //     <Goal position={[0, 2.5, 0]} />
  //     <Goal position={[0, -2.5, 0]} />
  //     <Wall position={[-2.5, 0, 0]} />
  //     <Wall position={[2.5, 0, 0]} />
  //     <Paddle color="red" initialPosition={[0, -2.5, 0]} isTop={false} positionX={bottomPaddlePosition} />
  //     <Paddle color="blue" initialPosition={[0, 2.5, 0]} isTop={true} positionX={topPaddlePosition} />
  //     <Ball ballRef={ballRef} />
  //   </group>
  // );
}

export default Game;