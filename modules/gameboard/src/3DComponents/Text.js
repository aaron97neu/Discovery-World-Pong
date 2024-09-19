import * as THREE from 'three'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import Roboto from './Roboto Medium_Regular.json'
import React, { forwardRef, useLayoutEffect, useRef, useMemo } from 'react'
import { useLoader, extend } from '@react-three/fiber'

extend({TextGeometry});

export default function Text(props) {
    const font = new FontLoader().parse(Roboto)
    // see https://threejs.org/docs/#examples/en/geometries/TextGeometry
    const textOptions = {
        font,
        size: 1,
        height: .1,
    };

    return (
        <mesh position={props.position} rotation={props.rotation}>
           <textGeometry attach='geometry' args={[props.text, textOptions]} />
           <meshStandardMaterial attach='material' color={props.color} emissive={props.color} />
         </mesh>
      )
    
}