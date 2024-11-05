import { createContext, useState } from "react";
import * as IMAGES from './loadImages';

const SceneContext = createContext();

const SceneProvider = ({ children }) => {
  const [isGameboard, setGameboard] = useState(true);
  const [playerInstructionProps, setPlayerInstructionProps] = useState({
    image: IMAGES.noImage,
    // image: IMAGES.welcomeScreen,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [countdown, setCountdown] = useState('GET READY');
  const [level, setLevel] = useState('1');
  const [topScore, setTopScore] = useState('0');
  const [bottomScore, setBottomScore] = useState('0');

  return (
    <SceneContext.Provider value={{ 
      isGameboard, setGameboard, 
      playerInstructionProps, setPlayerInstructionProps,
      countdown, setCountdown,
      level, setLevel,
      topScore, setTopScore,
      bottomScore, setBottomScore
      }}>
      {children}
    </SceneContext.Provider>
  );
};

export { SceneContext, SceneProvider};