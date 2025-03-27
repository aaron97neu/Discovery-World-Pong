import { useEffect, useState, useContext } from 'react';
import {SceneContext} from './SceneContext';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

// class GamePlay {
const GamePlay = ({pongAPIRef}) => {
  const {
    isGamePlaying,
    setgameInstructionProps,
    topScore, setTopScore,
    bottomScore, setBottomScore,
  } = useContext(SceneContext);

  const [prevTopScore, setPrevTopScore] = useState(0);
  const [prevBottomScore, setPrevBottomScore] = useState(0);

  useEffect(() => {
    if (pongAPIRef.current) {
      pongAPIRef.current.registerObserver('game/stats', onGameStats);
    }
  }, [pongAPIRef]);

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

    return null;
}

export default GamePlay;