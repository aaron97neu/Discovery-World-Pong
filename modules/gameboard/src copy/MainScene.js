import React, {Suspense, useEffect, useContext} from 'react'
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from '@react-three/rapier';
import {GizmoHelper, GizmoViewcube, GizmoViewport, GridHelper} from "@react-three/drei"; // can be commented in for debugging
import Game from './Game';
import GameHud from './GameHud';
import PlayerInstructionsHud from './PlayerInstructionHud';
import { SceneContext } from './SceneContext';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    // camera.position.set(0, -5, 10);
    // camera.lookAt(0, 0, 0);

    // camera.position.set(0, -8.5, 10);
    // camera.lookAt(0, -4, 0);

    camera.fov = 65;
    camera.updateProjectionMatrix();

    camera.position.set(0, -95.0, 95);
    camera.lookAt(0, -37, 0);

    // camera.fov = 40;
    // camera.updateProjectionMatrix();
    // camera.position.set(0, -1.2, 0.5);
    // camera.lookAt(0.0, -0.4, 0.0);

  }, [camera]);

  return null;
}

function MainScene() {
  const {isGame} = useContext(SceneContext);

  return (
    <Canvas mode="concurrent">
      <ambientLight intensity={1.5} />
      <CameraController />
      <Suspense fallback={null} >
        <Physics gravity={[0, 0, 0]}>
      {/* <GamePlay /> */}
        {isGame ? (
          <group> 
            <Game/>
            <GameHud/>
          </group>
        ) : (
          <group>
            <PlayerInstructionsHud/>
          </group>  
        )}
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
