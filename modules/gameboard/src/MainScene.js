import React, {Suspense, useEffect, useState, useRef} from 'react'
import { Canvas, useThree } from "@react-three/fiber";
import {GizmoHelper, GizmoViewcube, GizmoViewport} from "@react-three/drei"; // can be commented in for debugging
// import {OrbitControls} from "@react-three/drei"; // can be commented in for debugging
// import { KernelSize } from 'postprocessing'
// import {EffectComposer, Bloom} from "@react-three/postprocessing"

import Gameboard from './Gameboard';
import GameHud from './GameHud';
import PlayerInstructionsHud from './PlayerInstructionHud';

import { 
  gameboard,
  score,
  level01,
  countdownGo,
  getReady,
  playerInstructionsStand,
  welcomeScreen,
} from './loadImages';

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 13, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

function MainScene({ width, height }) {
  
  const gameHudProps = {
    score: { image: score, position: [6.9, 2.2, 0.0], scale: 4.0 },
    level: { image: level01, position: [-6.2, 3.9, 0.0], scale: 0.7 },
    countdown: { image: getReady, position: [0.0, 0.0, 0.0], scale: 1.5 },
  };

  const playerInstructionsHudProps = {
    playerInstructions: { image: welcomeScreen, position: [0.0, 0.3, 0.0], scale: 8.8 },
  };  
  
  const playerInstructionsHudProps2 = {
    playerInstructions: { image: getReady, position: [0.0, 0.3, 0.0], scale: 8.8 },
  };

  const gameboardProps = { image: gameboard, position: [0,0,-5], scale: 22.0 };

  const [currentProps, setCurrentProps] = useState(playerInstructionsHudProps);
  const [count, setCount] = useState(0);
  const countRef = useRef();
  
  const changeProps = (newProps) => {
    setCurrentProps(newProps);
  };
 
  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <Canvas mode="concurrent" args={[width, height]} shadows >
        <CameraController />

        <Suspense fallback={null} >
          {/* <Gameboard {...gameboardProps}/>
          <GameHud {...gameHudProps} /> */}
          {/* <PlayerInstructionsHud {...playerInstructionsHudProps} /> */}
          <PlayerInstructionsHud {...currentProps} />
        </Suspense>

        {/* <axesHelper args={[10]} position={[0,1,0]} />
        <gridHelper  args={[80,20]}/>   
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>                    */}
      </Canvas>
      <button onClick={() => changeProps(playerInstructionsHudProps)}>playerInstructionsHudProps</button>
      <button onClick={() => changeProps(playerInstructionsHudProps2)}>playerInstructionsHudProps2</button>  
    </div>    
  );
}

export default MainScene;
