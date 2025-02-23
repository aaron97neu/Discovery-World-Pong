import React, { useCallback } from 'react';

function Gameboard( {position, args, map} ) {
    return (
       <mesh position={position}>
         <planeGeometry attach="geometry" args={args} />
         <meshBasicMaterial attach="material" map={map} transparent opacity={1.0} />
       </mesh>
    );
}

export default Gameboard;