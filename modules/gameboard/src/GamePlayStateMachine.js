// import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
// import StateMachine from 'javascript-state-machine';
// import {GamePlayContext} from './GamePlayContext';
// import * as TEXT from './loadText';
// import AudioPlayer from './AudioPlayer';

// const GamePlayStateMachine = forwardRef(({ ballRef }, ref) => {
//     const {
//         setCountdown,
//         setTopPaddleState,
//         setBottomPaddleState,
//         setResetPaddles,
//         setTopScore,
//         setBottomScore,
//         setIsCountdownComplete,
//         setIncludeCountDown,
//         // setIsTopPaddleReset,
//         // setIsBottomPaddleReset,
//         setIsBallReset,
//         setPrevLevel,
//         setForcePaddleRerender,
//         setForceBallRerender,
//         setResetBall,
//         setIsDontPlay,
//     } = useContext(GamePlayContext);  

//     const audioPlayerRef = useRef(null);
//     const audioVolume = 0.5;
//     const delay = 500;
//     const speed = 200;
  
//     const [setStateMachine] = useState(null);

//     useEffect(() => {
//         if (!audioPlayerRef.current) {
//             audioPlayerRef.current = new AudioPlayer();
//             audioPlayerRef.current.setVolume('pointScore', audioVolume);
//             audioPlayerRef.current.setVolume('pointLose', audioVolume);
//         }

//         const fsm = new StateMachine({   
//             init: 'idle',
//             transitions: [
//                 { name: 'startLevel1', from: ['idle'], to: 'level1' },
//                 { name: 'startLevel2', from: ['level1'], to: 'level2' },
//                 { name: 'startLevel3', from: ['level2'], to: 'level3' },
//                 { name: 'endGame', from: ['level3'], to: 'idle' },
//             ],
//             methods: {
//                 onEnterIdle: () => {
//                     console.log('GamePlayStateMachine Entering idle state');
//                     setPrevLevel(0);
//                     setTopScore(0);
//                     setBottomScore(0);
//                 },
//                 onLeaveIdle: () => {
//                     console.log('GamePlayStateMachine Leave idle state');
//                 },                 

//                 onEnterLevel1: () => {
//                     console.log('GamePlayStateMachine Entering level1 state');
//                 },
//                 onLeaveLevel1: () => {
//                     console.log('GamePlayStateMachine Leave level1 state');
//                 },      
                
//                 onEnterLevel2: () => {
//                     console.log('GamePlayStateMachine Entering level2 state');
//                 },
//                 onLeaveLevel2: () => {
//                     console.log('GamePlayStateMachine Leave level2 state');
//                 },      
                
//                 onEnterLevel3: () => {
//                     console.log('GamePlayStateMachine Entering level3 state');
//                 },
//                 onLeaveLevel3: () => {
//                     console.log('GamePlayStateMachine Leave level3 state');
//                 },      
//             },
//         });

//         if (ref) {
//             ref.current = fsm;
//         }
//     }, [ref]);

//     return null;
// });

// export default GamePlayStateMachine;