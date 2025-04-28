import { useEffect, useState } from 'react';
import {useGameContext} from './GameContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';
import { PongAPI } from 'dw-state-machine';
import GameStateMachine from './GameStateMachine';
import TylerHud from './TylerHud'; 

// class GamePlay {
const Game = () => {
  const {
    gameStateMachine,
    pongAPI,
    isGamePlaying,
    setgameInstructionProps,
    topScore, setTopScore,
    bottomScore, setBottomScore,
  } = useGameContext();

  const [prevTopScore, setPrevTopScore] = useState(0);
  const [prevBottomScore, setPrevBottomScore] = useState(0);

  useEffect(() => {
    if (gameStateMachine) {
      gameStateMachine.start();
    }
  }, [gameStateMachine]);

  useEffect(() => {
    if (pongAPI) {
      pongAPI.registerObserver(
        PongAPI.Topics.GAME_STATS, 
        onGameStats
      );
    }

    // audioPlayer.setVolume('paddleHit', volume);
  }, []);

  useEffect(() => {
    console.log(`isGamePlaying: ${isGamePlaying}`);
    if (isGamePlaying) {
      if (topScore > prevTopScore) {
        console.log("playerTopScore > topScore");
        setgameInstructionProps({
          image: IMAGES.TYLERFace_Happy,
          position: [0.0, 0.0, 0.0],
          scale: 4.0,
          text: TEXT.blank
        }); 
        setPrevTopScore(topScore);
      }
    }
  }, [topScore]);

  useEffect(() => {
    console.log(`isGamePlaying: ${isGamePlaying}`);
    if (isGamePlaying) {
      if (bottomScore > prevBottomScore) {
        console.log("playerBottomScore > bottomScore");
        setgameInstructionProps({
          image: IMAGES.TYLERFace_Annoyed,
          position: [0.0, 0.0, 0.0],
          scale: 4.0,
          text: TEXT.blank
        });       
        setPrevBottomScore(bottomScore);
      }
    }
  }, [bottomScore]);
  
  const onGameStats = (message) => {
    const playerTopScore = message.player_top.score;
    const playerBottomScore = message.player_bottom.score;

    setTopScore(playerTopScore);
    setBottomScore(playerBottomScore);
  }

  return (
    <group>
      <GameStateMachine />
      <TylerHud/>
    </group>
  );
}

export default Game;