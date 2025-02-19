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
        { name: 'startGame', from: 'intro', to: 'level1' },
        { name: 'playerExit', from: 'intro', to: 'idle' },
        // { name: 'introComplete', from: 'intro', to: 'moveLeftIntro' },
        // { name: 'playerExit', from: 'moveLeftIntro', to: 'idle' },
        // { name: 'moveLeftIntroComplete', from: 'moveLeftIntro', to: 'moveRightIntro' },
        // { name: 'playerExit', from: 'moveRightIntro', to: 'idle' },
        // { name: 'startGame', from: 'moveRightIntro', to: 'level1' },
        { name: 'playerExit', from: 'level1', to: 'idle' },
        { name: 'level1Complete', from: 'level1', to: 'level2Intro' },
        { name: 'level2IntroComplete', from: 'level2Intro', to: 'level2' },
        { name: 'playerExit', from: 'level2', to: 'idle' },
        { name: 'level2Complete', from: 'level2', to: 'level3Intro' },
        { name: 'level3IntroComplete', from: 'level3Intro', to: 'level3' },
        { name: 'playerExit', from: 'level3', to: 'idle' },
        { name: 'level3Complete', from: 'level3', to: 'outro' },
        { name: 'gameComplete', from: 'outro', to: 'idle' },
        { name: 'stop', from: 'idle', to: 'stopped' },
      ],
      methods: {
        onEnterStopped: this.onEnterStopped.bind(this),
        onLeaveStopped: this.onLeaveStopped.bind(this),
        onEnterIdle: this.onEnterIdle.bind(this),
        onLeaveIdle: this.onLeaveIdle.bind(this),
        onEnterIntro: this.onEnterIntro.bind(this),
        onLeaveIntro: this.onLeaveIntro.bind(this),
        // onEnterMoveLeftIntro: this.onEnterMoveLeftIntro.bind(this),
        // onLeaveMoveLeftIntro: this.onLeaveMoveLeftIntro.bind(this),
        // onEnterMoveRightIntro: this.onEnterMoveRightIntro.bind(this),
        // onLeaveMoveRightIntro: this.onLeaveMoveRightIntro.bind(this),
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
   * Callback for game/state topic.
   * @param {object} message - The message received.
   */
  onGameState(message) {
    console.log('Game State Message:', message);
    // if ('game_state_transition' in changes) {
    //   const stateTransition = changes['game_state_transition'];
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
          // case 'intro_complete':
          //   this.fsm.introComplete();
          //   break;
          // case 'move_left_intro_complete':
          //   this.fsm.moveLeftIntroComplete();
          //   break;
          case 'level2_intro_complete':
            this.fsm.level2IntroComplete();
            break;
          case 'level3_intro_complete':
            this.fsm.level3IntroComplete();
            break;
          case 'start_game':
            this.fsm.startGame();
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
      // }    
  }

  // /**
  //  * Handle state changes from BaseState.
  //  * @param {Object} changes - The changed state values.
  //  */
  // onStateChange(changes) {
  //   if ('game_state_transition' in changes) {
  //     const stateTransition = changes['game_state_transition'];
  //     switch (stateTransition) {
  //         case 'start':
  //             this.fsm.start();
  //             break;
  //         case 'player_ready':
  //           this.fsm.playerReady();
  //           break;
  //         case 'player_exit':
  //           this.fsm.playerExit();
  //           break;
  //         case 'intro_complete':
  //           this.fsm.introComplete();
  //           break;
  //         case 'move_left_intro_complete':
  //           this.fsm.moveLeftIntroComplete();
  //           break;
  //         case 'start_game':
  //           this.fsm.startGame();
  //           break;
  //         case 'level1_complete':
  //           this.fsm.level1Complete();
  //           break;
  //         case 'level2_complete':
  //             this.fsm.level2Complete();
  //             break;
  //         case 'level3_complete':
  //             this.fsm.level3Complete();
  //             break;
  //         case 'game_complete':
  //             this.fsm.gameComplete();
  //             break;
  //         case 'stop':
  //             this.fsm.stop();
  //             break;
  //         default:
  //             console.log("Unknown state transition:", stateTransition);
  //     }
  //   }

    // if ('bottom_paddle_position' in changes) {
    //   if (this.fsm.is('intro')) {
    //     const bottomPaddlePosition = changes['bottom_paddle_position'];
    //     if (bottomPaddlePosition < -20) {
    //       this.bottomPaddleLeft = true;
    //     }
    //     if (this.bottomPaddleLeft && bottomPaddlePosition > 20) {
    //       this.fsm.startGame();
    //     }
    //   }
    // }
  }
  
  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterStopped() { console.log('Entered Stopped state'); }
  onLeaveStopped() { console.log('Exited Stopped state'); }
  onEnterIdle() { 
    console.log('Entered Idle state');
    this.bottomPaddleLeft = false; 
  }
  onLeaveIdle() { console.log('Exited Idle state'); }
  onEnterIntro() { console.log('Entered Intro state'); }
  onLeaveIntro() { console.log('Exited Intro state'); }
  // onEnterMoveLeftIntro() { console.log('Entered MoveLeftIntro state'); }
  // onLeaveMoveLeftIntro() { console.log('Exited MoveLeftIntro state'); }
  // onEnterMoveRightIntro() { console.log('Entered MoveRightIntro state'); }
  // onLeaveMoveRightIntro() { console.log('Exited MoveRightIntro state'); }
  onEnterLevel2Intro() { console.log('Entered Level1Intro state'); }
  onLeaveLevel2Intro() { console.log('Exited Level1Intro state'); }
  onEnterLevel3Intro() { console.log('Entered Level2Intro state'); }
  onLeaveLevel3Intro() { console.log('Exited Level2Intro state'); }
  onEnterLevel1() { console.log('Entered Level1 state'); }
  onLeaveLevel1() { console.log('Exited Level1 state'); }
  onEnterLevel2() { console.log('Entered Level2 state'); }
  onLeaveLevel2() { console.log('Exited Level2 state'); }
  onEnterLevel3() { console.log('Entered Level3 state'); }
  onLeaveLevel3() { console.log('Exited Level3 state'); }
  onEnterOutro() { console.log('Entered Outro state'); }
  onLeaveOutro() { console.log('Exited Outro state'); }
 
}