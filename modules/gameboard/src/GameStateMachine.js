import { useEffect } from 'react';
import {useGameContext} from './GameContext';
import {useGamePlayContext} from './GamePlayContext';
import { createBaseGameStateMachine, PongAPI } from 'dw-state-machine';
import * as IMAGES from './loadImages';
import * as TEXT from './loadText';

const GameStateMachine = () => {
  const {
    setgameInstructionProps,
    setGameStateMachine,
    gamePlayStateMachine, 
    pongAPI,
    setIsGamePlayComplete,
  } = useGameContext();

  const {
    audioPlayer,
    playTime,
    volume,
    setLevel,
    setCountdown,
    setTopScore,
    setBottomScore,
  } = useGamePlayContext();  

  useEffect(() => {
    if (gamePlayStateMachine) {
      audioPlayer.play('exhibitActivationNoise');

      const fsm = createBaseGameStateMachine(pongAPI);

      fsm.onEnterIdle = () => { 
        console.log('GameStateMachine Entered Idle state'); 

        audioPlayer.stop('musicBackground');
        audioPlayer.setVolume('musicIdle',  volume);
        audioPlayer.play('musicIdle');

        setgameInstructionProps({
          image: IMAGES.welcomeScreen,
          position: [0.0, 0.2, 0.0],
          scale: 8.5
        });

        setIsGamePlayComplete(true);
        setLevel(2);
        setTopScore(0);
        setBottomScore(0);
      };

      fsm.onLeaveIdle = () => { 
        console.log('GameStateMachine Leave Idle state'); 

        audioPlayer.stop('musicIdle');
      };

      fsm.onEnterIntro = () => { 
        console.log('GameStateMachine Entered Intro state'); 

        audioPlayer.setVolume('musicBackground',  volume);
        audioPlayer.play('musicBackground');
      };

      fsm.onEnterMoveIntro = () => { 
        console.log('GameStateMachine Entered MoveIntro state'); 

        setgameInstructionProps({
          image: IMAGES.gameInstructionsMoveLeftRight,
          position: [0.0, 0.2, 0.0],
          scale: 8.5
        });
      };  

      fsm.onLeaveMoveIntro = () => { 
        console.log('GameStateMachine Leave MoveIntro state'); 

        setIsGamePlayComplete(false);
      };  

      fsm.onEnterLevel1Intro = () => {  
        console.log('GameStateMachine Entered Level1Intro state');
        if (gamePlayStateMachine) {
          gamePlayStateMachine.startLevelReset();

          setCountdown(TEXT.countdown_get_ready);
          setLevel(1);
        }        
      };

      fsm.onEnterLevel1 = () => {  
        console.log('GameStateMachine Entered Level1 state');

        if (gamePlayStateMachine) {
          gamePlayStateMachine.startCountdown();

          setTimeout(() => {
            const message = {
              "transition": "level1_complete"
            };

            pongAPI.update(PongAPI.Topics.GAME_STATE, message );
          },  playTime);
        }         
      };

      fsm.onEnterLevel2Intro = () => {  
        console.log('GameStateMachine Entered Level2Intro state');
        gamePlayStateMachine.startLevelReset();

        setCountdown(TEXT.countdown_get_ready);
        setLevel(2);
      };

      fsm.onEnterLevel2 = () => {  
        console.log('GameStateMachine Entered Level2 state');

        if (gamePlayStateMachine) {
          gamePlayStateMachine.startCountdown();

          setTimeout(() => {
            const message = {
              "transition": "level2_complete"
            };

            pongAPI.update(PongAPI.Topics.GAME_STATE, message );
          },  playTime);            
        }
      }

      fsm.onEnterLevel3Intro = () => {  
        console.log('GameStateMachine Entered Level3Intro state');

        if (gamePlayStateMachine) {
          gamePlayStateMachine.startLevelReset();

          setCountdown(TEXT.countdown_get_ready);
          setLevel(3);
        }
      };

      fsm.onEnterLevel3 = () => {  
        console.log('GameStateMachine Entered Level3 state');

        if (gamePlayStateMachine) {
          gamePlayStateMachine.startCountdown();    
        }  
      }

      fsm.onLeaveOutro = () => {  
        console.log('GameStateMachine Leave Outro state'); 
      };  

      setGameStateMachine(fsm);
    }
  }, [gamePlayStateMachine]);

  return null;
};

export default GameStateMachine;