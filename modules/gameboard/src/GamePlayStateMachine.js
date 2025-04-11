import React, { useEffect } from 'react';
import StateMachine from 'javascript-state-machine';
import { PongAPI } from 'dw-state-machine';
import {useGameContext} from './GameContext';
import {useGamePlayContext} from './GamePlayContext';
import * as TEXT from './loadText';

const GamePlayStateMachine = () => {
    const {
        setGamePlayStateMachine,
        pongAPI,
    } = useGameContext();

    const {
        setCountdown,
        setResetPaddles,
        setResetBall,
        setStartBall,
        setIsCountdownComplete,
        setIsNoCountdownComplete,
    } = useGamePlayContext();  

    const delay = 500;

    useEffect(() => {
        const fsm = new StateMachine({   
            init: 'gameStarted',
            transitions: [
                { name: 'startLevelReset', from: ['gameStarted', "topScore", "bottomScore"], to: 'levelReset' },
                { name: 'startCountdown', from: ['levelReset'], to: 'countdown' },
                { name: 'startNoCountdown', from: ['playReset'], to: 'noCountdown' },
                { name: 'startPlay', from: ['countdown', 'noCountdown'], to: 'play' },
                { name: 'startPlayReset', from: ['play'], to: 'playReset' },
                { name: 'endGame', from: ['play'], to: 'gameComplete' },
            ],
            methods: {
                onGameStarted: () => {
                    console.log('GamePlayStateMachine gameStarted state');
                },
                onLevelReset: () => {
                    console.log('GamePlayStateMachine levelReset state');
                },
                onCountdown: () => {
                    console.log('GamePlayStateMachine countdown state');
                },
                onPlayReset: () => {
                    console.log('GamePlayStateMachine playReset state');
                },
                onNoCountdown: () => {
                    console.log('GamePlayStateMachine noCountdown state');
                },
                onPlay: () => {
                    console.log('GamePlayStateMachine play state');
                },
                onGameComplete: () => {
                    console.log('GamePlayStateMachine gameComplete state');
                },


                // onLevelReset: () => {
                //     console.log('GamePlayStateMachine levelReset state');

                //     setResetPaddles(true);
                //     setResetBall(true);

                //     const message =  { "transition": "reset" };
                //     pongAPI.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
                //     pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );   
                // },
                // onCountdown: () => {
                //     console.log('GamePlayStateMachine countdown state');

                //     setCountdown(TEXT.countdown_three);
                //     setTimeout(() => {
                //         setCountdown(TEXT.countdown_two);
                //         setTimeout(() => {
                //             setCountdown(TEXT.countdown_one);
                //             setTimeout(() => {
                //                 setCountdown(TEXT.countdown_go);
                //                 setTimeout(() => {
                //                     setCountdown(TEXT.blank);
                //                     setIsCountdownComplete(true);
                //                 }, delay); 
                //             }, delay); 
                //         }, delay);
                //     }, delay);
                // }, 
                                    
                // onPlayReset: () => {
                //     console.log('GamePlayStateMachine playReset state');

                //     setResetPaddles(true);
                //     setResetBall(true);

                //     const message =  { "transition": "reset" };
                //     pongAPI.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
                //     pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );   
                // },                
                // onNoCountdown: () => {
                //     console.log('GamePlayStateMachine noCountdown state');

                //     setTimeout(() => {
                //         setIsNoCountdownComplete(true);
                //     }, delay);
                // },                 
                // onPlay: () => {
                //     console.log('GamePlayStateMachine play state');

                //     setStartBall(true);
                // },  
                // onGameComplete: () => {
                //     console.log('GamePlayStateMachine endGame state');

                //     setResetPaddles(true);
                //     setResetBall(true);

                //     const message =  { "transition": "reset" };
                //     pongAPI.update(PongAPI.Topics.PADDLE_TOP_STATE_TRANSITION ,message );
                //     pongAPI.update(PongAPI.Topics.PADDLE_BOTTOM_STATE_TRANSITION, message );   
                // },  
                onInvalidTransition: function(transition, from, to) {
                    console.log("transition '%s' not allowed from state '%s'", transition, from);
                    return false;
                },                    
            },
        });

        setGamePlayStateMachine(fsm);
    }, []);     

    return null;
};

export default GamePlayStateMachine;