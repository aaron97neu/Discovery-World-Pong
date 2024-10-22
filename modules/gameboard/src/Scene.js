import React, {Suspense, useEffect} from 'react'
import { Canvas, useThree } from "@react-three/fiber";
import {GizmoHelper, GizmoViewcube, GizmoViewport} from "@react-three/drei"; // can be commented in for debugging
// import {OrbitControls} from "@react-three/drei"; // can be commented in for debugging
// import { KernelSize } from 'postprocessing'
// import {EffectComposer, Bloom} from "@react-three/postprocessing"

import Gameboard from './Gameboard';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 13, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

function Scene({ width, height }) {
  return (
      <Canvas mode="concurrent" args={[width, height]} shadows >
        <CameraController />
        {/* Add this line back into enable camera controls */}
          {/* <OrbitControls></OrbitControls> */}

        {/* <ambientLight intensity={0.3}></ambientLight>
        <spotLight position={[0,15,0]} angle={0.4} intensity={0.3} />
        <spotLight position={[0,15,0]} angle={0.3} intensity={0.2} /> */}

        <Suspense fallback={null} >
          <Gameboard />
          {/* <HudView width={screenWidth} height={screenHeight} /> */}
        </Suspense>

        {/* <axesHelper args={[10]} position={[0,1,0]} />
        <gridHelper  args={[80,20]}/>   
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>                    */}
      </Canvas>
  );
}

export default Scene;