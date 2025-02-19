import { createContext, useState } from "react";
import * as IMAGES from './loadImages';

const SceneContext = createContext();

const SceneProvider = ({ children }) => {
  const [stateTransition, setStateTransition] = useState('idle');
  const [playerInstructionProps, setPlayerInstructionProps] = useState({
    image: IMAGES.noImage,
    // image: IMAGES.welcomeScreen,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  return (
    <SceneContext.Provider value={{ 
      stateTransition, setStateTransition,
      playerInstructionProps, setPlayerInstructionProps,
      }}>
      {children}
    </SceneContext.Provider>
  );
};

export { SceneContext, SceneProvider};