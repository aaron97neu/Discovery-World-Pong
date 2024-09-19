import * as THREE from 'three'
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";


import { arg_heapsort, is_significant } from "../Utils/heap";
import { getMaxListeners } from "process";

//process.setMaxListeners(13);

const mqtt = require('mqtt')
const client = mqtt.connect(process.env.REACT_APP_URL, {clientId: 'clocktower-visualizer-neural-net-viz'})
client.on('connect', function () {
  client.subscribe('ai/activation', function (err) {
    if (!err) {
      console.log("ai activation")
    }
  })
});


const lerp = (v0, v1, amt, maxMove = 0, minDiff = 0.01) => {
  let diff = v1 - v0
  if(maxMove > 0) {
    diff = Math.min(diff, maxMove)
    diff = Math.max(diff, -maxMove)
  }
  if(Math.abs(diff) < minDiff) {
    return v1
  }
  return v0 + diff * amt
}

function Neurons (props) {

  let current_activations = null
  let new_activations = false
  let current_action = null



  const action_refs = useMemo(() => Array(3).fill(0).map(i=>React.createRef()),[]);
  const neuron_refs = useMemo(() => Array(200).fill(0).map(i=> React.createRef()), []);
  const neurons = useRef()

  useEffect(() => {
    client.on('message', function (topic, messsage) {
      const data = JSON.parse(messsage.toString())
      switch(topic) {
        case "ai/activation":
          current_activations = data[1]
          new_activations = true
          current_action = data[2]
          break;
      }
    })
  })

  useFrame((clock) => {
    neuron_refs.map((neuron, idx) => {
      neuron.current.material.color["b"] = lerp(neuron.current.material.color["b"], current_activations[idx] * 2, 0.1)
      neuron.current.material.color["g"] = lerp(neuron.current.material.color["g"], current_activations[idx], 0.1)

    })
    action_refs.map((action, idx) => {
      action.current.material.color["r"] = lerp(action.current.material.color["r"], current_action[idx] * 2, 0.4)
    })

    // go back to the floating shoe example to properly rotate the group
    // neurons.current.rotation.y = lerp(neurons.current.rotation.y, clock.getElapsedTime() / 12, .1)
  })

  const { viewport, camera } = useThree()
  const { nodes } = useGLTF('/Neuron.glb')
  const [geometry] = useState(() => nodes['Neuron'].geometry)
  const bounds =  viewport.getCurrentViewport(camera, [0, 0, 0])

  const position = useMemo(() => {
    const z = Math.random() * -30
    const bounds = viewport.getCurrentViewport(camera, [0, 0, z])
    return [THREE.MathUtils.randFloatSpread(bounds.width), THREE.MathUtils.randFloatSpread(bounds.height * 0.75), z]
  }, [viewport])

  return <group>
    <group ref={neurons}>
      {Array.from({ length: 200}, (_, i) => 
        <Float key={i} position={[THREE.MathUtils.randFloatSpread(bounds.width), THREE.MathUtils.randFloatSpread(bounds.height * 0.75), Math.random() * -30]} rotationIntensity={5} floatIntensity={10} dispose={null}>
          <mesh scale={0.75} geometry={geometry} ref={neuron_refs[i]}>
          <meshStandardMaterial color={"black"} transparent/>
          </mesh>
        </Float>
      )}
    </group>
  <Float position={[-1.5,-2.5,5]} scale={0.5} rotationIntensity={5} floatIntensity={4} dispose={null}>
    <mesh geometry={geometry} ref={action_refs[0]}>
      <meshStandardMaterial color="red" transparent/>
    </mesh>
  </Float>
  <Float position={[1.5,-2.5,5]} scale={0.5} rotationIntensity={5} floatIntensity={2} dispose={null}>
    <mesh geometry={geometry} ref={action_refs[1]}>
      <meshStandardMaterial color="red" transparent/>
    </mesh>
  </Float>
  <Float position={[0,-2.5,5]} scale={0.5} rotationIntensity={5} floatIntensity={4} dispose={null}>
    <mesh geometry={geometry} ref={action_refs[2]}>
      <meshStandardMaterial color="red" transparent/>
    </mesh>
  </Float>

</group>
  
}

// function ActionNeuron(props) {
//   const { nodes } = useGLTF('/Neuron.glb')
//   const [geometry] = useState(() => nodes['Neuron'].geometry)
//   return (
//     <Float position={props.position} rotationIntensity={5} floatIntensity={2} dispose={null}>
//       <mesh scale={props.scale} geometry={geometry} ref={props.ref}>
//         <meshStandardMaterial color="red" transparent/>
//         </mesh>
//     </Float>
//   )
// }

export default function NNVisualizer (props) {
  let [activations, setActivations] = useState([])

  let structure = null

  // console.log(structure)

  let output_weights = null
  let output_biases = null

  let significant_ow = null;

  /**
   * We are retrieving the predefined model weights from the public url as trying to use them through webpack made it spew mad chunks bruh
   */
  const getNN=()=>{
    fetch('medium.js'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(model) {
        structure = model.medium_model

        // hidden_weights = structure[0];
        // hidden_biases = structure[1];
        output_weights = structure[2];
        output_biases = structure[3];

        console.log(output_biases)

        // Save the "significant" weights: we only render the 2% most important hidden weights and
        // the 30% most important output weights so the screen doesn't get crowded
        // significant_hw = is_significant(hidden_weights, 0.02); // might not even use this
        significant_ow = is_significant(output_weights, 0.3)

        // console.log(significant_hw)
        setActivations(significant_ow)

      });
  }


  useEffect(() => {
    getNN()
  },[])

  

  return <Neurons activations={activations}/>
}
