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
    isGamePlaying, setIsGamePlaying,
  } = useGameContext();

  useEffect(() => {
    const fsm = createBaseGameStateMachine(pongAPI);

    fsm.onEnterIdle = () => { 
    };

    fsm.onEnterIdle = () => {
      console.log('GameSessionStateMachine Entered Idle state'); 
  
      setgameInstructionProps({
        image: IMAGES.noImage,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.blank
      }); 
    };
  
    fsm.onLeaveIdle = () => { 
      console.log('GameSessionStateMachine Exited Idle state'); 
    };
  
    fsm.onEnterIntro = () => { 
      console.log('GameSessionStateMachine Entered Intro state');
  
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
      console.log('GameSessionStateMachine Exit Intro state');
  
      audioPlayer.stop('tylerIntro');  
    };
  
    fsm.onEnterMoveIntro = () => {
      console.log('GameSessionStateMachine Entered MoveIntro state'); 
  
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
      console.log('GameSessionStateMachine Leave MoveIntro state'); 
  
      audioPlayer.stop('tylerMove');  
    }; 
  
    fsm.onEnterLevel1Intro = () => { 
      console.log('GameSessionStateMachine Entered Level1 Intro state');
  
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
            // pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM, { state: "start" });
          })
      })
    };
  
    fsm.onLeaveLevel1Intro = () => { 
      console.log('GameSessionStateMachine Exit Level1 Intro state');
  
      audioPlayer.stop('tylerDuel');  
    };
  
    fsm.onEnterLevel1 = () => { 
      console.log('GameSessionStateMachine Entered Level1 state');
  
      console.log(`isGamePlaying1: ${isGamePlaying}`);
      setIsGamePlaying(true);
      console.log(`isGamePlaying2: ${isGamePlaying}`);
  
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
      console.log('GameSessionStateMachine Entered Level 2 Intro state');
  
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
            console.log(`message: ${JSON.stringify(message, null, 2)}`);
  
            pongAPI.update(PongAPI.Topics.GAME_STATE, message );
          })
      });
    };
  
    fsm.onLeaveLevel2Intro = () => { 
      console.log('GameSessionStateMachine Exit Level 2 Intro state');
  
      audioPlayer.stop('tylerLevelOneComplete');  
    };
  
    fsm.onEnterLevel2 = () => { 
      console.log('GameSessionStateMachine Entered Level2 state');
  
      console.log(`isGamePlaying3: ${isGamePlaying}`);
  
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
      console.log('GameSessionStateMachine Entered Level 3 Intro state');
  
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
            console.log(`message: ${JSON.stringify(message, null, 2)}`);
  
            pongAPI.update(PongAPI.Topics.GAME_STATE, message );
          })
      });
    };
  
    fsm.onLeaveLevel3Intro = () => { 
      console.log('GameSessionStateMachine Exit Level 3 Intro state');
  
      audioPlayer.stop('tylerLevelTwoComplete');  
    };
  
    fsm.onEnterLevel3 = () => { 
      console.log('GameSessionStateMachine Entered Level3 state');
  
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
      console.log('GameSessionStateMachine Entered Outtro state');
  
      setIsGamePlaying(false);
  
      console.log("onEnterOutro1");
      setgameInstructionProps({
        image: IMAGES.TYLERFace_Neutral,
        position: [0.0, 0.0, 0.0],
        scale: 4.0,
        text: TEXT.level_three_complete
      });  
      console.log("onEnterOutro2");
          
      audioPlayer.play('tylerLevelThreeComplete').then(() => {
        audioPlayer.onEnd('tylerLevelThreeComplete', () => 
          {
  
            console.log("onEnterOutro3");
  
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
                  console.log(`message: ${JSON.stringify(message, null, 2)}`);
        
                  pongAPI.update(PongAPI.Topics.GAME_STATE, message );
                })
            });
          })
      });
    };
  
    fsm.onLeaveOutro = () => { 
      console.log('GameSessionStateMachine Exit Outtro state');
  
      audioPlayer.stop('tylerOutro');  
      audioPlayer.stop('tylerLevelThreeComplete');  
    };

    setGameStateMachine(fsm);
  }, []);

  return null;
};

export default GameStateMachine;