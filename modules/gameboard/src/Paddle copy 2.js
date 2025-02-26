import React, { useRef, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';

function Paddle({
  isTop, 
  position, 
  args, 
  color, 
  gameboardWidth,
  paddleWidth, 
  paddlePosition, 
  handleCollision, 
  }) {
// const Paddle = ({
//   isTop, 
//   position, 
//   args, 
//   color, 
//   gameboardWidth,
//   paddleWidth, 
//   paddlePosition, 
//   handleCollision, 
//   }) => {

  const paddleRef = useRef();
  const meshRef = useRef();

    const max = (gameboardWidth - paddleWidth) / 2;
    const min = -max;

    useEffect(() => {
      console.log(`!!!!!!!!!!!!!!!!! isTop: ${isTop}`);
      console.log(`!!!!!!!!!!!!!!!!! paddlePosition: ${paddlePosition}`);
      if (paddleRef.current) {
        const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));
  
        const newPositionX = Math.max(min, Math.min(max, xfactor));
        const currentPosition = paddleRef.current.translation();
        paddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
        const currentPositionout = paddleRef.current.translation();
        console.log(`paddle new position: ${JSON.stringify(currentPositionout, null, 2)}`);

        if (meshRef.current) {
          // meshRef.current.position.set(newPositionX, currentPosition.y, currentPosition.z);
          meshRef.current.position.set(0, 0, 0);
        }
      }
    }, [paddlePosition]);

    return (
      <RigidBody ref={paddleRef} position={position} type="static" colliders="cuboid" onCollisionEnter={handleCollision} restitution={1.0} friction={0.0} userData={{ isPaddle: true, isTop: {isTop} }} >
        <mesh ref={meshRef}>
          <planeGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
    );
  };

  export default Paddle;