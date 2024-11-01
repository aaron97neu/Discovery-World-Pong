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
  onEnterStopped() { 
    console.log('GameStateMachine Entered Stopped state'); 
  }
  onExitStopped() { console.log('GameStateMachine Exited Stopped state'); }
  onEnterIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    // this.sceneContext.setGameboard(true);

    this.sceneContext.setGameboard(false);

    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.welcomeScreen,
      position: [0.0, 0.2, 0.0],
      scale: 8.5
    });
  }
  onExitIdle() { console.log('GameStateMachine Exited Idle state'); }
  onEnterIntro() { 
    console.log('GameStateMachine Entered Intro state'); 
  }
  onExitIntro() { 
    console.log('GameStateMachine Exited Intro state'); 
  }
  onEnterIntroLeftRight() { 
    console.log('Entered IntroLeftRight state');
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.playerInstructionsMoveLeft,
      position: [0.0, 0.2, 0.0],
      scale: 7.5
    });    
  }
  onExitIntroLeftRight() { console.log('Exited IntroLeftRight state'); }  
  onEnterPlayerLeft() { 
    console.log('GameStateMachine Entered PlayerLeft state'); 
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.playerInstructionsMoveRight,
      position: [0.0, 0.2, 0.0],
      scale: 7.5
    });        
  }
  onExitPlayerLeft() { console.log('GameStateMachine Exited PlayerLeft state'); }
  onEnterPlayerRight() {
     console.log('GameStateMachine Entered PlayerRight state'); 

     this.sceneContext.setGameboard(true);
  }
  onExitPlayerRight() { console.log('GameStateMachine PlayerRight Intro state'); }



  // onEnterLevel1() { 
  //   console.log('GameStateMachine Entered Level1 state');
  // }
//   onExitLevel1() { console.log('GameStateMachine Exited Level1 state'); }
//   onEnterLevel2() { 
//     console.log('GameStateMachine Entered Level2 state'); 
//   }
//   onExitLevel2() { console.log('GameStateMachine Exited Level2 state'); }
//   onEnterLevel3() { 
//     console.log('GameStateMachine Entered Level3 state'); 
//   }
//   onExitLevel3() { console.log('GameStateMachine Exited Level3 state'); }
//   onEnterOutro() { 
//     console.log('GameStateMachine Entered Outro state'); 
//   }
//   onExitOutro() { console.log('GameStateMachine Exited Outro state'); }
}

export default GameStateMachine;