import { createContext, useContext, useState } from "react";
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
  const [gamePlayStateMachine, setGamePlayStateMachine] = useState(null);
  const [pongAPI, setPongAPI] = useState(null);
  const [parentStateMachine, setParentStateMachine] = useState(null);
  const [childStateMachine, setChildStateMachine] = useState(null);
  const [isGamePlayComplete, setIsGamePlayComplete] = useState(true);
  
  return (
    <GameContext.Provider value={{ 
      gameInstructionProps, setgameInstructionProps,
      gameStateMachine, setGameStateMachine,
      gamePlayStateMachine, setGamePlayStateMachine,
      pongAPI, setPongAPI,
      parentStateMachine, setParentStateMachine,
      childStateMachine, setChildStateMachine,
      isGamePlayComplete, setIsGamePlayComplete,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export { useGameContext, GameContext, GameProvider};