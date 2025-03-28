import { useContext} from 'react'
import {Hud, PerspectiveCamera} from "@react-three/drei";
import {GameSessionContext} from './GameSessionContext';
import HudImage from './HudImage';

function GameInstructionsHud() {
  const {
    gameInstructionProps
  } = useContext(GameSessionContext);

  return (
    <Hud>
      <group>
        <PerspectiveCamera 
        makeDefault 
        position={[0, 0, 10]} 
      />

        <HudImage 
          image={gameInstructionProps.image} 
          position={gameInstructionProps.position} 
          scale={gameInstructionProps.scale}
        />
      </group>
    </Hud>
  );
}

export default GameInstructionsHud;
