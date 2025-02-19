import React, { useContext, useEffect, useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';
import {SceneContext} from './SceneContext';

function Paddle({ paddleRef, position, args, gameboardWidth, paddleWidth, isTop, paddlePosition, color, speed, isReset }) {

    // const paddleRef = useRef();
    const {
      isPlaying, 
    } = useContext(SceneContext);
  
    const angles = [-60, -45, -30, 0, 0, 30, 45, 60]; // Bounce angles
    const regionSize = paddleWidth / 8;
  
    useEffect(() => {
      console.log(`paddlePosition: ${paddlePosition}`);
  
      if (paddleRef.current) {
        const max = (gameboardWidth - paddleWidth) / 2;
        const min = -max;
        const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));
  
        const newPositionX = Math.max(min, Math.min(max, xfactor));
        const currentPosition = paddleRef.current.translation();
        paddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z });
      }
    }, [gameboardWidth, paddleWidth, paddlePosition]);
  
    const handleCollision = useCallback((event) => {
      const otherObject = event.rigidBody;
      if (otherObject.userData && otherObject.userData.isBall && isPlaying) {
        // console.log(`d2`);
        // console.log(`event: ${event}`);
  
        // // console.log(`event.manifold.localContactPoint1(): ${event.manifold.localContactPoint1()}`);
        // // console.log(`event.manifold.localContactPoint1().x: ${event.manifold.localContactPoint1().x}`);
        // const collisionPoint = Math.round(event.manifold.localContactPoint1().x);
        // console.log(`collisionPoint: ${collisionPoint}`);
        // const regionIndex = Math.round(collisionPoint / regionSize + 4);
        // console.log(`regionIndex: ${regionIndex}`);
        // // console.log(`angles.length: ${angles.length}`);
  
        const collisionPoint = event.manifold.localContactPoint1().x;
        // console.log(`collisionPoint: ${collisionPoint}`);
        const d = (collisionPoint + (paddleWidth / 2));
        // console.log(`d: ${d}`);
        const regionIndex = Math.min(7, Math.floor((collisionPoint + (paddleWidth / 2)) / 2.5))
        // console.log(`regionIndex: ${regionIndex}`);
        // console.log(`angles.length: ${angles.length}`);
  
        // if (regionIndex >= 0 && regionIndex <= angles.length) {
        if (regionIndex >= 0 && regionIndex < angles.length) {
            // console.log(`angles[regionIndex]: ${angles[regionIndex]}`);
  
          const radians = (angles[regionIndex] * (Math.PI / 180)); // Convert angle to radians
          // console.log(`angle: ${angle}`);
          const newVelocity = {
            x: speed * Math.sin(radians),
            y: speed * Math.cos(radians) * (isTop ? -1 : 1), // Adjust y based on whether it's the top or bottom paddle
            z: 0,
          };
          // console.log(`newVelocity.x: ${newVelocity.x}`);
          // console.log(`newVelocity.y: ${newVelocity.y}`);
          // console.log(`newVelocity.z: ${newVelocity.z}`);        
          otherObject.setLinvel(newVelocity, true);
        }
      }
    }, [isPlaying]);
  
    return (
      <RigidBody ref={paddleRef} position={position} type="static" colliders="cuboid" onCollisionEnter={handleCollision} restitution={1.0} friction={0.0} userData={{ isPaddle: true }} >
        <mesh>
          <planeGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
    );
  }

  export default Paddle;