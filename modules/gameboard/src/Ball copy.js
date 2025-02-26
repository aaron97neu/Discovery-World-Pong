import React, { forwardRef } from 'react';
import { RigidBody } from '@react-three/rapier';

const Ball = forwardRef(({ position, args }, ref) => {
  return (
    <RigidBody ref={ref} position={position} colliders="ball"  restitution={1.0} friction={0.0} userData={{ isBall: true }}>
      <mesh >
        <sphereGeometry args={args}  />
        {/* <circleGeometry args={[3.0, 64]} /> */}
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
});

export default Ball;