import React from 'react';
import { RigidBody } from '@react-three/rapier';

function Wall({ position, args }) {
  return (
    <RigidBody 
      type="fixed" 
      position={position} 
      colliders="cuboid" 
      restitution={1.0} 
      friction={0.0}
    >
      <mesh>
        <planeGeometry args={args} />
        <meshStandardMaterial 
          color="red" 
          transparent 
          opacity={0.0} 
        />
      </mesh>
    </RigidBody>
  );
}

export default Wall;