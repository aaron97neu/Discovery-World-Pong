/**
 * @file BaseStateMachine.js
 * @class BaseStateMachine
 * @description Implements a state machine using 'javascript-state-machine'.
 */
import StateMachine from 'javascript-state-machine';

// class BaseStateMachine {
export default class BaseStateMachine {
  constructor(pongAPI) {
    this.pongAPI = pongAPI;
    this.bottomPaddleLeft = false;
    this.fsm = new StateMachine({
      init: 'stopped',
      transitions: [
        { name: 'start', from: 'stopped', to: 'idle' },
        { name: 'playerReady', from: 'idle', to: 'intro' },
        { name: 'playerExit', from: 'intro', to: 'idle' },
        { name: 'introComplete', from: 'intro', to: 'moveIntro' },
        { name: 'playerExit', from: 'moveIntro', to: 'idle' },
        { name: 'moveIntroComplete', from: ['idle', 'intro', 'moveIntro'], to: 'level1Intro' },
        { name: 'level1IntroComplete', from: 'level1Intro', to: 'level1' },
        { name: 'playerExit', from: 'level1', to: 'idle' },
        { name: 'level1Complete', from: 'level1', to: 'level2Intro' },
        { name: 'level2IntroComplete', from: 'level2Intro', to: 'level2' },
        { name: 'playerExit', from: 'level2', to: 'idle' },
        { name: 'level2Complete', from: 'level2', to: 'level3Intro' },
        { name: 'level3IntroComplete', from: 'level3Intro', to: 'level3' },
        { name: 'playerExit', from: 'level3', to: 'idle' },
        { name: 'level3Complete', from: 'level3', to: 'outro' },
        { name: 'gameComplete', from: ['idle', 'outro'], to: 'idle' },
        { name: 'stop', from: 'idle', to: 'stopped' },
      ],
      methods: {
        onEnterStopped: this.onEnterStopped.bind(this),
        onLeaveStopped: this.onLeaveStopped.bind(this),
        onEnterIdle: this.onEnterIdle.bind(this),
        onLeaveIdle: this.onLeaveIdle.bind(this),
        onEnterIntro: this.onEnterIntro.bind(this),
        onLeaveIntro: this.onLeaveIntro.bind(this),
        onEnterMoveIntro: this.onEnterMoveIntro.bind(this),
        onLeaveMoveIntro: this.onLeaveMoveIntro.bind(this),
        onEnterLevel1Intro: this.onEnterLevel1Intro.bind(this),
        onLeaveLevel1Intro: this.onLeaveLevel1Intro.bind(this),
        onEnterLevel2Intro: this.onEnterLevel2Intro.bind(this),
        onLeaveLevel2Intro: this.onLeaveLevel2Intro.bind(this),
        onEnterLevel3Intro: this.onEnterLevel3Intro.bind(this),
        onLeaveLevel3Intro: this.onLeaveLevel3Intro.bind(this),
        onEnterLevel1: this.onEnterLevel1.bind(this),
        onLeaveLevel1: this.onLeaveLevel1.bind(this),
        onEnterLevel2: this.onEnterLevel2.bind(this),
        onLeaveLevel2: this.onLeaveLevel2.bind(this),
        onEnterLevel3: this.onEnterLevel3.bind(this),
        onLeaveLevel3: this.onLeaveLevel3.bind(this),
        onEnterOutro: this.onEnterOutro.bind(this),
        onLeaveOutro: this.onLeaveOutro.bind(this),
        onInvalidTransition: function(transition, from, to) {
          console.log("transition '%s' not allowed from state '%s'", transition, from);
        }
      },
    });
  }
  
  startMachine() {
    console.log('BaseStateMachine Entered startMachine'); 
    // this.baseState.addObserver(this, this.onStateChange.bind(this));
    this.pongAPI.registerObserver('game/state', this.onGameState.bind(this));
    this.fsm.start();
    // this.runLoop();
  }

  // /**
  //  * Continuous loop with a sleep time of 5 seconds.
  //  */
  // async runLoop() {
  //   while (true) {
  //     await new Promise(resolve => setTimeout(resolve, 5000));
  //   }
  // }

  /**
   * Callback for game/state topic.
   * @param {object} message - The message received.
   */
  onGameState(message) {
    // console.log('Game State Message:', message);
    const stateTransition = message.transition;
    switch (stateTransition) {
          case 'start':
            this.fsm.start();
              break;
          case 'player_ready':
            this.fsm.playerReady();
            break;
          case 'player_exit':
            this.fsm.playerExit();
            break;
          case 'intro_complete':
            this.fsm.introComplete();
            break;
          case 'move_intro_complete':
            this.fsm.moveIntroComplete();
            break;
          case 'level1_intro_complete':
            this.fsm.level1IntroComplete();
            break;
          case 'level1_complete':
            this.fsm.level1Complete();
            break;
          case 'level2_intro_complete':
            this.fsm.level2IntroComplete();
            break;
          case 'level2_complete':
            this.fsm.level2Complete();
            break;
          case 'level3_intro_complete':
            this.fsm.level3IntroComplete();
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
      // }    
  }
  }
  
  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterStopped() { }
  onLeaveStopped() { }
  onEnterIdle() { 
    this.bottomPaddleLeft = false; 
  }
  onLeaveIdle() { }
  onEnterIntro() { }
  onLeaveIntro() { }
  onEnterMoveIntro() { }
  onLeaveMoveIntro() { }
  onEnterLevel1Intro() { }
  onLeaveLevel1Intro() { }
  onEnterLevel2Intro() { }
  onLeaveLevel2Intro() { }
  onEnterLevel3Intro() { }
  onLeaveLevel3Intro() { }
  onEnterLevel1() { }
  onLeaveLevel1() { }
  onEnterLevel2() { }
  onLeaveLevel2() { }
  onEnterLevel3() { }
  onLeaveLevel3() { }
  onEnterOutro() { }
  onLeaveOutro() { }
 
}