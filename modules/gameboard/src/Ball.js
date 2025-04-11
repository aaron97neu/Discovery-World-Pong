import React, { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';

const Ball = ({ ballRef, position, args, color  }) => {
  return (
    <RigidBody 
      ref={ballRef} 
      position={position} 
      colliders="ball"
      restitution={1.0} 
      friction={0.0} 
      userData={{ isBall: true }}
    >
      <mesh >
        <sphereGeometry args={args}  />
        <meshStandardMaterial 
          color={color} 
        />
      </mesh>
    </RigidBody>
  );    
};


// const Ball = ({ ballRef, position, args, color  }) => {
//   // const ballRef = useRef(null);

//   return (
//     <RigidBody
//       ref={ballRef}
//       colliders="ball"
//       restitution={0.8}
//       position={position}
//     >
//       <mesh castShadow receiveShadow>
//         <sphereGeometry args={args} />
//         <meshStandardMaterial color="orange" />
//       </mesh>
//     </RigidBody>
//   );
// };


export default Ball;
