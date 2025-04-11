import { useEffect } from 'react';
import GamePlayStateMachine from './GamePlayStateMachine';
import {useGameContext} from './GameContext';
import {useGamePlayContext} from './GamePlayContext';
import { createBaseGameStateMachine } from 'dw-state-machine';
import { PongAPI } from 'dw-state-machine';
import AudioPlayer from './AudioPlayer';
import { level1Win } from "./loadAudioFiles";
import * as IMAGES from './loadImages';

const GameStateMachine = () => {
  const {
    setGameStateMachine,
    gamePlayStateMachine, 
    pongAPI,
    setgameInstructionProps,
  } = useGameContext();

  const {
    setLevel,
    setIsCollidersEnabled,
    setTopPaddleStateTransition,
    setBottomPaddleStateTransition,
    setIsBallReset,
  } = useGamePlayContext();  

  const playTime = 30000;
  const volume = 0.5;
  const audioPlayer = new AudioPlayer();

  useEffect(() => {
    if (gamePlayStateMachine) {
      const fsm = createBaseGameStateMachine(pongAPI);

      fsm.onEnterIdle = () => { 
        console.log('GameStateMachine Entered Idle state'); 
        const sm = gamePlayStateMachine;

        // gamePlayStateMachine.endGame();

        audioPlayer.stop('musicBackground');
        audioPlayer.setVolume('musicIdle',  volume);
        audioPlayer.play('musicIdle');

        setgameInstructionProps({
          image: IMAGES.welcomeScreen,
          position: [0.0, 0.2, 0.0],
          scale: 8.5
        });
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

      fsm.onLeaveIntro = () => { 
        console.log('GameStateMachine Leave Intro state'); 

        audioPlayer.stop('musicBackground');
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

        setgameInstructionProps({
          image: IMAGES.welcomeScreen,
          position: [0.0, 0.2, 0.0],
          scale: 8.5
        });
      };  

      fsm.onEnterLevel1 = () => {  
        console.log('GameStateMachine Entered Level1 state');
        const sm = gamePlayStateMachine;

        // setIsCollidersEnabled(false);
        // setTopPaddleStateTransition("not_ready");
        // setBottomPaddleStateTransition("not_ready");
        // setIsBallReset(false);
        gamePlayStateMachine.startLevelReset();

        setLevel(1);

        setTimeout(() => {
          const message = {
            "transition": "level1_complete"
          };

          // pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        },  playTime);         
      };

      fsm.onEnterLevel2 = () => {  
        console.log('GameStateMachine Entered Level2 state');

        setLevel(2);

        setTimeout(() => {
          const message = {
            "transition": "level2_complete"
          };

          pongAPI.update(PongAPI.Topics.GAME_STATE, message );
        },  playTime);            
      }

      fsm.onEnterLevel3 = () => {  
        console.log('GameStateMachine Entered Level3 state');

        setLevel(3);        
      }

      fsm.onLeaveOutro = () => {  
        console.log('GameStateMachine Leave Outro state'); 
          
        const message = {
          "transition": "game_complete"
        };

        pongAPI.update(PongAPI.Topics.GAME_STATE, message );
      };  

      setGameStateMachine(fsm);
    }
  }, [gamePlayStateMachine]);

  // return (
  //   <GamePlayStateMachine />
  // );

  return null;
};

export default GameStateMachine;