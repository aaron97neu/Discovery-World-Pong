/**
 * @file BaseStateMachine.js
 * @class BaseStateMachine
 * @description Implements a state machine using 'javascript-state-machine'.
 */
import StateMachine from 'javascript-state-machine';

const createBaseGameStateMachine = (pongAPI) => {
  const fsm = new StateMachine({
      init: 'stopped',
      transitions: [
        { name: 'start', from: 'stopped', to: 'idle' },
        { name: 'playerReady', from: 'idle', to: 'intro' },
        { name: 'introComplete', from: 'intro', to: 'moveIntro' },
        { name: 'moveIntroComplete', from: ['idle', 'intro', 'moveIntro'], to: 'level1Intro' },
        { name: 'level1IntroComplete', from: 'level1Intro', to: 'level1' },
        { name: 'level1Complete', from: 'level1', to: 'level2Intro' },
        { name: 'level2IntroComplete', from: 'level2Intro', to: 'level2' },
        { name: 'level2Complete', from: 'level2', to: 'level3Intro' },
        { name: 'level3IntroComplete', from: 'level3Intro', to: 'level3' },
        { name: 'level3Complete', from: 'level3', to: 'outro' },
        { name: 'gameComplete', from: ['idle', 'outro'], to: 'idle' },
        { name: 'playerExit', from: ['intro', 'moveIntro', 'level1', 'level2', 'level3'], to: 'idle' },
        { name: 'stop', from: 'idle', to: 'stopped' },
      ],
      methods: {
        // onEnterStopped: () => { console.log('BaseGameStateMachine Enter Stopped state'); },
        // onLeaveStopped: () => { console.log('BaseGameStateMachine Leave Stopped state'); },
        // onEnterIdle: () => { console.log('BaseGameStateMachine Enter Idle state'); },
        // onLeaveIdle: () => { console.log('BaseGameStateMachine Leave Idle state'); },
        // onEnterIntro: () => { console.log('BaseGameStateMachine Enter Intro state'); },
        // onLeaveIntro: () => { console.log('BaseGameStateMachine Leave Intro state'); },
        // onEnterMoveIntro: () => { console.log('BaseGameStateMachine Enter MoveIntro state'); },
        // onLeaveMoveIntro: () => { console.log('BaseGameStateMachine Leave MoveIntro state'); },
        // onEnterLevel1Intro: () => { console.log('BaseGameStateMachine Enter Level1Intro state'); },
        // onLeaveLevel1Intro: () => { console.log('BaseGameStateMachine Leave Level1Intro state'); },
        // onEnterLevel2Intro: () => { console.log('BaseGameStateMachine Enter Level2Intro state'); },
        // onLeaveLevel2Intro: () => { console.log('BaseGameStateMachine Leave Level2Intro state'); },
        // onEnterLevel3Intro: () => { console.log('BaseGameStateMachine Enter Level3Intro state'); },
        // onLeaveLevel3Intro: () => { console.log('BaseGameStateMachine Leave Level3Intro state'); },
        // onEnterLevel1: () => { console.log('BaseGameStateMachine Enter Level1 state'); },
        // onLeaveLevel1: () => { console.log('BaseGameStateMachine Leave Level1 state'); },
        // onEnterLevel2: () => { console.log('BaseGameStateMachine Enter Level2 state'); },
        // onLeaveLevel2: () => { console.log('BaseGameStateMachine Leave Level2 state'); },
        // onEnterLevel3: () => { console.log('BaseGameStateMachine Enter Level3 state'); },
        // onLeaveLevel3: () => { console.log('BaseGameStateMachine Leave Level3 state'); },
        // onEnterOutro: () => { console.log('BaseGameStateMachine Enter Outro state'); },
        // onLeaveOutro: () => { console.log('BaseGameStateMachine Leave Outro state'); },
        onInvalidTransition: function(transition, from, to) {
          console.log("transition '%s' not allowed from state '%s'", transition, from);
          return false;
        },
      },
    });
  
    const onGameState = (message) => {
      // console.log(`message: ${JSON.stringify(message, null, 2)}`);
      const stateTransition = message.transition;
      switch (stateTransition) {
        case 'start':
          fsm.start();
          break;
        case 'player_ready':
          fsm.playerReady();
          break;
        case 'player_exit':
          fsm.playerExit();
          break;
        case 'intro_complete':
          fsm.introComplete();
          break;
        case 'move_intro_complete':
          fsm.moveIntroComplete();
          break;
        case 'level1_intro_complete':
          fsm.level1IntroComplete();
          break;
        case 'level1_complete':
          fsm.level1Complete();
          break;
        case 'level2_intro_complete':
          fsm.level2IntroComplete();
          break;
        case 'level2_complete':
          fsm.level2Complete();
          break;
        case 'level3_intro_complete':
          fsm.level3IntroComplete();
          break;
        case 'level3_complete':
          fsm.level3Complete();
          break;
        case 'game_complete':
          fsm.gameComplete();
          break;
        case 'stop':
          fsm.stop();
          break;  
        default:
          console.log("Unknown state transition:", stateTransition);
      }
    };
  
    if (pongAPI) {
      pongAPI.registerObserver('game/state', onGameState);
    }
  
    return fsm;
  };
  
  export default createBaseGameStateMachine;