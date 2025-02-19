import React, { useCallback } from 'react';
import { RigidBody } from '@react-three/rapier';

function Goal({ position, args, onGoal, onProcess, isReset }) {

  const handleIntersectionExit = useCallback(() => {
    if (!isReset) {
        console.log('Goal scored!');
      onGoal();
      onProcess();
    }
   }, [isReset]);

  return (

    <RigidBody position={position} sensor colliders="cuboid" onIntersectionEnter={handleIntersectionExit} userData={{ isGoal: true }}>
    <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial  color="green" transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  );
}

export default Goal;