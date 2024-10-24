import PropTypes from 'prop-types';
import {Hud, PerspectiveCamera} from "@react-three/drei";
import HudImage from './HudImage';
import { noImage } from './loadImages';

function PlayerInstructionsHud({ playerInstructions=defaultSubProps }) { 
  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />

      <HudImage image={playerInstructions.image} position={playerInstructions.position} scale={playerInstructions.scale}/>
    </Hud>
  );
}

// Define PropTypes for the sub-properties
const subPropTypes = {
  image:  PropTypes.string,
  position: PropTypes.arrayOf(PropTypes.number), // Expecting an array of three numbers
  scale: PropTypes.number, // Expecting a float
};

// Define PropTypes for the main properties
PlayerInstructionsHud.propTypes = {
  playerInstructions: PropTypes.shape(subPropTypes),
};

// Define DefaultProps for the sub-properties
const defaultSubProps = {
  image: noImage,
  position: [0, 0, 0], // Default position array
  scale: 1.0, // Default scale as a float
};

// Define DefaultProps for the main properties
PlayerInstructionsHud.defaultProps = {
  playerInstructions: defaultSubProps,
};

export default PlayerInstructionsHud;
