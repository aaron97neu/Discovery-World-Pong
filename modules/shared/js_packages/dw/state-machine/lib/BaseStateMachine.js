/**
 * @file BaseStateMachine.js
 * @class BaseStateMachine
 * @description Implements a state machine using 'javascript-state-machine'.
 */

import StateMachine from 'javascript-state-machine';
import { BaseState } from './BaseState.js';

// class BaseStateMachine {
export default class BaseStateMachine {
    constructor(baseState) {
    this.baseState = baseState;
    this.fsm = new StateMachine({
      init: 'stopped',
      transitions: [
        { name: 'start', from: 'stopped', to: 'idle' },
        { name: 'playerReady', from: 'idle', to: 'intro' },
        { name: 'introComplete', from: 'intro', to: 'level1' },
        { name: 'gameComplete', from: 'intro', to: 'idle' },
        { name: 'level1Complete', from: 'level1', to: 'level2' },
        { name: 'gameComplete', from: 'level1', to: 'idle' },
        { name: 'level2Complete', from: 'level2', to: 'level3' },
        { name: 'gameComplete', from: 'level2', to: 'idle' },
        { name: 'level3Complete', from: 'level3', to: 'outro' },
        { name: 'gameComplete', from: 'outro', to: 'idle' },
        { name: 'stop', from: 'idle', to: 'stopped' },
      ],
      methods: {
        onEnterStopped: this.onEnterStopped.bind(this),
        onExitStopped: this.onExitStopped.bind(this),
        onEnterIdle: this.onEnterIdle.bind(this),
        onExitIdle: this.onExitIdle.bind(this),
        onEnterIntro: this.onEnterIntro.bind(this),
        onExitIntro: this.onExitIntro.bind(this),
        onEnterLevel1: this.onEnterLevel1.bind(this),
        onExitLevel1: this.onExitLevel1.bind(this),
        onEnterLevel2: this.onEnterLevel2.bind(this),
        onExitLevel2: this.onExitLevel2.bind(this),
        onEnterLevel3: this.onEnterLevel3.bind(this),
        onExitLevel3: this.onExitLevel3.bind(this),
        onEnterOutro: this.onEnterOutro.bind(this),
        onExitOutro: this.onExitOutro.bind(this),
      },
    });
  }

  startMachine() {
    this.baseState.addObserver(this, this.onStateChange.bind(this));
    this.fsm.start();
    // this.runLoop();
  }

  /**
   * Continuous loop with a sleep time of 5 seconds.
   */
  async runLoop() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Add any periodic tasks here
    }
  }

  /**
   * Handle state changes from BaseState.
   * @param {Object} changes - The changed state values.
   */
  onStateChange(changes) {
    console.log('BaseStateMachine onStateChange: d1 %s', changes);
    if ('game_state_transition' in changes) {
      const stateTransition = changes['game_state_transition'];
      console.log('BaseStateMachine onStateChange: d2 %s', stateTransition);

      switch (stateTransition) {
          case 'start':
              this.fsm.start();
              break;
          case 'player_ready':
              this.fsm.playerReady();
              break;
          case 'intro_complete':
              this.fsm.introComplete();
              break;
          case 'level1_complete':
              this.fsm.level1Complete();
              break;
          case 'level2_complete':
              this.fsm.level2Complete();
              break;
          case 'level3_complete':
              this.fsm.level3Complete();
              break;
          case 'game_complete':
              this.fsm.gameComplete();
              break;
          case 'stop':
              this.fsm.stop();
              break;
          default:
              console.log("Unknown state transition:", stateTransition);
      }
    }
  }
  
  // Define onEnter<state> and onExit<state> methods for each state
  onEnterStopped() { console.log('Entered Stopped state'); }
  onExitStopped() { console.log('Exited Stopped state'); }
  onEnterIdle() { console.log('Entered Idle state'); }
  onExitIdle() { console.log('Exited Idle state'); }
  onEnterIntro() { console.log('Entered Intro state'); }
  onExitIntro() { console.log('Exited Intro state'); }
  onEnterLevel1() { console.log('Entered Level1 state'); }
  onExitLevel1() { console.log('Exited Level1 state'); }
  onEnterLevel2() { console.log('Entered Level2 state'); }
  onExitLevel2() { console.log('Exited Level2 state'); }
  onEnterLevel3() { console.log('Entered Level3 state'); }
  onExitLevel3() { console.log('Exited Level3 state'); }
  onEnterOutro() { console.log('Entered Outro state'); }
  onExitOutro() { console.log('Exited Outro state'); }
  
}