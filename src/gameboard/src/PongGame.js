// import PlayerPuck from "./3DModels/PlayerPuck.js";
// import AIPuck from './3DModels/AIPuck'
// import Ball from './3DModels/Ball'

import { Canvas, useFrame } from "@react-three/fiber";
import React, {useRef, useEffect} from "react";

// Import UUID to generate unique but identifiable MQTT client id
import { v1 as uuidv1 } from 'uuid';

const mqtt = require('mqtt')
const cid = 'gameboard-ponggane.js-' + uuidv1()
const client = mqtt.connect(process.env.REACT_APP_URL, {clientId: cid} )
console.log("Creating Gameplay connections");
client.on('connect', function () {
  client.subscribe('puck/position', function (err) {
    if (!err) {
      console.log("connection puck")
    }
  })

  client.subscribe('paddle1/position', function (err) {
    if (!err) {
      console.log("connection pad1")
    }
  })

  client.subscribe('paddle2/position', function (err) {
    if (!err) {
      console.log("connection pad2")
    }
  })

  client.subscribe('motion/position', function (err) {
    if (!err) {
      console.log("connection position")
    }
  })
});

export default function PongGame(props) {

    const ball = useRef();
    const player = useRef();
    const opponent = useRef();


    
    const scalar = 20; // reduction from pixel size of playing field to size of visual
    const xOffset = 4.8; // half playfield width
    const yOffset = 4; // half playfield height

    const paddleOffset = 3.5;

    let currentBallPosition = {x: 0, y: 0}
    let currentPlayerPosition = 0
    let currentMotionPosition = 0
    let currentOpponentPosition = 0

  useEffect(() => {
    client.on('message', function (topic, message) {
      // message is Buffer
      // console.log(topic)
      // console.log(message.toString())
      const data = JSON.parse(message.toString());
      switch (topic) {
        case "puck/position":
          let pos = {
            x: (data.x / scalar) - xOffset,
            y: (data.y / scalar) - yOffset
          }
          currentBallPosition = pos;
          break;
        case "paddle1/position":
          currentPlayerPosition = (data.position / scalar) - xOffset
          break;
        case "paddle2/position":
          console.log("paddle" + data)
          currentOpponentPosition = (data.position / scalar) - xOffset
          break;
        case "motion/position":
          currentMotionPosition = ((data * 4.8) * 2) - 4.8
      }

    })
  }, [])

    useFrame((state, delta) => {
        ball.current.position.x = currentBallPosition.x;
        ball.current.position.z = currentBallPosition.y;

        // player.current.position.x = currentPlayerPosition; // use if value should be read from the game rather than the motion controller
        player.current.position.x = currentMotionPosition;
        opponent.current.position.x = currentOpponentPosition;

      })

    return(
        <group>
            {/* <Ball ref={ball} /> */}
            <mesh ref={ball} >
                <boxGeometry attach="geometry" args={[0.4,0.4,0.4]} />
                <meshStandardMaterial attach="material" color={"white"} />
            </mesh>
            {/* <PlayerPuck  />
            <AIPuck  />  */}
            <mesh ref={player} position={[0,0,paddleOffset]} >
                <boxGeometry attach="geometry" args={[1,0.4,0.3]} />
                <meshStandardMaterial attach="material" color={"deepskyblue"} />
            </mesh>

            <mesh ref={opponent} position={[0,0,-paddleOffset]} >
                <boxGeometry attach="geometry"  args={[1,0.4,0.3]} />
                <meshStandardMaterial attach="material" color={"red"} />
            </mesh>

        </group>
    )
}
