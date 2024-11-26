import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function Ball({ start, end, lerpSpeed = 0.1 }) {
    const sphereRef = useRef();
    const vec = new THREE.Vector3();

    useFrame(() => {
      if (sphereRef.current) {
        console.log("sphereRef.current.position: ", sphereRef.current.position);
        sphereRef.current.position.lerp(vec.set(...end), lerpSpeed);
      }
    });
  
    return (
        <mesh ref={sphereRef}  >
            <sphereGeometry  args={[0.3, 64, 64]} /> {/* radius, width segments, height segments */}
            <meshBasicMaterial color="rgb(255,255,255)" />
        </mesh>       
    );
  }

  export default Ball;