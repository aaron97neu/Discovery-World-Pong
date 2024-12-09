import React, {Suspense, useEffect, useContext} from 'react'
import { Canvas, useThree } from "@react-three/fiber";
import {GizmoHelper, GizmoViewcube, GizmoViewport} from "@react-three/drei"; // can be commented in for debugging
import Gameboard from './Gameboard';
import GameboardHud from './GameboardHud';
import PlayerInstructionsHud from './PlayerInstructionHud';
import { SceneContext } from './SceneContext';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 13, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

function MainScene() {
  const {isGameboard} = useContext(SceneContext);

  return (
    <Canvas mode="concurrent">
      <CameraController />
      <ambientLight intensity={1.5} />

        <Suspense fallback={null} >
        {isGameboard ? (
          <group> 
            <Gameboard/>
            <GameboardHud/>
          </group>
        ) : (
          <group>
            <PlayerInstructionsHud/>
          </group>  
        )}         
        </Suspense>
       
        {/* <axesHelper args={[10]} position={[0,1,0]} />
        <gridHelper  args={[80,20]}/>   
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper> */}
    </Canvas>
  );
}

export default MainScene;
