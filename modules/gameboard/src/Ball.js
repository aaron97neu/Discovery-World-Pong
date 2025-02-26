import React, { forwardRef, useEffect, useRef, useState, useContext } from 'react';
import { RigidBody } from '@react-three/rapier';
import {PlayContext} from './PlayContext';

const Ball = ({ ballRef, position, args, color  }) => {

  // const ballRef = useRef();
  const ballStartTranslation = {x: 0, y: -(160 / 2) + 10, z: 0};

  const {
    resetBall,
    setResetBall,
    setIsBallReset,
    forceBallRerender,
  } = useContext(PlayContext);  

  useEffect(() => {
    if (ballRef.current) {
      if (resetBall) {
        ballRef.current.setTranslation(ballStartTranslation, true);
        // ballRef.current.setTranslation( {x: 0, y:-50, z: 0}, true); 
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        ballRef.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        setTimeout(() => {
            setIsBallReset(true);
            // setResetBall(false);
        }, 500); 
      }
    }
  }, [forceBallRerender, resetBall]);

  useEffect(() => {
    console.log(`^^^^^^^^^^^^^ forceBallRerender: ${forceBallRerender}`);
  }, [forceBallRerender]);

  return (
    <RigidBody ref={ballRef} position={position} colliders="ball"  restitution={1.0} friction={0.0} userData={{ isBall: true }}>
      <mesh >
        <sphereGeometry args={args}  />
        {/* <circleGeometry args={[3.0, 64]} /> */}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );    
};

export default Ball;