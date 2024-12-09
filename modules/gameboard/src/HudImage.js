import { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function HudImage({image, position = [0, 0, 0], scale = 1.0}) {
  const texture = useLoader(THREE.TextureLoader, image);
  const [aspectRatio, setAspectRatio] = useState(1);  

  useEffect(() => {
    setAspectRatio(texture.image.width / texture.image.height);
  }, []);

  return (
    <mesh position={position}>
      <planeGeometry attach="geometry" args={[aspectRatio * scale, scale]} />
      <meshBasicMaterial attach="material" map={texture} transparent opacity={1.0} />
    </mesh>         
  );
}

export default HudImage;
