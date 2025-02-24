import { createContext, useState } from "react";
import * as TEXT from './loadText';

// Define the PlayState enum
const PlayState = {
  IDLE: 'idle',
  COUNTDOWN: 'countdown',
  PADDLE_RESET: 'paddle_reset',
  RESET: 'reset',
  PLAY: 'play',
  TOP_GOAL: 'top_goal',
  BOTOM_GOAL: 'bottom_goal',
};

const PlayContext = createContext();

const PlayProvider = ({ children }) => {
  const [countdown, setCountdown] = useState(TEXT.blank);
  const [level, setLevel] = useState('1'); 
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topPaddlePosition, setTopPaddlePosition] = useState(0.5);
  const [topPaddleState, setTopPaddleState] = useState("not_ready");
  const [bottomPaddlePosition, setBottomPaddlePosition] = useState(0.5);
  const [bottomPaddleState, setBottomPaddleState] = useState("not_ready");
  const [ballPosition, setBallPosition] = useState({x: 0.0, y: 0.0});
  const [isPaddleHit, setIsPaddleHit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaddlesReset, setIsPaddlesReset] = useState(false);
  const [resetPaddles, setResetPaddles] = useState(false);
  const [playState, setPlayState] = useState(PlayState.IDLE);

  // console.log("start PlayContext");

  return (
    <PlayContext.Provider value={{ 
      countdown, setCountdown,
      level, setLevel,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      topPaddlePosition, setTopPaddlePosition,
      topPaddleState, setTopPaddleState,
      bottomPaddlePosition, setBottomPaddlePosition,
      bottomPaddleState, setBottomPaddleState,
      ballPosition, setBallPosition,
      isPaddleHit, setIsPaddleHit,
      isPlaying, setIsPlaying,
      isPaddlesReset, setIsPaddlesReset,
      resetPaddles, setResetPaddles,
      playState, setPlayState,
      }}>
      {children}
    </PlayContext.Provider>
  );
};

export { PlayContext, PlayProvider, PlayState};