import { useContext} from 'react'
import {Hud, PerspectiveCamera, Text} from "@react-three/drei";
import HudImage from './HudImage';
import {SceneContext} from './SceneContext';
import mainFont from './fonts/Roboto-Bold.ttf';
import * as IMAGES from './loadImages';

function GameboardHud() {
  const {isGameboardVisible, countdown, level, scoreRed, scoreBlue} = useContext(SceneContext);

  return (
    <Hud>
      <group>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />

        <group position={[7.2, 2.4, 0.0]} >
           <HudImage position={[0.0, 0.0, 0.0]} scale={4.0} image={IMAGES.score}/>
           <Text position={[0.0, 0.2, 0.0]} font={mainFont} fontSize={1.2} color="black" text={scoreRed}/>
           <Text position={[0.0, -1.6, 0.0]} font={mainFont} fontSize={1.2} color="black" text={scoreBlue}/>
        </group>

        <group position={[-6.8, 4.0, 0.0]} >
          <Text position={[0.0, 0.0, 0.0]} font={mainFont} fontSize={0.8} color="white" text={'LEVEL:'}/>
          <Text position={[1.6, 0.0, 0.0]} font={mainFont} fontSize={0.8} color="white" text={level}/>
        </group> 
      
        <Text position={[0.0, 0, 0]} font={mainFont} fontSize={1.7} color="white" text={countdown} />
      </group>


        {/* Example of how to add a material to the text and change opacity
        <Text position={[0.0, 0, 0]} font={mainFont} fontSize={1.0} color="white">
          {countdown2}
          <meshStandardMaterial attach="material" opacity={0.2}/>
        </Text> 
        */}
    </Hud>
  );
}

export default GameboardHud;