import { createContext, useState } from "react";
import * as IMAGES from './loadImages';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [isGame, setIsGame] = useState(false);
  const [playerInstructionProps, setPlayerInstructionProps] = useState({
    image: IMAGES.noImage,
    // image: IMAGES.welcomeScreen,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [levelComplete, setLevelComplete] = useState('0');
  const [level, setLevel] = useState(0);
  const [isGamePlaying, setIsGamePlaying] = useState(false);

  // console.log("start GameContext");

  return (
    <GameContext.Provider value={{ 
      isGame, setIsGame, 
      playerInstructionProps, setPlayerInstructionProps,
      level, setLevel,
      levelComplete, setLevelComplete,
      isGamePlaying, setIsGamePlaying,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider};