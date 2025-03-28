import React, { useEffect, useContext } from 'react';
import { RigidBody } from '@react-three/rapier';
import {GamePlayContext} from './GamePlayContext';

const Ball = ({ ballRef, position, args, color  }) => {
  const ballStartTranslation = {x: 0, y: -(160 / 2) + 10, z: 0};

  const {
    resetBall,
    setIsBallReset,
    forceBallRerender,
  } = useContext(GamePlayContext);  

  useEffect(() => {
    if (ballRef.current) {
      if (resetBall) {
        ballRef.current.setTranslation(ballStartTranslation, true);
        ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        ballRef.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 }, true);
        setTimeout(() => {
          setIsBallReset(true);
        }, 500); 
      }
    }
  }, [forceBallRerender, resetBall]);

  return (
    <RigidBody 
      ref={ballRef} 
      position={position} 
      colliders="ball"  
      restitution={1.0} 
      friction={0.0} 
      userData={{ isBall: true }}
    >
      <mesh >
        <sphereGeometry args={args}  />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );    
};

export default Ball;