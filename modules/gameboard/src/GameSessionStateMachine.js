import { BaseStateMachine } from 'dw-state-machine';
import AudioPlayer from './AudioPlayer';
import * as IMAGES from './loadImages';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameSessionStateMachine extends BaseStateMachine {
  constructor(pongAPI, gameSessionContext, gamePlayContext) {
    console.log('GameSessionStateMachine Entered Constructor'); 
    super(pongAPI);
    this.playTime = 30000;
    this.volume = 0.5;
    this.gameSessionContext = gameSessionContext;
    this.gamePlayContext = gamePlayContext;
    this.audioPlayer = new AudioPlayer();
    this.audioPlayer.play('exhibitActivationNoise');
  }

  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterIdle() {
    console.log('GameSessionStateMachine Entered Idle state'); 
    super.onEnterIdle();

    // this.gameSessionContext.setIsGame(false);
    this.audioPlayer.stop('musicBackground');
    this.audioPlayer.setVolume('musicIdle', this.volume);
    this.audioPlayer.play('musicIdle');

    this.gameSessionContext.setgameInstructionProps({
      image: IMAGES.welcomeScreen,
      position: [0.0, 0.2, 0.0],
      scale: 8.5
    });
  }

  onLeaveIdle() {
    console.log('GameSessionStateMachine Leave Idle state'); 
    super.onLeaveIdle();

    this.audioPlayer.stop('musicIdle');
  }

  onEnterIntro() {
    console.log('GameSessionStateMachine Entered Intro state'); 
    super.onEnterIntro();
    // this.gameSessionContext.setIsGameComplete(true);
    this.gameSessionContext.setIsIntroComplete(false);

    this.audioPlayer.setVolume('musicBackground', this.volume);
    this.audioPlayer.play('musicBackground');
  }  

  onLeaveIntro() {
    console.log('GameSessionStateMachine Leave Intro state'); 
    super.onLeaveIntro();

    this.audioPlayer.stop('musicBackground');
    this.gameSessionContext.setIsIntroComplete(true);
    // this.gameSessionContext.setIsGameComplete(true);
  }  

  onEnterMoveIntro() {
    console.log('GameSessionStateMachine Entered MoveIntro state'); 
    super.onEnterMoveIntro();
    this.gameSessionContext.setIsLevelIntroComplete(false);

    this.gameSessionContext.setgameInstructionProps({
      image: IMAGES.gameInstructionsMoveLeftRight,
      position: [0.0, 0.2, 0.0],
      scale: 8.5
    });
  }  

  onLeaveMoveIntro() {
    console.log('GameSessionStateMachine Leave MoveIntro state'); 
    super.onLeaveMoveIntro();

    this.gameSessionContext.setgameInstructionProps({
      image: IMAGES.welcomeScreen,
      position: [0.0, 0.2, 0.0],
      scale: 8.5
    });
    this.gameSessionContext.setIsLevelIntroComplete(true);
  }  

  onEnterLevel1Intro() { 
    console.log('GameSessionStateMachine Entered Level1 Intro state');
    super.onEnterLevel1Intro();
    this.gameSessionContext.setIsLevelIntroComplete(false);
    this.gameSessionContext.setIsGamePlayComplete(false);

    // this.gameSessionContext.setIsGamePlaying(true); 
    this.gameSessionContext.setLevel(0);
    // this.gameSessionContext.setIsGame(true);
    // this.gameSessionContext.setIsGameComplete(false);
    // this.gameSessionContext.setIsLevelComplete(false);
    // this.gameSessionContext.setLevelComplete(0);   
  }

  onLeaveLevel1Intro() {
    console.log('GameSessionStateMachine Leave Level1Intro state'); 
    super.onLeaveLevel1Intro();

    this.gameSessionContext.setIsLevelIntroComplete(true);
  }  

  onEnterLevel1() { 
    console.log('GameSessionStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.gameSessionContext.setIsLevelComplete(false);
    this.gameSessionContext.setLevel(1);
    this.gamePlayContext.setStartLevel(true);
    setTimeout(() => {
      this.gamePlayContext.setStopLevel(true);
      this.gameSessionContext.setIsLevelComplete(true);
    }, this.playTime);            
  }

  onEnterLevel2Intro() { 
    console.log('GameSessionStateMachine Entered Level2 Intro state');
    super.onEnterLevel2Intro();
    this.gameSessionContext.setIsLevelIntroComplete(false); 
  }

  onLeaveLevel2Intro() {
    console.log('GameSessionStateMachine Leave Level2Intro state'); 
    super.onLeaveLevel2Intro();

    this.gameSessionContext.setIsLevelIntroComplete(true);
  }  

  onEnterLevel2() { 
    console.log('GameSessionStateMachine Entered Level2 state');
    super.onEnterLevel2();

    this.gameSessionContext.setIsLevelComplete(false);
    this.gameSessionContext.setLevel(2);
    this.gamePlayContext.setStartLevel(true);
    setTimeout(() => {
      // this.gameSessionContext.setLevelComplete(2);
      this.gamePlayContext.setStopLevel(true);
      this.gameSessionContext.setIsLevelComplete(true);
    }, this.playTime);            
  }

  onEnterLevel3Intro() { 
    console.log('GameSessionStateMachine Entered Level3 Intro state');
    super.onEnterLevel3Intro();
    this.gameSessionContext.setIsLevelIntroComplete(false); 
  }

  onLeaveLevel3Intro() {
    console.log('GameSessionStateMachine Leave Level3Intro state'); 
    super.onLeaveLevel3Intro();

    this.gameSessionContext.setIsLevelIntroComplete(true);
  }  

  onEnterLevel3() { 
    console.log('GameSessionStateMachine Entered Level3 state');
    super.onEnterLevel3();

    this.gameSessionContext.setIsLevelComplete(false);
    this.gameSessionContext.setLevel(3);        
    this.gamePlayContext.setStartLevel(true);
  }

  onEnterOutro() { 
    console.log('GameSessionStateMachine Entered Outro state');
    super.onEnterOutro();

    this.gameSessionContext.setIsLevelIntroComplete(false); 
  }

  onLeaveOutro() { 
    console.log('GameSessionStateMachine Leave Outro state'); 
    super.onLeaveOutro();
      
    // this.gameSessionContext.setIsGamePlaying(false);
    // this.gameSessionContext.setIsIntroPlaying(false);
    this.gameSessionContext.setIsLevelIntroComplete(true);
    // this.gameSessionContext.setIsGameComplete(true);
    this.gameSessionContext.setIsGamePlayComplete(true);
  }

}

export default GameSessionStateMachine;