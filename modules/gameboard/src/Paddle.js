import React, { useState, useEffect, forwardRef } from 'react';
import { RigidBody } from '@react-three/rapier';

const Paddle = forwardRef(({
  isTop, 
  position, 
  args, 
  color, 
  gameboardWidth,
  paddleWidth, 
  paddlePosition, 
  handleCollision, 
  }, ref) => {
    const max = (gameboardWidth - paddleWidth) / 2;
    const min = -max;

    useEffect(() => {
      // console.log(`isTop: ${isTop}`);
      // console.log(`paddlePosition: ${paddlePosition}`);
      if (ref.current) {
        const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));
  
        const newPositionX = Math.max(min, Math.min(max, xfactor));
        const currentPosition = ref.current.translation();
        ref.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
      }
    }, [paddlePosition]);

    return (
      <RigidBody ref={ref} position={position} type="static" colliders="cuboid" onCollisionEnter={handleCollision} restitution={1.0} friction={0.0} userData={{ isPaddle: true, isTop: {isTop} }} >
        <mesh>
          <planeGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
    );
  });

  export default Paddle;