/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GamePlay {
  // Additional methods or overrides can be added here

  constructor(gameState, sceneContext) {
    console.log('GamePlay Entered Constructor'); 
    this.gameState = gameState;
    this.sceneContext = sceneContext;
    this.gameState.addObserver(this, this.onStateChange.bind(this));
  }

  /**
   * Handle state changes from BaseState.
   * @param {Object} changes - The changed state values.
   */
  onStateChange(changes) {
    console.log('state change: ', changes);
    if ('game_countdown' in changes) {
      const countdown = changes['game_countdown'];
      this.sceneContext.setCountdown(countdown);
    }

    if ('game_top_score' in changes) {
      const topScore = changes['game_top_score'];
      this.sceneContext.setTopScore(topScore);
    }
    if ('game_bottom_score' in changes) {
      const bottomScore = changes['game_bottom_score'];
      this.sceneContext.setBottomScore(bottomScore);
    }

    if ('game_top_paddle_position' in changes) {
      const topPaddlePosition = changes['game_top_paddle_position'];
      this.sceneContext.setTopPaddlePosition(topPaddlePosition);
    }
    if ('game_bottom_paddle_position' in changes) {
      const bottomPaddlePosition = changes['game_bottom_paddle_position'];
      this.sceneContext.setBottomPaddlePosition(bottomPaddlePosition);
    }

    if ('game_ball_position' in changes) {
      const ballPosition = changes['game_ball_position'];
      console.log("ballPositon: ", ballPosition);
      this.sceneContext.setBallPosition({x: ballPosition.x, y: ballPosition.y});
    }

  }

}

export default GamePlay;