import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import StateMachine from 'javascript-state-machine';
import {GamePlayContext} from './GamePlayContext';
import * as TEXT from './loadText';
import AudioPlayer from './AudioPlayer';

const GamePlayStateMachine = forwardRef(({ ballRef }, ref) => {
    const {
        setCountdown,
        setTopPaddleState,
        setBottomPaddleState,
        setResetPaddles,
        setTopScore,
        setBottomScore,
        setIsCountdownComplete,
        setIncludeCountDown,
        // setIsTopPaddleReset,
        // setIsBottomPaddleReset,
        setIsBallReset,
        setPrevLevel,
        setForcePaddleRerender,
        setForceBallRerender,
        setResetBall,
        setIsDontPlay,
    } = useContext(GamePlayContext);  

    const audioPlayerRef = useRef(null);
    const audioVolume = 0.5;
    const delay = 500;
    const speed = 200;
  
    const [setStateMachine] = useState(null);

    useEffect(() => {
        if (!audioPlayerRef.current) {
            audioPlayerRef.current = new AudioPlayer();
            audioPlayerRef.current.setVolume('pointScore', audioVolume);
            audioPlayerRef.current.setVolume('pointLose', audioVolume);
        }

        const fsm = new StateMachine({   
            init: 'gameStarted',
            transitions: [
                { name: 'startGame', from: ['gameStarted'], to: 'idle' },
                // { name: 'resetLevel', from: ['gameReset'], to: 'levelReset' },
                { name: 'resetPaddle', from: ['idle', 'topGoal', 'bottomGoal'], to: 'paddleReset' },
                { name: 'resetBall', from: 'paddleReset', to: 'ballReset' },
                // { name: 'resetLevel', from: ['ballReset'], to: 'levelReset' },

                // { name: 'resetLevel', from: ['ballReset'], to: 'countdown' },
                // { name: 'resetPlay', from: ['ballReset'], to: 'startPlay' },

                // { name: 'startLevel', from: 'levelReset', to: 'paddleReset'},
                // { name: 'startCountdown', from: 'gameReset', to: 'countdown'},
                // { name: 'startCountdown', from: 'levelReset', to: 'countdown'},
                { name: 'startCountdown', from: 'ballReset', to: 'countdown'},
                // { name: 'beginPlay', from: ['countdown', 'gameReset'], to: 'play'},

                // { name: 'startPlay', from: ['countdown', 'levelReset'], to: 'play'},
                { name: 'startPlay', from: ['countdown', 'ballReset'], to: 'play'},

                { name: 'topGoalScored', from: 'play', to: 'topGoal'},
                { name: 'bottomGoalScored', from: 'play', to: 'bottomGoal'},                
                { name: 'endLevel', from: ['topGoal', 'bottomGoal', 'play', 'paddleReset'], to: 'idle'},

                // { name: 'resetGame', from: 'ballReset', to: 'gameReset' },

                // { name: 'endGame', from: ['gameReset'], to: 'gameFinished' },
                { name: 'endGame', from: ['levelReset'], to: 'gameFinished' },
                { name: 'returnToIdle', from: ['gameFinished'], to: 'idle' },
            ],
            methods: {
                // Method called when entering the 'gameStarted' state
                onEnterGameStarted: () => {
                    console.log('GamePlayStateMachine Entering gameStarted state');
                    setPrevLevel(0);
                    setTopScore(0);
                    setBottomScore(0);
                },
                // Method called when Leave the 'gameStarted' state
                onLeaveGameStarted: () => {
                    console.log('GamePlayStateMachine Leave gameStarted state');
                },                 
                // Method called when entering the 'idle' state
                onEnterIdle: () => {
                    console.log('GamePlayStateMachine Entering idle state');
                    setIsDontPlay(true);
                    setIncludeCountDown(false);
                    setCountdown(TEXT.countdown_get_ready);
                },
                // Method called when Leave the 'idle' state
                onLeaveIdle: () => {
                    console.log('GamePlayStateMachine Leave idle state');
                },    
                // Method called when entering the 'levelReset' state
                onEnterLevelReset: () => {
                    console.log('GamePlayStateMachine Entering levelReset state');
                    setIsDontPlay(false);
                    setIsCountdownComplete(false);
                    setIncludeCountDown(true);
                    setCountdown(TEXT.blank);
                },
                // Method called when Leave the 'levelReset' state
                onLeaveLevelReset: () => {
                    console.log('GamePlayStateMachine Leave levelReset state');
                },  
                // Method called when entering the 'paddleReset' state
                onEnterPaddleReset: () => {
                    console.log('GamePlayStateMachine Entering paddleReset state');
                    setResetPaddles(true);
                    setForcePaddleRerender(prevState => !prevState);
                },
                // Method called when Leave the 'paddleReset' state
                onLeavePaddleReset: () => {
                    console.log('GamePlayStateMachine Leave paddleReset state');
                    setTopPaddleState("play");
                    setBottomPaddleState("play");
                    // setIsTopPaddleReset(false);
                    // setIsBottomPaddleReset(false);
                    setResetPaddles(false);
                    setForcePaddleRerender(prevState => !prevState);
                },
                // Method called when entering the 'ballReset' state
                onEnterBallReset: () => {
                    console.log('GamePlayStateMachine Entering ballReset state');
                    setResetBall(true);
                    setForceBallRerender(prevState => !prevState);
                },
                // Method called when Leave the 'ballReset' state
                onLeaveBallReset: () => {
                    console.log('GamePlayStateMachine Leave ballReset state');
                    setIsBallReset(false);
                    setResetBall(false);
                    setForceBallRerender(prevState => !prevState);
                },
                // // Method called when entering the 'reset' state
                // onEnterGameReset: () => {
                //     console.log('GamePlayStateMachine Entering gameReset state');
                // },
                // // Method called when Leave the 'reset' state
                // onLeaveGameReset: () => {
                //     console.log('GamePlayStateMachine Leave gameReset state');
                // },
                // Method called when entering the 'countdown' state
                onEnterCountdown: () => {
                    console.log('GamePlayStateMachine Entering countdown state');
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
                // Method called when Leave the 'countdown' state
                onLeaveCountdown: () => {
                    console.log('GamePlayStateMachine Leave countdown state');
                },
                // Method called when entering the 'play' state
                onEnterPlay: () => {
                    console.log('GamePlayStateMachine Entering play state');
                    ballRef.current.setLinvel({ x: 0, y: speed, z: 0 }, true);
                },
                // Method called when Leave the 'play' state
                onLeavePlay: () => {
                    console.log('GamePlayStateMachine Leave play state');
                },
                // Method called when entering the 'topGoal' state
                onEnterTopGoal: () => {
                    console.log('GamePlayStateMachine Entering topGoal state');
                    if (audioPlayerRef.current) {
                        audioPlayerRef.current.play('pointScore').catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                    }
                    setBottomScore((prev) => prev + 1);
          
                    setIncludeCountDown(false);
                },
                // Method called when Leave the 'topGoal' state
                onLeaveTopGoal: () => {
                    console.log('GamePlayStateMachine Leave topGoal state');
                },
                // Method called when entering the 'bottomGoal' state
                onEnterBottomGoal: () => {
                    console.log('GamePlayStateMachine Entering bottomGoal state');
                    if (audioPlayerRef.current) {
                        audioPlayerRef.current.play('pointLose').catch((error) => {
                            console.error('Error playing audio:', error);
                        });
                    }
                    setTopScore((prev) => prev + 1);
            
                    setIncludeCountDown(false);
                },
                // Method called when Leave the 'bottomGoal' state
                onLeaveBottomGoal: () => {
                    console.log('GamePlayStateMachine Leave bottomGoal state');
                },
                // Method called when entering the 'gameFinished' state
                onEnterGameFinished: () => {
                    console.log('GamePlayStateMachine Entering gameFinished state');
                },
                // Method called when Leave the 'gameFinished' state
                onLeaveGameFinished: () => {
                    console.log('GamePlayStateMachine Leave gameFinished state');
                },
                onInvalidTransition: function(transition, from, to) {
                    console.log("GamePlayStateMachine transition '%s' not allowed from state '%s'", transition, from);
                },
            },
        });

        if (ref) {
            ref.current = fsm;
        }
    }, [ref]);

    return null;
});

export default GamePlayStateMachine;