import logo from './logo.svg'; // Imports the application logo. Not needed as
                               // application is fullscreen
import './App.css'; // Imports the CSS file for styling

// Import Three.js components
import * as THREE from 'three'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei';

// Import post processing effects
import { KernelSize } from 'postprocessing'
import { EffectComposer, Bloom } from "@react-three/postprocessing"

// Import custom 3D models
import AIOpponent from './Models/AIOpponent.js' // Represents the AI opponent visually
import NNVisualizer from './Models/NNVisualizer'; // Visualizes the neural network activity

// Import React hooks
import { Suspense, useEffect } from 'react';

// Import UUID to generate unique but identifiable MQTT client id
import { v1 as uuidv1 } from 'uuid';

const mqtt = require('mqtt')
// Connects to the MQTT broker specified in environment variable
const cid = 'clocktower-visualizer-' + uuidv1()
const client = mqtt.connect(process.env.REACT_APP_URL, { clientId: cid })
client.on('connect', function () {
  client.subscribe('motion/position', function (err) {
    if (!err) {
      console.log("player position connected")
    }
  })
});


function App() {

  return (
    // Main scene setup using react-three-fiber's Canvas component
    <Canvas className='App' mode="concurrent" camera={{ position: [0, 0, 10] }}> {/* Sets initial camera position */}
      {/*  Allows user interaction with mouse to control camera (Not used) */}
      {/* <OrbitControls></OrbitControls>*/}
      {/* Adds spot light source */}
      <spotLight position={[0, 0, 10]} angle={3} intensity={1.0} />

      {/* Handles loading state while assets are being loaded */}
      <Suspense fallback={null}>
        {/* Positions the AI Opponent model */}
        <AIOpponent position={[0, 0, 5]}></AIOpponent>
        {/* Renders the Neural Network visual representation */}
        <NNVisualizer />
        {/* Applies a night sky background */}
        <Environment preset="night" />
        {/* Custom component responsible for moving the camera based on player position */}
        <Rig />
        {/* Post Processing Effects */}
        <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={1} intensity={0.1} />
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

// Rig Component: Controls Camera Movement Based on Player Position Data
function Rig({ v = new THREE.Vector3() }) {
  let currentPlayerPosition = 0

  useEffect(() => {
    // Adjust camera position based on player position on position message
    // arrival. Likely could use an if instead of switch here
    client.on('message', function (topic, message) {
      const data = JSON.parse(message.toString());
      switch (topic) {
        case "motion/position":
          // Calculate adjusted player position
          currentPlayerPosition = ((data * 4.8) * 2) - 4.8
          break
      }

    })
  }, [])

  // Animates camera movement smoothly using lerp (linear interpolation)
  return useFrame((state) => {
    state.camera.position.lerp(v.set(currentPlayerPosition / 8, 0, 10), 0.05)
  })
}


export default App;
