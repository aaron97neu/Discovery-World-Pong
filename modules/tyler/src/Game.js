import { useEffect, useState } from 'react';
import {useGameContext} from './GameContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';
import { PongAPI } from 'dw-state-machine';
import GameStateMachine from './GameStateMachine';
import TylerHud from './TylerHud'; 

const Game = () => {
  const {
    setgameInstructionProps,
    gameStateMachine,
    pongAPI,
    // audioPlayer,
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

    // To change volume uncomment and adjust the volume in GameContext
    // audioPlayer.setVolume('tylerIntro', volume);
  }, []);

  useEffect(() => {
    if (topScore > prevTopScore) {
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Happy,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.blank
      }); 
      setPrevTopScore(topScore);
    }
  }, [topScore]);

  useEffect(() => {
    if (bottomScore > prevBottomScore) {
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Annoyed,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.blank
      });       
      setPrevBottomScore(bottomScore);
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