import { BaseStateMachine } from 'dw-state-machine';
import * as IMAGES from './loadImages';
// import PlayerInstructionsHud from './PlayerInstructionHud';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameStateMachine extends BaseStateMachine {
  // Additional methods or overrides can be added here

  static gameHudProps = {
    score: { image: IMAGES.score, position: [6.9, 2.2, 0.0], scale: 4.0 },
    level: { image: IMAGES.level01, position: [-6.2, 3.9, 0.0], scale: 0.7 },
    countdown: { image: IMAGES.getReady, position: [0.0, 0.0, 0.0], scale: 1.5 },
  };

  static welcomeScreenProps = {
    playerInstructions: { image: IMAGES.welcomeScreen, position: [0.0, 0.3, 0.0], scale: 8.8 },
  };  
  
  static getReadyProps = {
    playerInstructions: { image: IMAGES.getReady, position: [0.0, 0.3, 0.0], scale: 8.8 },
  };

  static gameboardProps = { image: IMAGES.gameboard, position: [0,0,-5], scale: 22.0 };

  setMainSceneRef(mainSceneRef) {
    this.mainSceneRef = mainSceneRef;
  }

  changeProps(props) {
    if (this.mainSceneRef.current) {
      console.log("GameStateMachine changeProps", props);
      this.mainSceneRef.current.changeProps(props);
    } 
  }

  // Define onEnter<state> and onExit<state> methods for each state
  onEnterStopped() { 
    console.log('GameStateMachine Entered Stopped state'); 
    // this.changeProps(PlayerInstructionsHud.defaultSubProps);   
  }
  onExitStopped() { console.log('GameStateMachine Exited Stopped state'); }
  onEnterIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    this.changeProps(GameStateMachine.welcomeScreenProps);   
  }
  onExitIdle() { console.log('GameStateMachine Exited Idle state'); }
  onEnterIntro() { 
    console.log('GameStateMachine Entered Intro state'); 
    this.changeProps(GameStateMachine.welcomeScreenProps);   
  }
  onExitIntro() { console.log('GameStateMachine Exited Intro state'); }
  onEnterLevel1() { 
    console.log('Entered Level1 state');
    this.changeProps(GameStateMachine.getReadyProps);
  }
  onExitLevel1() { console.log('GameStateMachine Exited Level1 state'); }
  onEnterLevel2() { 
    console.log('Entered Level2 state'); 
    this.changeProps(GameStateMachine.getReadyProps);
  }
  onExitLevel2() { console.log('GameStateMachine Exited Level2 state'); }
  onEnterLevel3() { 
    console.log('Entered Level3 state'); 
    this.changeProps(GameStateMachine.getReadyProps);
  }
  onExitLevel3() { console.log('GameStateMachine Exited Level3 state'); }
  onEnterOutro() { 
    console.log('Entered Outro state'); 
    this.changeProps(GameStateMachine.getReadyProps);
  }
  onExitOutro() { console.log('GameStateMachine Exited Outro state'); }
}

export default GameStateMachine;