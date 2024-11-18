import { useContext} from 'react'
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';

function Gameboard() {
  const {topPaddlePosition, bottomPaddlePosition} = useContext(SceneContext);
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);
  const aspectRatio = texture.image.width / texture.image.height;
  const scale = 22.0;

  return (
    <group position={[0.0,0.0,-5.0]} rotation={[-Math.PI/2.0,0.0,0.0]}>
      <mesh>
        <planeGeometry attach="geometry" args={[aspectRatio * scale, scale]} />
        <meshBasicMaterial attach="material" map={texture} transparent opacity={1.0} />
      </mesh>
      <mesh position={[(topPaddlePosition * 24) - 12.0,11.0,0.0]} >
        <boxGeometry args={[3.0, 0.5, 0.1]} /> {/* Width, Height, Depth */}
        <meshBasicMaterial color="rgb(187,30,50)" />
      </mesh>               
      <mesh position={[(bottomPaddlePosition * 24) - 12.0,-11.0,0.0]} >
        <boxGeometry args={[3.0, 0.5, 0.1]} /> {/* Width, Height, Depth */}
        <meshBasicMaterial color="rgb(20,192,243)" />
      </mesh> 
    </group>
  );


  // return (
  //   <group>
  //     <mesh position={[0,0,-5]} rotation={[-Math.PI/2.0,0,0]} >
  //       <planeGeometry attach="geometry" args={[aspectRatio * scale, scale]} />
  //       <meshBasicMaterial attach="material" map={texture} transparent opacity={1.0} />
  //     </mesh>
  //     <mesh position={[0,6,-7]} rotation={[-Math.PI/2.0,0,0]} >
  //       <boxGeometry args={[2, 1, 0.1]} /> {/* Width, Height, Depth */}
  //       <meshStandardMaterial color="red" />
  //     </mesh>            
  //     <mesh position={[0,-1,-5]} rotation={[-Math.PI/2.0,0,0]} >
  //       <boxGeometry args={[2, 1, 0.1]} /> {/* Width, Height, Depth */}
  //       <meshStandardMaterial color="blue" />
  //     </mesh>      
  //   </group>
  // );
}

export default Gameboard;
