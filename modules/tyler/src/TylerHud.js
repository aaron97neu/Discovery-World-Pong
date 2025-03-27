import { useContext} from 'react'
import {Hud, PerspectiveCamera, Text} from "@react-three/drei";
import HudImage from './HudImage';
import {SceneContext} from './SceneContext';
import mainFont from './fonts/Roboto-Bold.ttf';
import * as IMAGES from './loadImages';

function TylerHud() {
  const {stateTransition, gameInstructionProps} = useContext(SceneContext);

  const renderGroupSection = () => {
    switch (stateTransition) {
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
      case 'play':
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
