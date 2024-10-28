import PropTypes from 'prop-types';
import {Hud, PerspectiveCamera} from "@react-three/drei";
import HudImage from './HudImage';
import { noImage } from './loadImages';

function GameboardHud({ score=defaultSubProps, level=defaultSubProps, countdown=defaultSubProps }) { 
  
  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />

      <HudImage image={score.image} position={score.position} scale={score.scale}/>
      <HudImage image={level.image} position={level.position} scale={level.scale}/>
      <HudImage image={countdown.image} position={countdown.position} scale={countdown.scale}/>
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
GameboardHud.propTypes = {
  score: PropTypes.shape(subPropTypes),
  level: PropTypes.shape(subPropTypes),
  countdown: PropTypes.shape(subPropTypes),
};

// Define DefaultProps for the sub-properties
const defaultSubProps = {
  image: noImage,
  position: [0, 0, 0], // Default position array
  scale: 1.0, // Default scale as a float
};

// Define DefaultProps for the main properties
GameboardHud.defaultProps = {
  score: defaultSubProps,
  level: defaultSubProps,
  countdown: defaultSubProps,
};

export default GameboardHud;
