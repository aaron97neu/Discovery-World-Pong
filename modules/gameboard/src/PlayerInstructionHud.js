import { useContext} from 'react'
import {Hud, PerspectiveCamera} from "@react-three/drei";
import HudImage from './HudImage';
import {SceneContext} from './SceneContext';

function PlayerInstructionsHud() {
  const {isPlayerInstructionsVisible, playerInstructionProps} = useContext(SceneContext);

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
