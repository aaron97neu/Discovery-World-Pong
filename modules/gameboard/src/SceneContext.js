import { createContext, useState } from "react";
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

const SceneContext = createContext();

const SceneProvider = ({ children }) => {
  const [isGame, setIsGame] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerInstructionProps, setPlayerInstructionProps] = useState({
    image: IMAGES.noImage,
    // image: IMAGES.welcomeScreen,
    position: [0.0, 0.0, 0.0],
    scale: 1.0
  });

  const [playersReady, setPlayersReady] = useState(false);
  const [countdown, setCountdown] = useState(TEXT.countdown_get_ready);
  const [level, setLevel] = useState('1');
  const [levelComplete, setLevelComplete] = useState('0');
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topPaddlePosition, setTopPaddlePosition] = useState(0.5);
  const [topPaddleState, setTopPaddleState] = useState("not_ready");
  const [bottomPaddlePosition, setBottomPaddlePosition] = useState(0.5);
  const [bottomPaddleState, setBottomPaddleState] = useState("not_ready");
  const [ballPosition, setBallPosition] = useState({x: 0.0, y: 0.0});
  const [isPaddleHit, setIsPaddleHit] = useState(false);

  return (
    <SceneContext.Provider value={{ 
      isGame, setIsGame, 
      isPlaying, setIsPlaying,
      playerInstructionProps, setPlayerInstructionProps,
      playersReady, setPlayersReady,
      countdown, setCountdown,
      level, setLevel,
      levelComplete, setLevelComplete,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      topPaddlePosition, setTopPaddlePosition,
      topPaddleState, setTopPaddleState,
      bottomPaddlePosition, setBottomPaddlePosition,
      bottomPaddleState, setBottomPaddleState,
      ballPosition, setBallPosition,
      isPaddleHit, setIsPaddleHit,
      }}>
      {children}
    </SceneContext.Provider>
  );
};

export { SceneContext, SceneProvider};