import { BaseStateMachine } from 'dw-state-machine';
import AudioPlayer from './AudioPlayer';
import * as IMAGES from './loadImages';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameStateMachine extends BaseStateMachine {
  constructor(pongAPI, gameContext) {
    console.log('GameStateMachine Entered Constructor'); 
    super(pongAPI);
    this.playTime = 30000;
    this.volume = 0.5;
    this.gameContext = gameContext;
    this.audioPlayer = new AudioPlayer();
    this.audioPlayer.play('exhibitActivationNoise');
  }

  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onEnterIdle();

    // this.gameContext.setPlayersReady(false);
    this.gameContext.setIsGame(false);
    this.audioPlayer.stop('musicBackground');
    this.audioPlayer.setVolume('musicIdle', this.volume);
    this.audioPlayer.play('musicIdle');

    // this.gameContext.setGameboard(false);
    // this.gameContext.setGameboard(true);
    this.gameContext.setPlayerInstructionProps({
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
    console.log('GameStateMachine Entered Intro state'); 
    super.onEnterIntro();

    // this.gameContext.setPlayersReady(true);
    this.audioPlayer.setVolume('musicBackground', this.volume);
    this.audioPlayer.play('musicBackground');
  }  

  onLeaveIntro() {
    console.log('GameStateMachine Leave Intro state'); 
    super.onLeaveIntro();

    // this.audioPlayer.stop('musicBackground');
  }  

  onEnterLevel1Intro() { 
    console.log('GameStateMachine Entered Level1 Intro state');
    super.onEnterLevel1Intro();

    this.gameContext.setLevel(0);
    this.gameContext.setIsGame(true); 
    this.gameContext.setLevelComplete(0);    
  }

  onEnterLevel1() { 
    console.log('GameStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.gameContext.setLevel(1);
    setTimeout(() => {
      this.gameContext.setLevelComplete(1);
    }, this.playTime);            
  }


  onEnterLevel2() { 
    console.log('GameStateMachine Entered Level2 state');
    super.onEnterLevel2();

    // this.gameContext.setIsLevelPlaying(true);
    this.gameContext.setLevel(2);
    setTimeout(() => {
      // this.gameContext.setIsLevelPlaying(false);
      this.gameContext.setLevelComplete(2);
    }, this.playTime);            
  }

  
  onEnterLevel3() { 
    console.log('GameStateMachine Entered Level3 state');
    super.onEnterLevel3();

    this.gameContext.setLevel(3);
    // this.gameContext.setIsLevelPlaying(true);
    // setTimeout(() => {
      // this.gameContext.setIsLevelPlaying(false);
      // this.gameContext.setLevelComplete(3);
    // }, this.playTime);            
  }

  onLeaveLevel3() { 
    console.log('GameStateMachine Exit Level3 state'); 
    super.onLeaveLevel3();
      
    this.gameContext.setIsGamePlaying(false);

    // // console.log(`topScore: ${this.gameContext.topScore}`);
    // // console.log(`bottomScore: ${this.gameContext.bottomScore}`);
    // if (this.gameContext.bottomScore > this.gameContext.topScore) {
    //   this.gameContext.setCountdown(TEXT.human_wins);
    // }

    // if (this.gameContext.bottomScore < this.gameContext.topScore) {
    //   this.gameContext.setCountdown(TEXT.tyler_wins);
    // }

    // if (this.gameContext.bottomScore == this.gameContext.topScore) {
    //   this.gameContext.setCountdown(TEXT.draw);
    // }
  }

  // onEnterLevel2() { 
  //   console.log('GameStateMachine Entered Level2 state'); 
  //   super.onEnterLevel2();

  //   // this.gameContext.setIsGame(true);
  //   this.gameContext.setLevel('2');
    
  //   this.gameContext.setCountdown(TEXT.countdown_three);
  //   setTimeout(() => {
  //     this.gameContext.setCountdown(TEXT.countdown_two);
  //     setTimeout(() => {
  //       this.gameContext.setCountdown(TEXT.countdown_one);
  //       setTimeout(() => {
  //         this.gameContext.setCountdown(TEXT.countdown_go);
  //         setTimeout(() => {
  //           this.gameContext.setCountdown(TEXT.blank);
  //           this.gameContext.setIsLevelPlaying(true);
  //           setTimeout(() => {
  //             this.gameContext.setIsLevelPlaying(false);
  //             this.gameContext.setLevelComplete(2);
  //             this.gameContext.setCountdown(TEXT.countdown_get_ready);
  //           }, this.playTime);            
  //         }, this.delay); 
  //       }, this.delay); 
  //     }, this.delay);
  //   }, this.delay);  
  // }

  // onEnterLevel3() { 
  //   console.log('GameStateMachine Entered Level3 state'); 
  //   super.onEnterLevel3();

  //   // this.gameContext.setIsGame(true);
  //   this.gameContext.setLevel('3');
    
  //   this.gameContext.setCountdown(TEXT.countdown_three);
  //   setTimeout(() => {
  //     this.gameContext.setCountdown(TEXT.countdown_two);
  //     setTimeout(() => {
  //       this.gameContext.setCountdown(TEXT.countdown_one);
  //       setTimeout(() => {
  //         this.gameContext.setCountdown(TEXT.countdown_go);
  //         setTimeout(() => {
  //           this.gameContext.setCountdown(TEXT.blank);
  //           this.gameContext.setIsLevelPlaying(true);
  //           // setTimeout(() => {
  //           //   this.gameContext.setIsPlaying(false);
  //           //   this.gameContext.setLevelComplete(3); 
  //           // }, this.playTime);            
  //         }, this.delay); 
  //       }, this.delay); 
  //     }, this.delay);
  //   }, this.delay);
  // }

  // onLeaveLevel3() { 
  //   console.log('GameStateMachine Exit Level3 state'); 
  //   super.onLeaveLevel3();
      
      // setIsGamePlaying(false);

  //   // console.log(`topScore: ${this.gameContext.topScore}`);
  //   // console.log(`bottomScore: ${this.gameContext.bottomScore}`);
  //   if (this.gameContext.bottomScore > this.gameContext.topScore) {
  //     this.gameContext.setCountdown(TEXT.human_wins);
  //   }

  //   if (this.gameContext.bottomScore < this.gameContext.topScore) {
  //     this.gameContext.setCountdown(TEXT.tyler_wins);
  //   }

  //   if (this.gameContext.bottomScore == this.gameContext.topScore) {
  //     this.gameContext.setCountdown(TEXT.draw);
  //   }
  // }

}

export default GameStateMachine;