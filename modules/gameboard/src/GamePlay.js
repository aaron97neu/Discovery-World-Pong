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
    if ('game_countdown' in changes) {
      const countdown = changes['game_countdown'];
      this.sceneContext.setCountdown(countdown);
    }

  }


}

export default GamePlay;