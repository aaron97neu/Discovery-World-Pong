import { BaseStateMachine } from 'dw-state-machine';
import AudioPlayer from './AudioPlayer';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameStateMachine extends BaseStateMachine {
  constructor(pongAPI, sceneContext) {
    console.log('GameStateMachine Entered Constructor'); 
    super(pongAPI);
    this.delay = 600;
    this.playTime = 30000;
    this.volume = 0.5;
    this.sceneContext = sceneContext;
    this.audioPlayer = new AudioPlayer();
    this.audioPlayer.play('exhibitActivationNoise');
  }

  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onEnterIdle();

    // this.sceneContext.setPlayersReady(false);
    this.sceneContext.setIsGame(false);

    this.audioPlayer.stop('musicBackground');
    this.audioPlayer.setVolume('musicIdle', this.volume);
    this.audioPlayer.play('musicIdle');

    // this.sceneContext.setGameboard(false);
    // this.sceneContext.setGameboard(true);
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.welcomeScreen,
      position: [0.0, 0.2, 0.0],
      scale: 8.5
    });
  }

  onLeaveIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onLeaveIdle();

    this.audioPlayer.stop('musicIdle');
  }

  onEnterIntro() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onEnterIntro();

    // this.sceneContext.setPlayersReady(true);
    this.audioPlayer.setVolume('musicBackground', this.volume);
    this.audioPlayer.play('musicBackground');
  }  

  onLeaveIntro() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onLeaveIntro();

    // this.audioPlayer.stop('musicBackground');
  }  
  
  onEnterLevel1() { 
    console.log('GameStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.sceneContext.setIsGame(true);
    this.sceneContext.setLevelComplete(0);
    this.sceneContext.setTopScore(0);
    this.sceneContext.setBottomScore(0);
    // this.sceneContext.setTopPaddlePosition(0.5);
    // this.sceneContext.setBottomPaddlePosition(0.5);
    // this.sceneContext.setBallPosition({x: 0.0, y: 0.0});
    this.sceneContext.setLevel('1');

    this.sceneContext.setCountdown(TEXT.countdown_three);
    setTimeout(() => {
      this.sceneContext.setCountdown(TEXT.countdown_two);
      setTimeout(() => {
        this.sceneContext.setCountdown(TEXT.countdown_one);
        setTimeout(() => {
          this.sceneContext.setCountdown(TEXT.countdown_go);
          setTimeout(() => {
            this.sceneContext.setCountdown(TEXT.blank);
            // this.sceneContext.setIsPaddlesReset(false);
            // console.log("whaaaaaaaaaaaat1");
            // this.sceneContext.setIsReset(true);
            // console.log("whaaaaaaaaaaaat2");
            this.sceneContext.setPlaying(true);
            setTimeout(() => {
              this.sceneContext.setPlaying(false);
              this.sceneContext.setLevelComplete(1);
              this.sceneContext.setCountdown(TEXT.countdown_get_ready);
            }, this.playTime);            
          }, this.delay); 
        }, this.delay); 
      }, this.delay);
    }, this.delay);
  }

  // onEnterLevel2() { 
  //   console.log('GameStateMachine Entered Level2 state'); 
  //   super.onEnterLevel2();

  //   this.sceneContext.setIsGame(true);
  //   this.sceneContext.setLevel('2');
    
  //   this.sceneContext.setCountdown(TEXT.countdown_three);
  //   setTimeout(() => {
  //     this.sceneContext.setCountdown(TEXT.countdown_two);
  //     setTimeout(() => {
  //       this.sceneContext.setCountdown(TEXT.countdown_one);
  //       setTimeout(() => {
  //         this.sceneContext.setCountdown(TEXT.countdown_go);
  //         setTimeout(() => {
  //           this.sceneContext.setCountdown(TEXT.blank);
  //           this.sceneContext.setIsPlaying(true);
  //           setTimeout(() => {
  //             this.sceneContext.setIsPlaying(false);
  //             this.sceneContext.setLevelComplete(2);
  //             this.sceneContext.setCountdown(TEXT.countdown_get_ready);
  //           }, this.playTime);            
  //         }, this.delay); 
  //       }, this.delay); 
  //     }, this.delay);
  //   }, this.delay);  
  // }

  // onEnterLevel3() { 
  //   console.log('GameStateMachine Entered Level3 state'); 
  //   super.onEnterLevel3();

  //   this.sceneContext.setIsGame(true);
  //   this.sceneContext.setLevel('3');
    
  //   this.sceneContext.setCountdown(TEXT.countdown_three);
  //   setTimeout(() => {
  //     this.sceneContext.setCountdown(TEXT.countdown_two);
  //     setTimeout(() => {
  //       this.sceneContext.setCountdown(TEXT.countdown_one);
  //       setTimeout(() => {
  //         this.sceneContext.setCountdown(TEXT.countdown_go);
  //         setTimeout(() => {
  //           this.sceneContext.setCountdown(TEXT.blank);
  //           this.sceneContext.setIsPlaying(true);
  //           // setTimeout(() => {
  //           //   this.sceneContext.setIsPlaying(false);
  //           //   this.sceneContext.setLevelComplete(3); 
  //           // }, this.playTime);            
  //         }, this.delay); 
  //       }, this.delay); 
  //     }, this.delay);
  //   }, this.delay);
  // }

  // onLeaveLevel3() { 
  //   console.log('GameStateMachine Exit Level3 state'); 
  //   super.onLeaveLevel3();

  //   console.log(`topScore: ${this.sceneContext.topScore}`);
  //   console.log(`bottomScore: ${this.sceneContext.bottomScore}`);
  //   if (this.sceneContext.bottomScore > this.sceneContext.topScore) {
  //     this.sceneContext.setCountdown(TEXT.human_wins);
  //   }

  //   if (this.sceneContext.bottomScore < this.sceneContext.topScore) {
  //     this.sceneContext.setCountdown(TEXT.tyler_wins);
  //   }

  //   if (this.sceneContext.bottomScore == this.sceneContext.topScore) {
  //     this.sceneContext.setCountdown(TEXT.draw);
  //   }
  // }

}

export default GameStateMachine;