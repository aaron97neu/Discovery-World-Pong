import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';

function Ball() {
    const ballRef = useRef();
    const speed = 2;
  
    useEffect(() => {
        if (ballRef.current) {
          // Apply initial velocity to the ball
          ballRef.current.setLinvel({ x: 0, y: speed, z: 0 });
        }
    }, [speed]);
  
    useFrame(() => {
        if (ballRef.current) {
            // Ensure the ball's speed remains constant
            const linvel = ballRef.current.linvel();
            const currentSpeed = Math.sqrt(linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2);
            const scalingFactor = speed / currentSpeed;
            // ballRef.current.setLinvel({
            //     x: linvel.x * scalingFactor,
            //     y: linvel.y * scalingFactor,
            //     z: linvel.z * scalingFactor,
            // });

            ballRef.current.setLinvel({
                x: linvel.x * scalingFactor,
                y: linvel.y * scalingFactor,
                z: linvel.z * scalingFactor,
            });

            // Log the ball's position on each frame
            // const position = ballRef.current.translation();
            // console.log(`Ball position: x=${position.x}, y=${position.y}, z=${position.z}`);   
        }
    });
  
    return (
      <RigidBody ref={ballRef} colliders="ball" restitution={1}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 64, 64]}  />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>
    );
}

export default Ball;