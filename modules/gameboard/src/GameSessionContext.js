import { createContext, useState } from "react";
import * as IMAGES from './loadImages';

const GameSessionContext = createContext();

const GameSessionProvider = ({ children }) => {
  const [gameInstructionProps, setgameInstructionProps] = useState({
    image: IMAGES.noImage,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [isAppInitialized, setisAppInitialized] = useState(false);
  const [level, setLevel] = useState(0);
  // const [isGamePlay, setIsGamePlay] = useState(false);
  // const [levelComplete, setLevelComplete] = useState('0');
  // const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  // const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [isGameSessionComplete, setIsGameSessionComplete] = useState(false);
  const [isGamePlayComplete, setIsGamePlayComplete] = useState(true);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isLevelIntroComplete, setIsLevelIntroComplete] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  return (
    <GameSessionContext.Provider value={{ 
      gameInstructionProps, setgameInstructionProps,
      isAppInitialized, setisAppInitialized,
      level, setLevel,
      // isGame, setIsGame, 
      // levelComplete, setLevelComplete,
      // isIntroPlaying, setIsIntroPlaying,
      // isGamePlaying, setIsGamePlaying,
      isGameSessionComplete, setIsGameSessionComplete,
      isGamePlayComplete, setIsGamePlayComplete,
      isLevelIntroComplete, setIsLevelIntroComplete,
      isIntroComplete, setIsIntroComplete,
      isLevelComplete, setIsLevelComplete,
      }}>
      {children}
    </GameSessionContext.Provider>
  );
};

export { GameSessionContext, GameSessionProvider};