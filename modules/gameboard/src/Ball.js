import { RigidBody } from '@react-three/rapier';
import {useGamePlayContext} from './GamePlayContext';

const Ball = ({ position, args, color  }) => {
  const {
    ballRef,
  } = useGamePlayContext();  

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
        <meshStandardMaterial 
          color={color} 
        />
      </mesh>
    </RigidBody>
  );    
};

export default Ball;
