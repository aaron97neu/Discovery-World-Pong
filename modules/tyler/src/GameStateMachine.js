import { useEffect } from 'react';
import {useGameContext} from './GameContext';
import { createBaseGameStateMachine, PongAPI } from 'dw-state-machine';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

const GameStateMachine = () => {
  const {
    setgameInstructionProps,
    setGameStateMachine,
    pongAPI,
    audioPlayer,
  } = useGameContext();

  useEffect(() => {
    const fsm = createBaseGameStateMachine(pongAPI);

    fsm.onEnterIdle = () => { 
    };

    fsm.onEnterIdle = () => {
      console.log('GameStateMachine Entered Idle state'); 
  
      setgameInstructionProps({
        image: IMAGES.noImage,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.blank
      }); 
    };
  
    fsm.onLeaveIdle = () => { 
      console.log('GameStateMachine Leave Idle state'); 
    };
  
    fsm.onEnterIntro = () => { 
      console.log('GameStateMachine Entered Intro state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Neutral,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.intro
      });  
          
      audioPlayer.play('tylerIntro').then(() => {
        audioPlayer.onEnd('tylerIntro', () => 
          {
            const message = {
              "transition": "intro_complete"
            };
            pongAPI.update(PongAPI.Topics.GAME_STATE, message);
          })
      });
    };
  
    fsm.onLeaveIntro = () => { 
      console.log('GameStateMachine Leave Intro state');
  
      audioPlayer.stop('tylerIntro');  
    };
  
    fsm.onEnterMoveIntro = () => {
      console.log('GameStateMachine Entered MoveIntro state'); 
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_MoveLeft,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.move
      }); 
  
      audioPlayer.play('tylerMove').then(() => {
        audioPlayer.onEnd('tylerMove', () => 
          {
            const message = {
              "transition": "move_intro_complete"
            };
            pongAPI.update(PongAPI.Topics.GAME_STATE, message);
          })
      });
    }; 
  
    fsm.onLeaveMoveIntro = () => {
      console.log('GameStateMachine Leave MoveIntro state'); 
  
      audioPlayer.stop('tylerMove');  
    }; 
  
    fsm.onEnterLevel1Intro = () => { 
      console.log('GameStateMachine Entered Level1 Intro state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Neutral,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.duel
      }); 
      audioPlayer.play('tylerDuel').then(() => {
        audioPlayer.onEnd('tylerDuel', () => 
          {
            const message = {
              "transition": "level1_intro_complete"
            };
            pongAPI.update(PongAPI.Topics.GAME_STATE, message);
          })
      })
    };
  
    fsm.onLeaveLevel1Intro = () => { 
      console.log('GameStateMachine Leave Level1 Intro state');
  
      audioPlayer.stop('tylerDuel');  
    };
  
    fsm.onEnterLevel1 = () => { 
      console.log('GameStateMachine Entered Level1 state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_MoveLeft,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.countdown
      }); 
      
      audioPlayer.play('tylerCountdown').then(() => {
        audioPlayer.onEnd('tylerCountdown', () => 
          {
            setgameInstructionProps({
              image: IMAGES.TYLERFace_MoveLeft,
              position: [0.0, 0.0, 0.0],
              scale: 4.0,
              text: TEXT.blank
            }); 
          })
      });
    };
  
    fsm.onEnterLevel2Intro = () => { 
      console.log('GameStateMachine Entered Level 2 Intro state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Neutral,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.level_one_complete
      });  
          
      audioPlayer.play('tylerLevelOneComplete').then(() => {
        audioPlayer.onEnd('tylerLevelOneComplete', () => 
          {
            const message = {
              "transition": "level2_intro_complete"
            };
  
            pongAPI.update(PongAPI.Topics.GAME_STATE, message );
          })
      });
    };
  
    fsm.onLeaveLevel2Intro = () => { 
      console.log('GameStateMachine Leave Level 2 Intro state');
  
      audioPlayer.stop('tylerLevelOneComplete');  
    };
  
    fsm.onEnterLevel2 = () => { 
      console.log('GameStateMachine Entered Level2 state');
   
      setgameInstructionProps({
        image: IMAGES.TYLERFace_MoveLeft,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.countdown
      }); 
      
      audioPlayer.play('tylerCountdown').then(() => {
        audioPlayer.onEnd('tylerCountdown', () => 
          {
            setgameInstructionProps({
              image: IMAGES.TYLERFace_MoveLeft,
              position: [0.0, 0.0, 0.0],
              scale: 4.0,
              text: TEXT.blank
            }); 
          })
      });
    };
  
    fsm.onEnterLevel3Intro = () => { 
      console.log('GameStateMachine Entered Level 3 Intro state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Neutral,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.level_two_complete
      });  
          
      audioPlayer.play('tylerLevelTwoComplete').then(() => {
        audioPlayer.onEnd('tylerLevelTwoComplete', () => 
          {
            const message = {
              "transition": "level3_intro_complete"
            };
  
            pongAPI.update(PongAPI.Topics.GAME_STATE, message );
          })
      });
    };
  
    fsm.onLeaveLevel3Intro = () => { 
      console.log('GameStateMachine Leave Level 3 Intro state');
  
      audioPlayer.stop('tylerLevelTwoComplete');  
    };
  
    fsm.onEnterLevel3 = () => { 
      console.log('GameStateMachine Entered Level3 state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_MoveLeft,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.countdown
      }); 
      
      audioPlayer.play('tylerCountdown').then(() => {
        audioPlayer.onEnd('tylerCountdown', () => 
          {
            setgameInstructionProps({
              image: IMAGES.TYLERFace_MoveLeft,
              position: [0.0, 0.0, 0.0],
              scale: 4.0,
              text: TEXT.blank
            }); 
          })
      });
    }; 
  
    fsm.onEnterOutro = () => { 
      console.log('GameStateMachine Entered Outtro state');
  
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Neutral,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.level_three_complete
      });  
          
      audioPlayer.play('tylerLevelThreeComplete').then(() => {
        audioPlayer.onEnd('tylerLevelThreeComplete', () => 
          { 
            setgameInstructionProps({
              image: IMAGES.TYLERFace_Neutral,
              position: [0.0, 0.0, 0.0],
              scale: 4.0,
              text: TEXT.outro
            });  
            audioPlayer.play('tylerOutro').then(() => {
              audioPlayer.onEnd('tylerOutro', () => 
                {
                  const message = {
                    "transition": "game_complete"
                  };
        
                  pongAPI.update(PongAPI.Topics.GAME_STATE, message );
                })
            });
          })
      });
    };
  
    fsm.onLeaveOutro = () => { 
      console.log('GameStateMachine Leave Outtro state');
  
      audioPlayer.stop('tylerOutro');  
      audioPlayer.stop('tylerLevelThreeComplete');  
    };

    setGameStateMachine(fsm);
  }, []);

  return null;
};

export default GameStateMachine;