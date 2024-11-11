// keep level and score count

import React, {useEffect, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'

import Text from './3DComponents/Text';
import TransparentPlane from './3DComponents/TransparentPlane';
import { Group } from 'three';



const mqtt = require('mqtt')
// const client = mqtt.connect(process.env.REACT_APP_URL, {clientId: 'gameboard-gamedata.js'});
const client = mqtt.connect(window.location.hostname, {clientId: 'gameboard-gamedata.js'});
console.log("Creating UI connections");
client.on('connect', function () {
 
  client.subscribe('player1/score', function (err) {
    if (!err) {
      console.log("connection score")
    }
  })

  client.subscribe('player2/score', function (err) {
    if (!err) {
      console.log("connection score2")
    }
  })

  client.subscribe('game/level', function (err) {
    if (!err) {
      console.log("connection level")
    }
  })

  client.subscribe('game/state', function (err) {
      if(!err) {
          console.log("connection game state")
      }
  })
});


export default function GameData(props) {

    const [score, setScore] = useState({player1: 0, player2: 0})
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [level, setLevel] = useState(0)
    const [currentState, setCurrentState] = useState(0);

    useEffect(() => {
        
        client.on('message', function (topic, message) {
            const data = JSON.parse(message.toString());
            switch (topic) {
            case "player1/score":
                let score1 = data.score;
                if (score1 != score.player1) {
                    setScore(prevState => ({
                        ...prevState,
                        player1: score1
                    }))
                }
                break;
            case "player2/score":
                let score2 = data.score;
                if (score2 != score.player2) {
                    setScore(prevState => ({
                        ...prevState,
                        player2: score2
                    }))
                }
                break;
            case "game/level":
                let levelNumber = data.level;
                if (levelNumber != level) {
                    setLevel(levelNumber)
                }
                break;
            case "game/state":
                let newState = data.state;
                if(newState != currentState) {
                    setCurrentState(newState)
                    if(newState < 2)
                    setScore({player1: 0, player2: 0})
                }
            }
        })
    },[])

    const userPrompt = () => {
        // feedback based on game state 0 - waiting, 1 - ready, will start soon, 2 - running
        switch(currentState){
            case 0:
                return <group>
                        <Text position={[-4,2,2]} rotation={[-Math.PI/4, 0, 0]} text={"Enter To Play"} color={"white"} />
                        <TransparentPlane position={[0,1,0]} size={[100,100,100]} color={"black"} opacity={0.7} />
                    </group>
                break;
            case 1:
                return <group>
                    <Text position={[-3,2,2]} rotation={[-Math.PI/4, 0, 0]} text={"Get Ready!"} color={"white"} />
                    <TransparentPlane position={[0,1,0]} size={[100,100,100]} color={"black"} opacity={0.4} />
                    </group>
                break;
            case 2:
                return <Text position={[-2,1,-3]} rotation={[-Math.PI/4, 0, 0]} text={"Level: " + level} color={"white"} />
                break;
            case 3: 
                return <group scale={[.7,.7,.7]}>
                    <Text position={[-3.3,2,2]} rotation={[-Math.PI/4, 0, 0]} text={"Thank You"} color={"white"} />
                    <Text position={[-3.5,1.5,4]} rotation={[-Math.PI/3, 0, 0]} text={"For Playing!"} color={"white"} />
                    <TransparentPlane position={[0,1,0]} size={[100,100,100]} color={"black"} opacity={0.4} />
                    </group>
                break;
        }
    }


    return (
        <group position={[0,0,-1]}>

            

            {/* Generate Gameplay messages to start: Waiting, Ready, GO! */}
            {userPrompt()}
            

            {/* player score */}
            {/* These are sized and rotated by best estimate, if we continue with this script, we should use lookat() or another method to create a billboard object */}
            <Text position={[-0.4,-0.4,3.5]} rotation={[-Math.PI/2, 0, 0]} text={"" + score.player1} color={"deepskyblue"} />
            {/* AI score */}
            <Text position={[-0.4,-0.4,-0.5]} rotation={[-Math.PI/2, 0, 0]} text={"" + score.player2} color={"red"} />
        </group>
    )
}
