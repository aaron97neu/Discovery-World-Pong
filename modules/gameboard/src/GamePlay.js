/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GamePlay {
  // Additional methods or overrides can be added here

  constructor(pongAPI, sceneContext) {
    console.log('GamePlay Entered Constructor'); 
    this.pongAPI = pongAPI;
    this.sceneContext = sceneContext;
    this.pongAPI.registerObserver('game/play', this.onGamePlay.bind(this));
    this.pongAPI.registerObserver('game/state', this.onGameState.bind(this));
  }

  onGamePlay(message) {
    console.log('Game Play Message:', message);
    const paddleTopPositionX = message.paddleTop.position.x;
    const paddleBottomPositionX = message.paddleBottom.position.x;
    const ballPositionXY = message.ball.position;
    console.log('paddleTopPositionX:', paddleTopPositionX);
    console.log('paddleBottomPositionX:', paddleBottomPositionX);
    console.log('ballPositionXY:', ballPositionXY);
    this.sceneContext.setTopPaddlePosition(paddleTopPositionX);
    this.sceneContext.setBottomPaddlePosition(paddleBottomPositionX);
    this.sceneContext.setBallPosition(ballPositionXY);
  }

  onGameState(message) {
    console.log('Game State Message:', message);
    // // Example of updating game stats
    // const statsMessage = {
    //     player1: { score: 10, count_down: 5 },
    //     player2: { score: 8, count_down: 5 }
    // };
    // this.pongAPI.updateGameStats(statsMessage);
  }

  // /**
  //  * Handle state changes from BaseState.
  //  * @param {Object} changes - The changed state values.
  //  */
  // onGamePlayUpdate(changes) {
  //   console.log('state change: ', changes);
  //   if ('game_countdown' in changes) {
  //     const countdown = changes['game_countdown'];
  //     this.sceneContext.setCountdown(countdown);
  //   }

  //   if ('game_top_score' in changes) {
  //     const topScore = changes['game_top_score'];
  //     this.sceneContext.setTopScore(topScore);
  //   }
  //   if ('game_bottom_score' in changes) {
  //     const bottomScore = changes['game_bottom_score'];
  //     this.sceneContext.setBottomScore(bottomScore);
  //   }

  //   if ('game_top_paddle_position' in changes) {
  //     const topPaddlePosition = changes['game_top_paddle_position'];
  //     this.sceneContext.setTopPaddlePosition(topPaddlePosition);
  //   }
  //   if ('game_bottom_paddle_position' in changes) {
  //     const bottomPaddlePosition = changes['game_bottom_paddle_position'];
  //     this.sceneContext.setBottomPaddlePosition(bottomPaddlePosition);
  //   }

  //   if ('game_ball_position' in changes) {
  //     const ballPosition = changes['game_ball_position'];
  //     console.log("ballPositon: ", ballPosition);
  //     this.sceneContext.setBallPosition({x: ballPosition.x, y: ballPosition.y});
  //   }

  // }

}

export default GamePlay;