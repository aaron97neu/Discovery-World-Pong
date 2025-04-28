import { createContext, useContext, useState } from "react";
import AudioPlayer from './AudioPlayer';
import * as IMAGES from './loadImages';

const GameContext = createContext();

const useGameContext = () => useContext(GameContext);

const GameProvider = ({ children }) => {
  const [gameInstructionProps, setgameInstructionProps] = useState({
    image: IMAGES.noImage,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [gameStateMachine, setGameStateMachine] = useState(null);
  const [pongAPI, setPongAPI] = useState(null);
  const [audioPlayer] = useState(new AudioPlayer());
  const [volume] = useState(0.5);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);

  return (
    <GameContext.Provider value={{ 
      gameInstructionProps, setgameInstructionProps,
      gameStateMachine, setGameStateMachine,
      pongAPI, setPongAPI,
      audioPlayer,
      volume,
      isGamePlaying, setIsGamePlaying,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export {useGameContext, GameContext, GameProvider};
