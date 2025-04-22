import React, { useEffect, useRef, useState, useContext } from 'react';
import { RigidBody } from '@react-three/rapier';

const Paddle = ({
  paddleRef,
  isTop, 
  position, 
  args, 
  color, 
  handleCollision, 
  }) => {

  return (
    <RigidBody 
      ref={paddleRef} 
      position={position} 
      type="static" 
      colliders="cuboid"
      onCollisionEnter={handleCollision} 
      restitution={1.0} 
      friction={0.0} 
      userData={{ isPaddle: true, isTop: {isTop} }} 
    >
      <mesh>
        <planeGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

  export default Paddle;