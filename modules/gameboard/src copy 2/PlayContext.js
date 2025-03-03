import { createContext, useState } from "react";
import * as TEXT from './loadText';

const PlayContext = createContext();

const PlayProvider = ({ children }) => {
  const [countdown, setCountdown] = useState(TEXT.blank);
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topPaddlePosition, setTopPaddlePosition] = useState(0.5);
  const [topPaddleState, setTopPaddleState] = useState("not_ready");
  const [bottomPaddlePosition, setBottomPaddlePosition] = useState(0.5);
  const [bottomPaddleState, setBottomPaddleState] = useState("not_ready");
  const [ballPosition, setBallPosition] = useState({x: 0.0, y: 0.0});
  const [isPaddleHit, setIsPaddleHit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resetPaddles, setResetPaddles] = useState(false);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [includeCountDown, setIncludeCountDown] = useState(true);
  const [isBallReset, setIsBallReset] = useState(false);
  const [isTopPaddleReset, setIsTopPaddleReset] = useState(false);
  const [isBottomPaddleReset, setIsBottomPaddleReset] = useState(false);
  const [prevLevel, setPrevLevel] = useState(0);
  const [stateMachine, setStateMachine] = useState(null);
  const [forcePaddleRerender, setForcePaddleRerender] = useState(false);
  const [forceBallRerender, setForceBallRerender] = useState(false);
  const [resetBall, setResetBall] = useState(false);
  const [isDontPlay, setIsDontPlay] = useState(true);
  const [isLevelComplete, setIsLevlComplete] = useState(false);
  const [isScoreComplete, setIsScoreComplete] = useState(false);

  // console.log("start PlayContext");

  return (
    <PlayContext.Provider value={{ 
      countdown, setCountdown,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      topPaddlePosition, setTopPaddlePosition,
      topPaddleState, setTopPaddleState,
      bottomPaddlePosition, setBottomPaddlePosition,
      bottomPaddleState, setBottomPaddleState,
      ballPosition, setBallPosition,
      isPaddleHit, setIsPaddleHit,
      isPlaying, setIsPlaying,
      resetPaddles, setResetPaddles,
      isCountdownComplete, setIsCountdownComplete,
      includeCountDown, setIncludeCountDown,
      isBallReset, setIsBallReset,
      isTopPaddleReset, setIsTopPaddleReset,
      isBottomPaddleReset, setIsBottomPaddleReset,
      prevLevel, setPrevLevel,
      stateMachine, setStateMachine,
      forcePaddleRerender, setForcePaddleRerender,
      forceBallRerender, setForceBallRerender,
      resetBall, setResetBall,
      isDontPlay, setIsDontPlay,
      isLevelComplete, setIsLevlComplete,
      isScoreComplete, setIsScoreComplete,
      }}>
      {children}
    </PlayContext.Provider>
  );
};



export { PlayContext, PlayProvider};