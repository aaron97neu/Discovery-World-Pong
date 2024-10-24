import './App.css';

import React, {useState, useEffect} from 'react'
import { useLoader } from '@react-three/fiber';
import { Stage } from "@react-three/drei"; // can be commented in for debugging
import * as THREE from 'three';
import HudView from "./HudView.js"
import image1 from './imgs/PONG_Board_2.svg';

import TransparentPlane from './3DComponents/TransparentPlane'

function Gameboard() {
  // const screenWidth = window.innerWidth;
  // const screenHeight = window.innerHeight;

  const [image1Dimensions, setImage1Dimensions] = useState({ width: 1, height: 1 });  
  // const [aspectRatio1, setAspectRatio1] = useState({aspectRatio1: 1});  
  const texture1 = useLoader(THREE.TextureLoader, image1);

  useEffect(() => {
    const img1 = new Image();
    img1.src = image1;
    img1.onload = () => {
      setImage1Dimensions({ width: img1.width, height: img1.height });
      // const aspectRatio1 = image1Dimensions.width / image1Dimensions.height;
      // console.log("image1Dimensions.width: %s", image1Dimensions.width);
      // console.log("image1Dimensions.height: %s", image1Dimensions.height);
      // console.log("aspectRatio1: %s", aspectRatio1);  
      // setAspectRatio1({ aspectRatio1: aspectRatio1 });  
    };
  }, [image1]);

  const aspectRatio1 = image1Dimensions.width / image1Dimensions.height;
  console.log("image1Dimensions.width: %s", image1Dimensions.width);
  console.log("image1Dimensions.height: %s", image1Dimensions.height);
  console.log("aspectRatio1: %s", aspectRatio1);

  return (
    // <mesh rotation={[-Math.PI/6.0,0,0]} position={[0,0,0]} >
    // <mesh rotation={[-Math.PI/2.0,0,0]}  position={[0,0,-7]} >
    <mesh position={[0,0,-5]} rotation={[-Math.PI/2.0,0,0]} >
      {/* <planeGeometry attach="geometry" args={[aspectRatio1 * width, 1 * height]} /> */}
      <planeGeometry attach="geometry" args={[aspectRatio1 * 22, 1 * 22]} />
      <meshBasicMaterial attach="material" map={texture1} />
      {/* <meshBasicMaterial attach="material" map={texture1} transparent opacity={1.0} /> */}
    </mesh> 
  );
}

export default Gameboard;
