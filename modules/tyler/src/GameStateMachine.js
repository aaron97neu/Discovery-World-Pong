import { BaseStateMachine, PongAPI } from 'dw-state-machine';
import AudioPlayer from './AudioPlayer';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

/**
 * Class representing the game state machine.
 * Inherits from BaseStateMachine.
 */
class GameStateMachine extends BaseStateMachine {
  // Additional methods or overrides can be added here

  constructor(pongAPI, sceneContext) {
    console.log('GameStateMachine Entered Constructor'); 
    super(pongAPI);
    this.sceneContext = sceneContext;
    this.audioPlayer = new AudioPlayer();
  }

  // Define onEnter<state> and onLeave<state> methods for each state
  onEnterIdle() {
    console.log('GameStateMachine Entered Idle state'); 
    super.onEnterIdle();

    this.sceneContext.setStateTransition('idle');
    // this.sceneContext.setConvoText('');
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.noImage,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.blank
    }); 
  }

  onLeaveIdle() { 
    console.log('GameStateMachine Exited Idle state'); 
  }

  onEnterIntro() { 
    console.log('GameStateMachine Entered Intro state');
    super.onEnterIntro();

    // const message = {
    //   "transition": "intro_complete"
    // };
    // this.pongAPI.update(PongAPI.Topics.GAME_STATE, message);

    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.intro
    });  
        
    this.audioPlayer.play('tylerIntro').then(() => {
      this.audioPlayer.onEnd('tylerIntro', () => 
        {
          this.sceneContext.setPlayerInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.move
          }); 
          this.audioPlayer.play('tylerMove').then(() => {
            this.audioPlayer.onEnd('tylerMove', () => 
              {
                const message = {
                  "transition": "intro_complete"
                };
                this.pongAPI.update(PongAPI.Topics.GAME_STATE, message);
                // this.sceneContext.setPlayerInstructionProps({
                //   image: IMAGES.TYLERFace_Neutral,
                //   position: [0.0, 0.0, 0.0],
                //   scale: 4.0,
                //   text: TEXT.duel
                // }); 
                // this.audioPlayer.play('tylerDuel').then(() => {
                //   this.audioPlayer.onEnd('tylerDuel', () => 
                //     {
                //       this.pongAPI.update(PongAPI.Topics.GAME_STATE, { transition: "level1_intro_complete" });
                //       // this.pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM, { state: "start" });
                //     })
                // })
              })
          })
        })
    });
  }

  onLeaveIntro() { 
    console.log('GameStateMachine Exit Intro state');
    super.onLeaveIntro();

    this.audioPlayer.stop('tylerIntro');  
    this.audioPlayer.stop('tylerMove');  
    this.audioPlayer.stop('tylerDuel');  
    // this.audioPlayer.stop('tylerCountdown');  
  }

  onEnterLevel1Intro() { 
    console.log('GameStateMachine Entered Level1 Intro state');
    super.onEnterLevel1Intro();

    // const message = {
    //   "transition": "level1_intro_complete"
    // };
    // this.pongAPI.update(PongAPI.Topics.GAME_STATE, message);

    this.sceneContext.setPlayerInstructionProps({
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
    console.log('GameStateMachine Exit Level1 Intro state');
    super.onLeaveLevel1Intro();

    this.audioPlayer.stop('tylerDuel');  
  }

  onEnterLevel1() { 
    console.log('GameStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.countdown
    }); 
    
    this.audioPlayer.play('tylerCountdown').then(() => {
      this.audioPlayer.onEnd('tylerCountdown', () => 
        {
          this.sceneContext.setStateTransition('play');
          this.sceneContext.setPlayerInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.blank
          }); 
        })
    });
  }

  onEnterLevel2Intro() { 
    console.log('GameStateMachine Entered Level 2 Intro state');
    super.onEnterIntro();

    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setPlayerInstructionProps({
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
    console.log('GameStateMachine Exit Level 2 Intro state');
    super.onLeaveIntro();

    this.audioPlayer.stop('tylerLevelOneComplete');  
  }

  onEnterLevel2() { 
    console.log('GameStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.countdown
    }); 
    
    this.audioPlayer.play('tylerCountdown').then(() => {
      this.audioPlayer.onEnd('tylerCountdown', () => 
        {
          this.sceneContext.setStateTransition('play');
          this.sceneContext.setPlayerInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.blank
          }); 
        })
    });
  }

  onEnterLevel3Intro() { 
    console.log('GameStateMachine Entered Level 2 Intro state');
    super.onEnterIntro();

    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setPlayerInstructionProps({
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
    console.log('GameStateMachine Exit Level 2 Intro state');
    super.onLeaveIntro();

    this.audioPlayer.stop('tylerLevelTwoComplete');  
  }

  onEnterLevel3() { 
    console.log('GameStateMachine Entered Level1 state');
    super.onEnterLevel1();

    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.TYLERFace_MoveLeft,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.countdown
    }); 
    
    this.audioPlayer.play('tylerCountdown').then(() => {
      this.audioPlayer.onEnd('tylerCountdown', () => 
        {
          this.sceneContext.setStateTransition('play');
          this.sceneContext.setPlayerInstructionProps({
            image: IMAGES.TYLERFace_MoveLeft,
            position: [0.0, 0.0, 0.0],
            scale: 4.0,
            text: TEXT.blank
          }); 
        })
    });
  }


  onEnterOutro() { 
    console.log('GameStateMachine Entered Outtro state');
    super.onEnterOutro();

    this.sceneContext.setStateTransition('intro');
    this.sceneContext.setPlayerInstructionProps({
      image: IMAGES.TYLERFace_Neutral,
      position: [0.0, 0.0, 0.0],
      scale: 4.0,
      text: TEXT.level_three_complete
    });  
        
    this.audioPlayer.play('tylerLevelThreeComplete').then(() => {
      this.audioPlayer.onEnd('tylerLevelThreeComplete', () => 
        {
          this.sceneContext.setStateTransition('intro');
          this.sceneContext.setPlayerInstructionProps({
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
    console.log('GameStateMachine Exit Outtro state');
    super.onLeaveOutro();

    this.audioPlayer.stop('tylerOutro');  
    this.audioPlayer.stop('tylerLevelThreeComplete');  
  }
}

export default GameStateMachine;