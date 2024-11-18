import { BaseStateMachine } from 'dw-state-machine';
import * as IMAGES from './loadImages';


/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameStateMachine extends BaseStateMachine {
  // Additional methods or overrides can be added here

  constructor(gameState, sceneContext) {
    console.log('GameStateMachine Entered Constructor'); 
    super(gameState);
    this.sceneContext = sceneContext;
  }

  // Define onEnter<state> and onExit<state> methods for each state
  onEnterIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onEnterIdle();

    // this.sceneContext.setGameboard(false);
    this.sceneContext.setGameboard(true);
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.welcomeScreen,
      position: [0.0, 0.2, 0.0],
      scale: 8.5
    });

    // this.onEnterMoveLeftIntro();

    // this.onEnterMoveRightIntro();

  }

  onEnterMoveLeftIntro() { 
    console.log('GameStateMachine Entered MoveLeftIntro state');
    super.onEnterMoveLeftIntro();

    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.playerInstructionsMoveLeft,
      position: [0.0, 0.3, 0.0],
      scale: 8.4
    });    
  }

  onEnterMoveRightIntro() { 
    console.log('GameStateMachine Entered MoveRightIntro state'); 
    super.onEnterMoveRightIntro();

    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.playerInstructionsMoveRight,
      position: [0.0, 0.3, 0.0],
      scale: 8.4
    });        
  }

  onEnterLevel1() { 
    console.log('GameStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.sceneContext.setGameboard(true);
    this.sceneContext.setLevel('1');
  }

  onEnterLevel2() { 
    console.log('GameStateMachine Entered Level2 state'); 
    super.onEnterLevel2();

    this.sceneContext.setLevel('2');
  }

  onEnterLevel3() { 
    console.log('GameStateMachine Entered Level3 state'); 
    super.onEnterLevel3();

    this.sceneContext.setLevel('3');
  }

}

export default GameStateMachine;