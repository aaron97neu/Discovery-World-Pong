/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function AIPuck(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/models/AIPuck.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.AIPuck.geometry}
        material={materials.AIPuck}
        position={[0, 0, -3.9]}
        rotation={[-Math.PI, 0, -Math.PI]}
      />
    </group>
  )
}

useGLTF.preload('/models/AIPuck.glb')