import React, { useContext, useEffect } from 'react';
import {SceneContext} from './SceneContext';

// class GamePlay {
const GamePlay = ({pongAPIRef}) => {
// function GamePlay() {
  // const pongAPIRefsaved = pongAPIRef;
  // console.log(`@@@ pongAPI.isConnected(): ${pongAPIRef.current.isConnected()}`);
  // console.log(`@@@ 3pongAPI id: ${pongAPIRef.current.getInstanceId()}`);
  // console.log(`@@@ saved pongAPI id: ${pongAPIsaved.instanceId()}`);

  const {setTopPaddlePosition, setBottomPaddlePosition, ballPosition, setBallPosition} = useContext(SceneContext);
  // console.log(`2pongAPI id: ${pongAPIRef.current.getInstanceId()}`);

      // Additional methods or overrides can be added here

  // constructor(pongAPI, sceneContext) {
  //   console.log('GamePlay Entered Constructor'); 
  //   this.pongAPI = pongAPI;
  //   this.sceneContext = sceneContext;
  //   this.pongAPI.registerObserver('game/play', this.onGamePlay.bind(this));
  //   this.pongAPI.registerObserver('game/state', this.onGameState.bind(this));
  //   this.pongAPI.registerObserver('paddle/top', this.onPaddleTop.bind(this));
  //   this.pongAPI.registerObserver('paddle/bottom', this.onPaddleBottom.bind(this));
  // }

  useEffect(() => {
    if (pongAPIRef.current) {
      console.log('GamePlay Entered useEffect'); 
      console.log(`*** pongAPI.isConnected(): ${pongAPIRef.current.isConnected()}`);
      console.log(`*** 3pongAPI id: ${pongAPIRef.current.getInstanceId()}`);
      // console.log(`*** saved pongAPI id: ${pongAPIsaved.instanceId()}`);

      // pongAPI.registerObserver('game/play', onGamePlay);
      // pongAPI.registerObserver('game/state', onGameState);

      // pongAPIsaved = pongAPI;
      pongAPIRef.current.registerObserver('paddle/top', onPaddleTop);
      pongAPIRef.current.registerObserver('paddle/bottom', onPaddleBottom);
    }
  }, [pongAPIRef]);
  
  useEffect(() => {
    // console.log('GamePlay Entered useEffect2');
    // console.log(`posistion: ${JSON.stringify(ballPosition, null, 2)}`);
    if (pongAPIRef.current) {
      console.log(`pongAPI.isConnected(): ${pongAPIRef.current.isConnected()}`);
      console.log(`3pongAPI id: ${pongAPIRef.current.getInstanceId()}`);
      // console.log(`saved pongAPI id: ${pongAPIsaved.instanceId()}`);
      
      if ( pongAPIRef.current.isConnected()) {
        const message = {
          "ball": {
            "position": {
              "x": ballPosition.x,
              "y": ballPosition.y
            }
          },
          "paddle_top": {
            "position": {
              "x": 0.2
            }
          },
          "paddle_bottom": {
            "position": {
              "x": 0.7
            }
          }
        };
        console.log(`message: ${JSON.stringify(message, null, 2)}`);

        pongAPIRef.current.update('game/play', message );
        // pongAPI.update('game/play', { position: { x: position.toFixed(2) } });
      }
    }

    console.log(`ballPosition: ${JSON.stringify(ballPosition, null, 2)}`);

  }, [pongAPIRef, ballPosition]);

  const onPaddleTop = (message) => {
    console.log('Paddle Top Message:', message);
    const paddleTopPositionX = message.position.x;
    console.log('paddleTopPositionX:', paddleTopPositionX);
    setTopPaddlePosition(paddleTopPositionX);
    setBallPosition(
      {
        x: 1.0, // The x-coordinate of the ball
        y: 2.0, // The y-coordinate of the ball
        z: 3.0  // The z-coordinate of the ball
      }
    );
  }

  const onPaddleBottom = (message) => {
    console.log('Paddle Bottom Message:', message);
    const paddleBottomPositionX = message.position.x;
    console.log('paddleBottomPositionX:', paddleBottomPositionX);
    setBottomPaddlePosition(paddleBottomPositionX);
  }  

  // onGamePlay(message) {
  //   console.log('Game Play Message:', message);
  //   // const paddleTopPositionX = message.paddle_top.position.x;
  //   // const paddleBottomPositionX = message.paddle_bottom.position.x;
  //   // const ballPositionXY = message.ball.position;
  //   // console.log('paddleTopPositionX:', paddleTopPositionX);
  //   // console.log('paddleBottomPositionX:', paddleBottomPositionX);
  //   // console.log('ballPositionXY:', ballPositionXY);
  //   // this.sceneContext.setTopPaddlePosition(paddleTopPositionX);
  //   // this.sceneContext.setBottomPaddlePosition(paddleBottomPositionX);
  //   // this.sceneContext.setBallPosition(ballPositionXY);
  // }

  // onGameState(message) {
  //   console.log('Game State Message:', message);
  //   // // Example of updating game stats
  //   // const statsMessage = {
  //   //     player1: { score: 10, count_down: 5 },
  //   //     player2: { score: 8, count_down: 5 }
  //   // };
  //   // this.pongAPI.updateGameStats(statsMessage);
  // }


  return null;

}

export default GamePlay;