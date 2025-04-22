import React, {Suspense, useEffect, useContext} from 'react'
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from '@react-three/rapier';
import {GizmoHelper, GizmoViewcube, GizmoViewport, GridHelper} from "@react-three/drei"; // can be commented in for debugging
// import GamePlay from './GamePlay';
// import GamePlayHud from './GamePlayHud';
// import GameInstructionsHud from './GameInstructionHud';
// import { useGameContext } from './GameContext';
import Game from './Game';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = 65;
    camera.updateProjectionMatrix();

    camera.position.set(0, -95.0, 95);
    camera.lookAt(0, -37, 0);
  }, [camera]);

  return null;
}

function MainScene() {

  // const {
  //   isGamePlayComplete,
  // } = useGameContext();

  return (
    <Canvas mode="concurrent">
      {/* <Game/> */}
      <ambientLight intensity={1.5} />
      <CameraController />
      <Suspense fallback={null} >
        <Physics gravity={[0, 0, 0]} >
        <Game/>
        {/* {isGamePlayComplete ? (
          <group>
            <GameInstructionsHud/>
          </group>  
        ) : (
          <group> 
            <GamePlay/>
            <GamePlayHud/>
          </group>
        )} */}
        </Physics>   
      </Suspense>
       
      {/* <axesHelper args={[2]} position={[11, 4, -3]} />
      <gridHelper args={[200, 20, 'red', 'white']} />
      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper> */}
    </Canvas>
  );
}

export default MainScene;
