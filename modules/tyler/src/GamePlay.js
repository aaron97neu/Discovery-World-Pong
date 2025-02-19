import { useEffect, useState, useContext } from 'react';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

// class GamePlay {
const GamePlay = ({pongAPIRef}) => {
  const {
    setPlayerInstructionProps,
  } = useContext(SceneContext);

  const [prevTopScore, setPrevTopScore] = useState(0);
  const [prevBottomScore, setPrevBottomScore] = useState(0);

  useEffect(() => {
    if (pongAPIRef.current) {
      pongAPIRef.current.registerObserver('game/stats', onGameStats);
    }
  }, [pongAPIRef]);
  
  const onGameStats = (message) => {
    const playerTopScore = message.player_top.score;
    const playerBottomScore = message.player_bottom.score;

    if (playerTopScore > prevTopScore) {
      setPlayerInstructionProps({
        image: IMAGES.TYLERFace_Happy,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.blank
      }); 
    }
    if (playerBottomScore > prevBottomScore) {
      setPlayerInstructionProps({
        image: IMAGES.TYLERFace_Annoyed,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.blank
      });       
    }
  }

  return null;
}

export default GamePlay;