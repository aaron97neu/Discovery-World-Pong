import logo from './logo.svg';
import './App.css';

import * as THREE from 'three'
import {Canvas, useThree, useFrame} from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei';

import { KernelSize } from 'postprocessing'
import {EffectComposer, Bloom} from "@react-three/postprocessing"

import AIOpponent from './Models/AIOpponent.js'
import NNVisualizer from './Models/NNVisualizer';
import { Suspense, useEffect } from 'react';


const mqtt = require('mqtt')
const client = mqtt.connect(process.env.REACT_APP_URL)
client.on('connect', function () {
  client.subscribe('motion/position', function (err) {
    if (!err) {
      console.log("player position connected")
    }
  })
});


function App() {

  return (
      <Canvas className='App' mode="concurrent" camera={{position: [0,0,10]}}>
        {/* <OrbitControls></OrbitControls> */}
        <spotLight position={[0,0,10]} angle={3} intensity={1.0} />
        <Suspense fallback={null}>
          <AIOpponent position={[0,0,5]}></AIOpponent>
          <NNVisualizer/>
          <Environment preset="night" />
          <Rig />

          <EffectComposer multisampling={8}>
            <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={1} intensity={0.1} />
            <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.1} /> 
          </EffectComposer>
        </Suspense>
      </Canvas>
  );
}


// can use this function to jitter camera rather than rotate model
function Rig({ v = new THREE.Vector3() }) {
  let currentPlayerPosition = 0

  useEffect(()=> {
    client.on('message', function (topic, message) {
      // message is Buffer
      // console.log(topic)
      // console.log(message.toString())
      const data = JSON.parse(message.toString());
      switch (topic) {
        case "motion/position":
          // console.log(data)
          currentPlayerPosition = ((data * 4.8) * 2) - 4.8
          break
      }

    })
  }, [])
  
  return useFrame((state) => {
    state.camera.position.lerp(v.set(currentPlayerPosition / 8, 0, 10), 0.05)
  })
}


export default App;
