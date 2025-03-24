import React, { useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';

function Goal({ position, args, onGoal }) {
  const handleIntersectionExit = useCallback(() => {
    onGoal();
   }, []);

  return (
    <RigidBody 
      position={position} 
      sensor 
      colliders="cuboid" 
      onIntersectionEnter={handleIntersectionExit} 
      userData={{ isGoal: true }}
    >
    <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial  
          color="green" 
          transparent 
          opacity={1.0} 
        />
      </mesh>
    </RigidBody>
  );
}

export default Goal;