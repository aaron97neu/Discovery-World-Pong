import { useContext } from 'react'
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import * as IMAGES from './loadImages';
import {SceneContext} from './SceneContext';

function Gameboard() {
  const {isGameboardVisible} = useContext(SceneContext);
  const texture = useLoader(THREE.TextureLoader, IMAGES.gameboard);
  const aspectRatio = texture.image.width / texture.image.height;
  const scale = 22.0;

  return (
    <group  visible={isGameboardVisible}>
      <mesh position={[0,0,-5]} rotation={[-Math.PI/2.0,0,0]} >
        <planeGeometry attach="geometry" args={[aspectRatio * scale, scale]} />
        <meshBasicMaterial attach="material" map={texture} transparent opacity={1.0} />
      </mesh>
    </group>
  );
}

export default Gameboard;
