import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import StateMachine from 'javascript-state-machine';
import * as TEXT from './loadText';
import {PlayContext} from './PlayContext';
import AudioPlayer from './AudioPlayer';

const PlayStateMachine = forwardRef(({ ballRef }, ref) => {

const {
    setCountdown,
    setTopPaddleState,
    setBottomPaddleState,
    setResetPaddles,
    setTopScore,
    setBottomScore,
    setIsCountdownComplete,
    setIncludeCountDown,
    setIsTopPaddleReset,
    setIsBottomPaddleReset,
    setIsBallReset,
    setPrevLevel,
    setForcePaddleRerender,
    setForceBallRerender,
    setResetBall,
    setIsDontPlay,
  } = useContext(PlayContext);  

  const gameboardHeight = 160; // height used in AI 
    const audioPlayerRef = useRef(null);
    const audioVolume = 0.5;
    const delay = 500;
    const speed = 200;
  
    const [stateMachine, setStateMachine] = useState(null);

    useEffect(() => {
        // console.log("game constructor");

        if (!audioPlayerRef.current) {
            audioPlayerRef.current = new AudioPlayer();
            audioPlayerRef.current.setVolume('pointScore', audioVolume);
            audioPlayerRef.current.setVolume('pointLose', audioVolume);
        }

        const fsm = new StateMachine({   
            init: 'gameStarted',
            transitions: [
                { name: 'startGame', from: ['gameStarted'], to: 'idle' },
                { name: 'resetLevel', from: ['gameReset'], to: 'levelReset' },
                { name: 'startLevel', from: 'levelReset', to: 'paddleReset'},
                { name: 'startCountdown', from: 'gameReset', to: 'countdown'},
                { name: 'beginPlay', from: ['countdown', 'gameReset'], to: 'play'},
                { name: 'topGoalScored', from: 'play', to: 'topGoal'},
                { name: 'bottomGoalScored', from: 'play', to: 'bottomGoal'},                
                { name: 'endLevel', from: ['topGoal', 'bottomGoal', 'play', 'paddleReset'], to: 'idle'},

                { name: 'resetPaddle', from: ['idle', 'topGoal', 'bottomGoal'], to: 'paddleReset' },
                { name: 'resetBall', from: 'paddleReset', to: 'ballReset' },
                { name: 'resetGame', from: 'ballReset', to: 'gameReset' },

                { name: 'endGame', from: ['paddleReset'], to: 'gameFinished' },
                { name: 'returnToIdle', from: ['gameFinished'], to: 'idle' },
            ],
            methods: {
                // Method called when entering the 'gameStarted' state
                onEnterGameStarted: () => {
                    console.log('PlayStateMachine Entering gameStarted state');
                    setPrevLevel(0);
                    setTopScore(0);
                    setBottomScore(0);
                },
                // Method called when leaving the 'gameStarted' state
                onLeaveGameStarted: () => {
                    console.log('PlayStateMachine Leaving gameStarted state');
                },                 
                // Method called when entering the 'idle' state
                onEnterIdle: () => {
                    console.log('PlayStateMachine Entering idle state');
                    setIsDontPlay(true);
                    setIncludeCountDown(false);
                    setCountdown(TEXT.countdown_get_ready);
                },
                // Method called when leaving the 'idle' state
                onLeaveIdle: () => {
                    console.log('PlayStateMachine Leaving idle state');
                },    
                // Method called when entering the 'levelReset' state
                onEnterLevelReset: () => {
                    console.log('PlayStateMachine Entering levelReset state');
                    setIsDontPlay(false);
                    setIsCountdownComplete(false);
                    setIncludeCountDown(true);
                    setCountdown(TEXT.blank);
                },
                // Method called when leaving the 'levelReset' state
                onLeaveLevelReset: () => {
                    console.log('PlayStateMachine Leaving levelReset state');
                },  
                // Method called when entering the 'paddleReset' state
                onEnterPaddleReset: () => {
                    console.log('PlayStateMachine Entering paddleReset state');
                    setResetPaddles(true);
                    setForcePaddleRerender(prevState => !prevState);
                },
                // Method called when leaving the 'paddleReset' state
                onLeavePaddleReset: () => {
                    console.log('PlayStateMachine Leaving paddleReset state');
                    setTopPaddleState("play");
                    setBottomPaddleState("play");
                    setIsTopPaddleReset(false);
                    setIsBottomPaddleReset(false);
                    setResetPaddles(false);
                    setForcePaddleRerender(prevState => !prevState);
                },
                // Method called when entering the 'ballReset' state
                onEnterBallReset: () => {
                    console.log('PlayStateMachine Entering ballReset state');
                    setResetBall(true);
                    setForceBallRerender(prevState => !prevState);
                },
                // Method called when leaving the 'ballReset' state
                onLeaveBallReset: () => {
                    console.log('PlayStateMachine Leaving ballReset state');
                    setIsBallReset(false);
                    setResetBall(false);
                    setForceBallRerender(prevState => !prevState);
                },
                // Method called when entering the 'reset' state
                onEnterGameReset: () => {
                    console.log('PlayStateMachine Entering gameReset state');
                },
                // Method called when leaving the 'reset' state
                onLeaveGameReset: () => {
                    console.log('PlayStateMachine Leaving gameReset state');
                },
                // Method called when entering the 'countdown' state
                onEnterCountdown: () => {
                    console.log('PlayStateMachine Entering countdown state');
                    setCountdown(TEXT.countdown_three);
                    setTimeout(() => {
                    setCountdown(TEXT.countdown_two);
                    setTimeout(() => {
                        setCountdown(TEXT.countdown_one);
                        setTimeout(() => {
                        setCountdown(TEXT.countdown_go);
                        setTimeout(() => {
                            setCountdown(TEXT.blank);
                            setIsCountdownComplete(true);     
                        }, delay); 
                        }, delay); 
                    }, delay);
                    }, delay);
                },
                // Method called when leaving the 'countdown' state
                onLeaveCountdown: () => {
                    console.log('PlayStateMachine Leaving countdown state');
                },
                // Method called when entering the 'play' state
                onEnterPlay: () => {
                    console.log('PlayStateMachine Entering play state');
                    ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
                },
                // Method called when leaving the 'play' state
                onLeavePlay: () => {
                    console.log('PlayStateMachine Leaving play state');
                },
                // Method called when entering the 'topGoal' state
                onEnterTopGoal: () => {
                    console.log('PlayStateMachine Entering topGoal state');
                    if (audioPlayerRef.current) {
                        audioPlayerRef.current.play('pointScore').catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                    }
                    setBottomScore((prev) => prev + 1);
          
                    setIncludeCountDown(false);
                },
                // Method called when leaving the 'topGoal' state
                onLeaveTopGoal: () => {
                    console.log('PlayStateMachine Leaving topGoal state');
                },
                // Method called when entering the 'bottomGoal' state
                onEnterBottomGoal: () => {
                    console.log('PlayStateMachine Entering bottomGoal state');
                    if (audioPlayerRef.current) {
                        audioPlayerRef.current.play('pointLose').catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                    }
                    setTopScore((prev) => prev + 1);
            
                    setIncludeCountDown(false);
                },
                // Method called when leaving the 'bottomGoal' state
                onLeaveBottomGoal: () => {
                    console.log('PlayStateMachine Leaving bottomGoal state');
                },
                // Method called when entering the 'gameFinished' state
                onEnterGameFinished: () => {
                    console.log('PlayStateMachine Entering gameFinished state');
                },
                // Method called when leaving the 'gameFinished' state
                onLeaveGameFinished: () => {
                    console.log('PlayStateMachine Leaving gameFinished state');
                },
                onInvalidTransition: function(transition, from, to) {
                    console.log("PlayStateMachine transition '%s' not allowed from state '%s'", transition, from);
                },
            },
        });

        if (ref) {
            ref.current = fsm;
        }
    }, [ref]);

    return null;
});

export default PlayStateMachine;