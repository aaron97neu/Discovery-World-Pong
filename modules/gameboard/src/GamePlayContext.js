import { createContext, useContext, useState } from "react";
import * as TEXT from './loadText';

const GamePlayContext = createContext();
const useGamePlayContext = () => useContext(GamePlayContext);

const GamePlayProvider = ({ children }) => {
  const [level, setLevel] = useState(0);
  const [countdown, setCountdown] = useState(TEXT.blank);
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topPaddlePosition, setTopPaddlePosition] = useState(0.5);
  const [topPaddleState, setTopPaddleState] = useState("not_ready");
  const [topPaddleStateTransition, setTopPaddleStateTransition] = useState("not_ready");
  const [bottomPaddlePosition, setBottomPaddlePosition] = useState(0.5);
  const [bottomPaddleState, setBottomPaddleState] = useState("not_ready");
  const [bottomPaddleStateTransition, setBottomPaddleStateTransition] = useState("not_ready");
  const [ballPosition, setBallPosition] = useState({x: 0.0, y: 0.0});
  const [isPaddleHit, setIsPaddleHit] = useState(false);
  const [resetPaddles, setResetPaddles] = useState(false);
  const [includeCountDown, setIncludeCountDown] = useState(true);
  const [isTopPaddleReset, setIsTopPaddleReset] = useState(false);
  const [isBottomPaddleReset, setIsBottomPaddleReset] = useState(false);
  const [isBallReset, setIsBallReset] = useState(true);
  const [stateMachine, setStateMachine] = useState(null);
  const [forcePaddleRerender, setForcePaddleRerender] = useState(false);
  const [forceBallRerender, setForceBallRerender] = useState(false);
  const [resetBall, setResetBall] = useState(false);
  const [startBall, setStartBall] = useState(false);
  const [isDontPlay, setIsDontPlay] = useState(true);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [isNoCountdownComplete, setIsNoCountdownComplete] = useState(false);
  const [isCollidersEnabled, setIsCollidersEnabled] = useState(true);
  const [test, setTest] = useState(0);
  const [resetComplete, setResetComplete] = useState(false);

  return (
    <GamePlayContext.Provider value={{
      level, setLevel,
      countdown, setCountdown,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      topPaddlePosition, setTopPaddlePosition,
      topPaddleState, setTopPaddleState,
      topPaddleStateTransition, setTopPaddleStateTransition,
      bottomPaddlePosition, setBottomPaddlePosition,
      bottomPaddleState, setBottomPaddleState,
      bottomPaddleStateTransition, setBottomPaddleStateTransition,
      ballPosition, setBallPosition,
      isPaddleHit, setIsPaddleHit,
      resetPaddles, setResetPaddles,
      includeCountDown, setIncludeCountDown,
      isTopPaddleReset, setIsTopPaddleReset,
      isBottomPaddleReset, setIsBottomPaddleReset,
      isBallReset, setIsBallReset,
      stateMachine, setStateMachine,
      forcePaddleRerender, setForcePaddleRerender,
      forceBallRerender, setForceBallRerender,
      resetBall, setResetBall,
      startBall, setStartBall,
      isDontPlay, setIsDontPlay,
      isCountdownComplete, setIsCountdownComplete,
      isNoCountdownComplete, setIsNoCountdownComplete,
      isCollidersEnabled, setIsCollidersEnabled,
      test, setTest,
      resetComplete, setResetComplete,
    }}>
      {children}
    </GamePlayContext.Provider>
  );
};

export { useGamePlayContext, GamePlayContext, GamePlayProvider};