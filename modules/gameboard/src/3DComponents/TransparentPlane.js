function TransparentPlane(props) {
    return (
      <mesh {...props} rotation={[-Math.PI/2,0,0]}>
        <planeGeometry attach="geometry" args={props.size}/>
        <meshBasicMaterial attach='material' color={props.color} transparent opacity={props.opacity} />
      </mesh>
    )
  }

export default TransparentPlane