import {Hud, PerspectiveCamera, Text} from "@react-three/drei";
import HudImage from './HudImage';
import {useGameContext} from './GameContext';
import mainFont from './fonts/Roboto-Bold.ttf';
import * as IMAGES from './loadImages';

function TylerHud() {
  const {
    gameStateMachine,
    gameInstructionProps,
  } = useGameContext();

  const renderGroupSection = () => {
    if (gameStateMachine) {
      switch (gameStateMachine.state) {
        case 'stopped':
        case 'idle':
          return (
            <group>
              <group position={[0.0, 1.5, 0.0]} >
                <Text 
                  position={[0.0, 2.2, 0.0]} 
                  font={mainFont} 
                  fontSize={0.4} 
                  color="white" 
                  text={'T.Y.L.E.R.'}
                />
                <HudImage 
                  position={[0.0, 0.0, 0.0]} 
                  scale={4.0} 
                  image={IMAGES.TYLERFace_Sleeping1}
                />
              </group>

              <group position={[0.0, -2.0, 0.0]}> 
                <HudImage 
                  position={[0.0, 0.0, 0.0]} 
                  scale={2.7} 
                  image={IMAGES.welcomeScreen}
                />
              </group>
            </group>
          );
        case 'intro':
        case 'moveIntro':
        case 'level1Intro':
        case 'level2Intro':
        case 'level3Intro':
        case 'outro':
          return (
            <group>
              <group position={[0.0, 1.5, 0.0]} >
                <Text 
                  position={[0.0, 2.2, 0.0]} 
                  font={mainFont} fontSize={0.4} 
                  color="white" 
                  text={'T.Y.L.E.R.'}
                />
                <HudImage 
                  image={gameInstructionProps.image} 
                  position={gameInstructionProps.position} 
                  scale={gameInstructionProps.scale}
                />
                </group>

              <group position={[0.0, -2.0, 0.0]}> 
                <mesh rotation={[0, 0, 0]}>
                  <planeGeometry args={[5.0, 2.5]} />
                  <meshStandardMaterial color="black" />
                </mesh>
                <Text position={[-2.4, 1.1, 0.0]} maxWidth={4.8} anchorX="left" anchorY="top" font={mainFont} fontSize={0.3} color="white" text={gameInstructionProps.text}/>
              </group>
            </group>
          );

        case 'level1':
        case 'level2':
        case 'level3':
          return (
            <group>
              <group position={[0.0, 1.5, 0.0]} >
                <Text position={[0.0, 2.2, 0.0]} font={mainFont} fontSize={0.4} color="white" text={'T.Y.L.E.R.'}/>
                <HudImage image={gameInstructionProps.image} position={gameInstructionProps.position} scale={gameInstructionProps.scale}/>
                </group>

              <group position={[0.0, -2.0, 0.0]}> 
                <mesh rotation={[0, 0, 0]}>
                  <planeGeometry args={[5.0, 2.5]} />
                  <meshStandardMaterial color="black" />
                </mesh>
                <Text position={[-2.4, 1.1, 0.0]} maxWidth={4.8} anchorX="left" anchorY="top" font={mainFont} fontSize={0.3} color="white" text={gameInstructionProps.text}/>
              </group>
            </group>
          );
        default:
          return (
              <group>
              </group>
          );
      }
    }
  };

  return (
    <Hud>
      <group>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        {renderGroupSection()}
      </group>
    </Hud>
  );
}

export default TylerHud;
