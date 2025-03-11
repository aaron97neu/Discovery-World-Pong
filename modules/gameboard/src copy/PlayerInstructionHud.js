import { useContext} from 'react'
import {Hud, PerspectiveCamera} from "@react-three/drei";
import HudImage from './HudImage';
import {GameContext} from './GameContext';

function PlayerInstructionsHud() {
  const {playerInstructionProps} = useContext(GameContext);

  return (
    <Hud>
      <group>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />

        <HudImage image={playerInstructionProps.image} position={playerInstructionProps.position} scale={playerInstructionProps.scale}/>
      </group>
    </Hud>
  );
}

export default PlayerInstructionsHud;
