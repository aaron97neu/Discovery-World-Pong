import { BaseStateMachine, PongAPI } from 'dw-state-machine';
import AudioPlayer from './AudioPlayer';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameSessionStateMachine extends BaseStateMachine {
  // Additional methods or overrides can be added here

  constructor(pongAPI, sceneContext) {
    console.log('GameSessionStateMachine Entered Constructor'); 
    super(pongAPI);
    this.sceneContext = sceneContext;
    this.audioPlayer = new AudioPlayer();
  }

  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterIdle() {
    console.log('GameSessionStateMachine Entered Idle state'); 
    super.onEnterIdle();

    this.sceneContext.setStateTransition('idle');
    // this.sceneContext.setConvoText('');
    this.sceneContext.setgameInstructionProps({
      image: IMAGES.noImage,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.blank
    }); 
  }

  onLeaveIdle() { 
    console.log('GameSessionStateMachine Exited Idle state'); 
    super.onLeaveIdle();
  }

  onEnterIntro() { 
    console.log('GameSessionStateMachine Entered Intro state');
    super.onEnterIntro();

    this.sceneContext.setStateTransition('intro');

    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.intro
    });  
        
    this.audioPlayer.play('tylerIntro').then(() => {
      this.audioPlayer.onEnd('tylerIntro', () => 
        {
          const message = {
            "transition": "intro_complete"
          };
          this.pongAPI.update(PongAPI.Topics.GAME_STATE, message);
        })
    });
  }

  onLeaveIntro() { 
    console.log('GameSessionStateMachine Exit Intro state');
    super.onLeaveIntro();

    this.audioPlayer.stop('tylerIntro');  
  }

  onEnterMoveIntro() {
    console.log('GameSessionStateMachine Entered MoveIntro state'); 
    super.onEnterMoveIntro();

    this.sceneContext.setStateTransition('intro');

    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.move
    }); 

    this.audioPlayer.play('tylerMove').then(() => {
      this.audioPlayer.onEnd('tylerMove', () => 
        {
          const message = {
            "transition": "move_intro_complete"
          };
          this.pongAPI.update(PongAPI.Topics.GAME_STATE, message);
        })
    });
  }  

  onLeaveMoveIntro() {
    console.log('GameSessionStateMachine Leave MoveIntro state'); 
    super.onLeaveMoveIntro();

    this.audioPlayer.stop('tylerMove');  
  }  

  onEnterLevel1Intro() { 
    console.log('GameSessionStateMachine Entered Level1 Intro state');
    super.onEnterLevel1Intro();

    this.sceneContext.setStateTransition('intro');

    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.duel
    }); 
    this.audioPlayer.play('tylerDuel').then(() => {
      this.audioPlayer.onEnd('tylerDuel', () => 
        {
          const message = {
            "transition": "level1_intro_complete"
          };
          this.pongAPI.update(PongAPI.Topics.GAME_STATE, message);
          // this.pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM, { state: "start" });
        })
    })
  }

  onLeaveLevel1Intro() { 
    console.log('GameSessionStateMachine Exit Level1 Intro state');
    super.onLeaveLevel1Intro();

    this.audioPlayer.stop('tylerDuel');  
  }

  onEnterLevel1() { 
    console.log('GameSessionStateMachine Entered Level1 state');
    super.onEnterLevel1();

    console.log(`isGamePlaying1: ${this.sceneContext.isGamePlaying}`);
    this.sceneContext.setIsGamePlaying(true);
    console.log(`isGamePlaying2: ${this.sceneContext.isGamePlaying}`);

    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.countdown
    }); 
    
    this.audioPlayer.play('tylerCountdown').then(() => {
      this.audioPlayer.onEnd('tylerCountdown', () => 
        {
          this.sceneContext.setStateTransition('play');
          this.sceneContext.setgameInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.blank
          }); 
        })
    });
  }

  onEnterLevel2Intro() { 
    console.log('GameSessionStateMachine Entered Level 2 Intro state');
    super.onEnterLevel2Intro();

    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.level_one_complete
    });  
        
    this.audioPlayer.play('tylerLevelOneComplete').then(() => {
      this.audioPlayer.onEnd('tylerLevelOneComplete', () => 
        {
          const message = {
            "transition": "level2_intro_complete"
          };
          console.log(`message: ${JSON.stringify(message, null, 2)}`);

          this.pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        })
    });
  }

  onLeaveLevel2Intro() { 
    console.log('GameSessionStateMachine Exit Level 2 Intro state');
    super.onLeaveLevel2Intro();

    this.audioPlayer.stop('tylerLevelOneComplete');  
  }

  onEnterLevel2() { 
    console.log('GameSessionStateMachine Entered Level2 state');
    super.onEnterLevel2();

    console.log(`isGamePlaying3: ${this.sceneContext.isGamePlaying}`);

    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.countdown
    }); 
    
    this.audioPlayer.play('tylerCountdown').then(() => {
      this.audioPlayer.onEnd('tylerCountdown', () => 
        {
          this.sceneContext.setStateTransition('play');
          this.sceneContext.setgameInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.blank
          }); 
        })
    });
  }

  onEnterLevel3Intro() { 
    console.log('GameSessionStateMachine Entered Level 3 Intro state');
    super.onEnterLevel3Intro();

    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.level_two_complete
    });  
        
    this.audioPlayer.play('tylerLevelTwoComplete').then(() => {
      this.audioPlayer.onEnd('tylerLevelTwoComplete', () => 
        {
          const message = {
            "transition": "level3_intro_complete"
          };
          console.log(`message: ${JSON.stringify(message, null, 2)}`);

          this.pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        })
    });
  }

  onLeaveLevel3Intro() { 
    console.log('GameSessionStateMachine Exit Level 3 Intro state');
    super.onLeaveLevel3Intro();

    this.audioPlayer.stop('tylerLevelTwoComplete');  
  }

  onEnterLevel3() { 
    console.log('GameSessionStateMachine Entered Level3 state');
    super.onEnterLevel3();

    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.countdown
    }); 
    
    this.audioPlayer.play('tylerCountdown').then(() => {
      this.audioPlayer.onEnd('tylerCountdown', () => 
        {
          this.sceneContext.setStateTransition('play');
          this.sceneContext.setgameInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.blank
          }); 
        })
    });
  }


  onEnterOutro() { 
    console.log('GameSessionStateMachine Entered Outtro state');
    super.onEnterOutro();

    this.sceneContext.setIsGamePlaying(false);

    console.log("onEnterOutro1");
    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setgameInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.level_three_complete
    });  
    console.log("onEnterOutro2");
        
    this.audioPlayer.play('tylerLevelThreeComplete').then(() => {
      this.audioPlayer.onEnd('tylerLevelThreeComplete', () => 
        {

          console.log("onEnterOutro3");

          this.sceneContext.setStateTransition('intro');
          this.sceneContext.setgameInstructionProps({
            image: IMAGES.TYLERFace_Neutral,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.outro
          });  
          this.audioPlayer.play('tylerOutro').then(() => {
            this.audioPlayer.onEnd('tylerOutro', () => 
              {
                const message = {
                  "transition": "game_complete"
                };
                console.log(`message: ${JSON.stringify(message, null, 2)}`);
      
                this.pongAPI.update(PongAPI.Topics.GAME_STATE, message );
              })
          });
        })
    });
  }

  onLeaveOutro() { 
    console.log('GameSessionStateMachine Exit Outtro state');
    super.onLeaveOutro();

    this.audioPlayer.stop('tylerOutro');  
    this.audioPlayer.stop('tylerLevelThreeComplete');  
  }
}

export default GameSessionStateMachine;