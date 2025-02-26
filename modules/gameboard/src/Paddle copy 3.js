import React, { forwardRef, useEffect, useRef, useState, useContext } from 'react';
import { RigidBody } from '@react-three/rapier';
import {PlayContext} from './PlayContext';

const Paddle = forwardRef(({
  isTop, 
  position, 
  args, 
  color, 
  gameboardWidth,
  paddleWidth, 
  paddlePosition, 
  handleCollision, 
  }, ref) => {
    // const paddleRef = useRef();
    const [oldPaddlePosition, setOldPaddlePosition] = useState(0.0);

  const {
    forcePaddleRerender,
  } = useContext(PlayContext);  

    const max = (gameboardWidth - paddleWidth) / 2;
    const min = -max;

  useEffect(() => {
    // console.log(`!!!!!!!!!!!!!!!!! isTop: ${isTop}`);
    // console.log(`!!!!!!!!!!!!!!!!! oldPaddlePosition: ${oldPaddlePosition}`);
    // console.log(`!!!!!!!!!!!!!!!!! paddlePosition: ${paddlePosition}`);
    if (ref && ref.current) {
      if (paddlePosition != oldPaddlePosition) {
        try {
          console.log(`!!!!!!!!!!!!!!!!! isTop: ${isTop}`);
          console.log(`!!!!!!!!!!!!!!!!! oldPaddlePosition: ${oldPaddlePosition}`);
          console.log(`!!!!!!!!!!!!!!!!! paddlePosition: ${paddlePosition}`);
          
          const currentPosition = ref.current.translation();
          const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));

          const newPositionX = Math.round(Math.max(min, Math.min(max, xfactor)) * 100) / 100;
          console.log(`!!!!!!!!!!!!!!!!! newPositionX: ${newPositionX}`);
          console.log(`!!!!!!!!!!!!!!!!! currentPosition.x: ${currentPosition.x}`);
          console.log(`!!!!!!!!!!!!!!!!! currentPosition.y: ${currentPosition.y}`);
          console.log(`!!!!!!!!!!!!!!!!! currentPosition.z: ${currentPosition.z}`);
          ref.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
          setOldPaddlePosition(paddlePosition);
          console.log(`!!!!!!!!!!!!!!!!! done:}`);

        } catch (error) {
          console.log(`Error: ${error.message}`);
        }
      }
    }
  });

    useEffect(() => {
      console.log(`!!!!!!!!!!!!!!!!! forcePaddleRerender: ${forcePaddleRerender}`);
    }, [forcePaddleRerender]);

    // useEffect(() => {

    //   if (ref.current) {
    //     console.log(`!!!!!!!!!!!!!!!!! isTop: ${isTop}`);
    //     console.log(`!!!!!!!!!!!!!!!!! paddlePosition: ${paddlePosition}`);

    //     const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));
  
    //     const newPositionX = Math.max(min, Math.min(max, xfactor));
    //     const currentPosition = ref.current.translation();
    //     console.log(`!!!!!!!!!!!!!!!!! newPositionX: ${newPositionX}`);
    //     console.log(`!!!!!!!!!!!!!!!!! currentPosition.x: ${currentPosition.x}`);
    //     console.log(`!!!!!!!!!!!!!!!!! currentPosition.y: ${currentPosition.y}`);
    //     console.log(`!!!!!!!!!!!!!!!!! currentPosition.z: ${currentPosition.z}`);
    //     ref.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
    //     // const currentPositionout = ref.current.translation();
    //     // console.log(`paddle new position: ${currentPositionout.x}`);
    //   }
    // }, [paddlePosition]);

    // useEffect(() => {
    //   console.log(`!!!!!!!!!!!!!!!!! isTop: ${isTop}`);
    //   console.log(`!!!!!!!!!!!!!!!!! paddlePosition: ${paddlePosition}`);
    //   if (paddleRef.current) {
    //     const xfactor = ((paddlePosition - 0.5) * (gameboardWidth - paddleWidth));
  
    //     const newPositionX = Math.max(min, Math.min(max, xfactor));
    //     const currentPosition = paddleRef.current.translation();
    //     paddleRef.current.setTranslation({ x: newPositionX, y: currentPosition.y, z: currentPosition.z }, true);
    //     const currentPositionout = paddleRef.current.translation();
    //     console.log(`paddle new position: ${currentPositionout.x}`);
    //   }
    // }, [paddlePosition]);

    return (
      <RigidBody ref={ref} position={position} type="static" colliders="cuboid" onCollisionEnter={handleCollision} restitution={1.0} friction={0.0} userData={{ isPaddle: true, isTop: {isTop} }} >
        <mesh>
          <planeGeometry args={args} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
    );
  });

  export default Paddle;