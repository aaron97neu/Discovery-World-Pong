import { createContext, useContext, useState } from "react";
import * as TEXT from './loadText';

const GamePlayContext = createContext();
const useGamePlayContext = () => useContext(GamePlayContext);

const GamePlayProvider = ({ children }) => {
  const [speed, setSpeed] = useState(200);
  const [level, setLevel] = useState(0);
  const [countdown, setCountdown] = useState(TEXT.blank);
  const [topScore, setTopScore] = useState(0);
  const [bottomScore, setBottomScore] = useState(0);
  const [topPaddlePosition, setTopPaddlePosition] = useState(0.5);
  const [topPaddleState, setTopPaddleState] = useState("not_ready");
  const [bottomPaddlePosition, setBottomPaddlePosition] = useState(0.5);
  const [bottomPaddleState, setBottomPaddleState] = useState("not_ready");
  const [ballPosition, setBallPosition] = useState({x: 0.0, y: 0.0});
  const [isTopPaddleReset, setIsTopPaddleReset] = useState(false);
  const [isBottomPaddleReset, setIsBottomPaddleReset] = useState(false);
  const [isBallReset, setIsBallReset] = useState(true);

  return (
    <GamePlayContext.Provider value={{
      speed, setSpeed,
      level, setLevel,
      countdown, setCountdown,
      topScore, setTopScore,
      bottomScore, setBottomScore,
      topPaddlePosition, setTopPaddlePosition,
      topPaddleState, setTopPaddleState,
      bottomPaddlePosition, setBottomPaddlePosition,
      bottomPaddleState, setBottomPaddleState,
      ballPosition, setBallPosition,
      isTopPaddleReset, setIsTopPaddleReset,
      isBottomPaddleReset, setIsBottomPaddleReset,
      isBallReset, setIsBallReset,
    }}>
      {children}
    </GamePlayContext.Provider>
  );
};

export { useGamePlayContext, GamePlayContext, GamePlayProvider};