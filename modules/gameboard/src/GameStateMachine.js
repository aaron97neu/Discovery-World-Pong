import { BaseStateMachine } from 'dw-state-machine';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameStateMachine extends BaseStateMachine {
  // Additional methods or overrides can be added here
    
  // Define onEnter<state> and onExit<state> methods for each state
  onEnterStopped() { console.log('GameStateMachine Entered Stopped state'); }
  onExitStopped() { console.log('GameStateMachine Exited Stopped state'); }
  onEnterIdle() { console.log('Entered Idle state'); }
  onExitIdle() { console.log('GameStateMachine Exited Idle state'); }
  onEnterIntro() { console.log('Entered Intro state'); }
  onExitIntro() { console.log('GameStateMachine Exited Intro state'); }
  onEnterLevel1() { console.log('Entered Level1 state'); }
  onExitLevel1() { console.log('GameStateMachine Exited Level1 state'); }
  onEnterLevel2() { console.log('Entered Level2 state'); }
  onExitLevel2() { console.log('GameStateMachine Exited Level2 state'); }
  onEnterLevel3() { console.log('Entered Level3 state'); }
  onExitLevel3() { console.log('GameStateMachine Exited Level3 state'); }
  onEnterOutro() { console.log('Entered Outro state'); }
  onExitOutro() { console.log('GameStateMachine Exited Outro state'); }
}

export default GameStateMachine;