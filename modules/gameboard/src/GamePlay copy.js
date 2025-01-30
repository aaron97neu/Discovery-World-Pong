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
    this.pongAPI.registerObserver('paddle/top', this.onPaddleTop.bind(this));
    this.pongAPI.registerObserver('paddle/bottom', this.onPaddleBottom.bind(this));
  }

  onPaddleTop(message) {
    console.log('Paddle Top Message:', message);
    const paddleTopPositionX = message.position.x;
    console.log('paddleTopPositionX:', paddleTopPositionX);
    this.sceneContext.setTopPaddlePosition(paddleTopPositionX);
  }

  onPaddleBottom(message) {
    console.log('Paddle Bottom Message:', message);
    const paddleBottomPositionX = message.position.x;
    console.log('paddleBottomPositionX:', paddleBottomPositionX);
    this.sceneContext.setBottomPaddlePosition(paddleBottomPositionX);
  }  

  onGamePlay(message) {
    console.log('Game Play Message:', message);
    // const paddleTopPositionX = message.paddle_top.position.x;
    // const paddleBottomPositionX = message.paddle_bottom.position.x;
    // const ballPositionXY = message.ball.position;
    // console.log('paddleTopPositionX:', paddleTopPositionX);
    // console.log('paddleBottomPositionX:', paddleBottomPositionX);
    // console.log('ballPositionXY:', ballPositionXY);
    // this.sceneContext.setTopPaddlePosition(paddleTopPositionX);
    // this.sceneContext.setBottomPaddlePosition(paddleBottomPositionX);
    // this.sceneContext.setBallPosition(ballPositionXY);
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

}

export default GamePlay;