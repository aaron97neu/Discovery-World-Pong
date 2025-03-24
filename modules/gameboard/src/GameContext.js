import { createContext, useState } from "react";
import * as IMAGES from './loadImages';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [playerInstructionProps, setPlayerInstructionProps] = useState({
    image: IMAGES.noImage,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [isGame, setIsGame] = useState(false);
  const [levelComplete, setLevelComplete] = useState('0');
  const [level, setLevel] = useState(0);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [isAppInitialized, setisAppInitialized] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  return (
    <GameContext.Provider value={{ 
      isGame, setIsGame, 
      playerInstructionProps, setPlayerInstructionProps,
      level, setLevel,
      levelComplete, setLevelComplete,
      isIntroPlaying, setIsIntroPlaying,
      isGamePlaying, setIsGamePlaying,
      isAppInitialized, setisAppInitialized,
      isGameComplete, setIsGameComplete,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider};