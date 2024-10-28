import React, {Suspense, useEffect, useState, forwardRef, useImperativeHandle} from 'react'
import { Canvas, useThree } from "@react-three/fiber";
import {GizmoHelper, GizmoViewcube, GizmoViewport} from "@react-three/drei"; // can be commented in for debugging

import Gameboard from './Gameboard';
import GameboardHud from './GameboardHud';
import PlayerInstructionsHud from './PlayerInstructionHud';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 13, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

const MainScene = forwardRef(({ width, height }, ref) => {
  const [playerInstructionsProps, setPlayerInstructionsProps] = useState(PlayerInstructionsHud.defaultProps);

  useImperativeHandle(ref, () => ({
    customMethod() {
      console.log('Custom method called');
      // setCount(prevCount => prevCount + 1);
    },
    changeProps(prop) {
      console.log("prop: ", prop);
      setPlayerInstructionsProps(prop);
    }      
  }));

  return (
      <Canvas mode="concurrent" args={[width, height]} shadows >
      <CameraController />

        <Suspense fallback={null} >
          {/* <Gameboard {...gameboardProps}/>
          <GameboardHud {...gameboardHud} /> */}

          <PlayerInstructionsHud {...playerInstructionsProps} />
        </Suspense>

        {/* <axesHelper args={[10]} position={[0,1,0]} />
        <gridHelper  args={[80,20]}/>   
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>*/}
      </Canvas>
  );
});

export default MainScene;
