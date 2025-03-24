import { createContext, useState } from "react";
import * as IMAGES from './loadImages';

const SceneContext = createContext();

const SceneProvider = ({ children }) => {
  const [playerInstructionProps, setPlayerInstructionProps] = useState({
    image: IMAGES.noImage,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [stateTransition, setStateTransition] = useState('idle');
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);

  return (
    <SceneContext.Provider value={{ 
      playerInstructionProps, setPlayerInstructionProps,
      stateTransition, setStateTransition,
      isGamePlaying, setIsGamePlaying,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      }}>
      {children}
    </SceneContext.Provider>
  );
};

export { SceneContext, SceneProvider};