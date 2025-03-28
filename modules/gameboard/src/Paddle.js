import React, { useEffect, useRef, useState, useContext } from 'react';
import { RigidBody } from '@react-three/rapier';
import {GamePlayContext} from './GamePlayContext';

const Paddle = ({
  isTop, 
  position, 
  args, 
  color, 
  gameboardWidth,
  paddleWidth, 
  paddlePosition, 
  handleCollision, 
  }) => {

  const paddleRef = useRef();
  // const [oldPaddlePosition, setOldPaddlePosition] = useState(0.0);

  const {
    forcePaddleRerender,
  } = useContext(GamePlayContext);  

  const max = (gameboardWidth - paddleWidth) / 2;
  const min = -max;

    useEffect(() => {
      if (paddleRef.current) {
        const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));
  
        const newPositionX = Math.round(Math.max(min, Math.min(max, xfactor)) * 100) / 100;
        const currentPosition = paddleRef.current.translation();
        paddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
      }
    }, [forcePaddleRerender, paddlePosition]);

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