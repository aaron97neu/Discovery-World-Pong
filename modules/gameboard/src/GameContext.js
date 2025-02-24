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


  const [levelStart, setLevelStart] = useState('0');
  const [levelComplete, setLevelComplete] = useState('0');
  const [isLevelPlaying, setIsLevelPlaying] = useState(false);
  const [isGamePlaying, setIsGamePlaying] = useState(false);

  // console.log("start GameContext");

  return (
    <GameContext.Provider value={{ 
      isGame, setIsGame, 
      playerInstructionProps, setPlayerInstructionProps,
      levelStart, setLevelStart,
      levelComplete, setLevelComplete,
      isLevelPlaying, setIsLevelPlaying,
      isGamePlaying, setIsGamePlaying,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider};