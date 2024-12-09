import { useContext} from 'react'
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';
import { Circle } from '@react-three/drei';
import Ball from './Ball.js';

function Gameboard() {
  const {topPaddlePosition, bottomPaddlePosition, ballPosition} = useContext(SceneContext);
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);
  const aspectRatio = texture.image.width / texture.image.height;
  const scale = 22.0;

  return (
    <group position={[0.0, 0.0, -5.0]} rotation={[-Math.PI/2.0, 0.0, 0.0]}>
      <mesh position={[0.0, 0.0, 0.0]}>
        <planeGeometry attach="geometry" args={[aspectRatio * scale, scale]} />
        <meshBasicMaterial attach="material" map={texture} transparent opacity={1.0} />
      </mesh>
      <mesh position={[(topPaddlePosition * 24) - 12.0, 11.0, 0.0]} >
        <boxGeometry args={[3.0, 0.5, 0.1]} /> {/* Width, Height, Depth */}
        <meshBasicMaterial color="rgb(187,30,50)" />
      </mesh>               
      <mesh position={[(bottomPaddlePosition * 24) - 12.0, -11.0, 0.0]} >
        <boxGeometry args={[3.0, 0.5, 0.1]} /> {/* Width, Height, Depth */}
        <meshBasicMaterial color="rgb(20,192,243)" />
      </mesh> 
      <mesh position={[ballPosition.x , ballPosition.y, 0.5]} >
        <sphereGeometry  args={[0.3, 64, 64]} /> {/* radius, width segments, height segments */}
        <meshBasicMaterial color="rgb(255,255,255)" />
      </mesh> 
    </group>
  );

  // <Ball start={[0.0, -10.0, 0.0]} end={[0.0, 10.0, 0.0]} />

  // <mesh position={[ballPosition.x , ballPosition.y, 0.5]} >
  //   <sphereGeometry  args={[0.3, 64, 64]} /> {/* radius, width segments, height segments */}
  //   <meshBasicMaterial color="rgb(255,255,255)" />
  // </mesh> 

  // <Circle args={[1, 32]} position={[0, 0, 0.1]}>
  //   <meshBasicMaterial attach="material" color="white" />
  // </Circle>
}

export default Gameboard;
