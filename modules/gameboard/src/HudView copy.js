import { useEffect, useState, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import image1 from './imgs/scores/Score.png';
import image2 from './imgs/levels/Levels-01.png';
import image3 from './imgs/countdown_and_times/Countdown_GO.png';

function HudView({ width, height }) {
  const [image1Dimensions, setImage1Dimensions] = useState({ width: 1, height: 1 });  
  const [image2Dimensions, setImage2Dimensions] = useState({ width: 1, height: 1 });  
  const [image3Dimensions, setImage3Dimensions] = useState({ width: 1, height: 1 });  

  const outerPlaneRef = useRef<mesh | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const offsetX = 0.1; // 0.1 units from the right edge
  const offsetY = 0.1; // 0.1 units from the top edge

  const texture1 = useLoader(THREE.TextureLoader, image1);
  const texture2 = useLoader(THREE.TextureLoader, image2);
  const texture3 = useLoader(THREE.TextureLoader, image3);

  const { camera } = useThree();

  console.log("width: %s", width);
  console.log("height: %s", height);
  console.log("test: %s", camera.position.z);
  
  useEffect(() => {
    const img1 = new Image();
    img1.src = image1;
    img1.onload = () => {
      setImage1Dimensions({ width: img1.width, height: img1.height });
    };

    const img2 = new Image();
    img2.src = image2;
    img2.onload = () => {
      setImage2Dimensions({ width: img2.width, height: img2.height });
    };

    const img3 = new Image();
    img3.src = image3;
    img3.onload = () => {
      setImage3Dimensions({ width: img3.width, height: img3.height });
    };

    if (outerPlaneRef.current) {
      const { geometry } = outerPlaneRef.current;
      console.log("dimension width: %s", geometry.parameters.width);
      console.log("dimension height: %s", geometry.parameters.height);
      setDimensions({
        width: geometry.parameters.width,
        height: geometry.parameters.height,
      });
    }

  }, [image1, image2, image3]);

  const aspectRatio1 = image1Dimensions.width / image1Dimensions.height;
  const aspectRatio2 = image2Dimensions.width / image2Dimensions.height;
  const aspectRatio3 = image3Dimensions.width / image3Dimensions.height;

  const visibleHeightAtZDepth = (depth, camera) => {
    // Compensate for cameras not positioned at z=0
    console.log("camera.position.z: %s", camera.position.z);
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;
  
    // Vertical field of view in radians
    const vFOV = camera.fov * Math.PI / 180;
  
    // Calculate the visible height
    console.log("visibleHeightAtZDepth: %s", 2 * Math.tan(vFOV / 2) * Math.abs(depth));
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
  };
  
  const visibleWidthAtZDepth = (depth, camera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    console.log("visibleHeightAtZDepth: %s", height * camera.aspect);
    return height * camera.aspect;
  };

  return (
    // <mesh rotation={[-Math.PI/2,0,0]}>
    //   <planeGeometry attach="geometry" args={[width, height]} />
    //   <meshBasicMaterial attach="material" color="blue" transparent opacity={0.2} />
    //   <mesh rotation={[-Math.PI/2,0,0]} position={[-width / 4, height / 4, 0.1]}>
    //     <planeGeometry attach="geometry" args={[width / 5, height / 5]} />
    //     <meshBasicMaterial attach="material" map={texture1} />
    //   </mesh>
    //   <mesh position={[width / 4, height / 4, 0.1]}>
    //     <planeGeometry attach="geometry" args={[width / 5, height / 5]} />
    //     <meshBasicMaterial attach="material" map={texture2} />
    //   </mesh>
    //   <mesh position={[0, -height / 4, 0.1]}>
    //     <planeGeometry attach="geometry" args={[width / 5, height / 5]} />
    //     <meshBasicMaterial attach="material" map={texture3} />
    //   </mesh>
    // </mesh>
    <mesh position={[0, 0, 5]} ref={outerPlaneRef}>
      {/* <planeGeometry attach="geometry" args={[visibleWidthAtZDepth(3, camera), visibleHeightAtZDepth(3, camera)]} /> */}
      <planeGeometry attach="geometry" args={[dimensions.width, dimensions.height]} />
      {/* <meshBasicMaterial attach="material" color="red" transparent opacity={0.2} /> */}
      <meshBasicMaterial attach="material" transparent opacity={0.2} color="red"/>
      {/* <mesh rotation={[-Math.PI/2,0,0]} position={[-width / 4, height / 4, 0.1]} >
        <planeGeometry attach="geometry" args={[width / 5, height / 5]} />
        <meshBasicMaterial attach="material" map={texture1} />
      </mesh> */}
      {/* <mesh position={[width / 4, height / 4, 0.1]}>
        <planeGeometry attach="geometry" args={[width / 5, height / 5]} />
        <meshBasicMaterial attach="material" map={texture2} />
      </mesh> */}
      {/* <mesh rotation={[Math.PI/2,0,0]}  >
        <planeGeometry attach="geometry" args={[width / 100, height / 100]} />
        <meshBasicMaterial attach="material" color="green" transparent opacity={0.2} />
      </mesh> */}

      <mesh position={[0.9, 0.3, 0]} >
      {/* <mesh position={[0.0, 0.0, 0.0]} > */}
      {/* <mesh position={[dimensions.width / 2 - offsetX, dimensions.height / 2 - offsetY, 0.0]} > */}
        {/* <planeGeometry attach="geometry" args={[visibleWidthAtZDepth(1, camera) / 5, visibleHeightAtZDepth(1, camera) / 5]} /> */}
        <planeGeometry attach="geometry" args={[aspectRatio1 * 0.5, 1 * 0.5]} />
        <meshBasicMaterial attach="material" map={texture1} transparent opacity={1.0} />
      </mesh>    

    </mesh>
);}

export default HudView;
