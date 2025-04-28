import React, {Suspense} from 'react'
import { Canvas } from "@react-three/fiber";
import {GizmoHelper, GizmoViewcube, GizmoViewport, GridHelper} from "@react-three/drei"; // can be commented in for debugging
import Game from './Game';

function MainScene() {
  return (
    <Canvas mode="concurrent">
      <ambientLight intensity={1.5} />
      <Suspense fallback={null} >
      <Game/>
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