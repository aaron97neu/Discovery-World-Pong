import React, { useRef, useEffect, useState } from 'react';
import { useRapier, RigidBody } from '@react-three/rapier';

const Ball = ({ ballRef, position, args, color  }) => {

  return (
    <RigidBody ref={ballRef} position={position} colliders="ball"  restitution={1.0} friction={0.0} userData={{ isBall: true }}>
      <mesh >
        <sphereGeometry args={args}  />
        {/* <circleGeometry args={[3.0, 64]} /> */}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );    
};

const SnapshottingComponent = ({ 
  takeSnapshot, 
  setTakeSnapshot, 
  restoreSnapshot, 
  setRestoreSnapshot }) => {

  const gameboardHeight = 160; // height used in AI     
   const ballRadius = 4.0;
  const ballStartPosition = [0, -(gameboardHeight / 2) + 10, 0];
  
  const { world, setWorld, rapier } = useRapier();
  const worldSnapshot = useRef(null);
  const topRef = useRef();
  const bottomRef = useRef();
  const ballRef = useRef();
  const [ballColor, setBallColor] = useState("orange");
  const [restore, setRestore] = useState(false);

  useEffect(() => {
    if (restore) {
      if (world) {
        setBallColor("green");
        console.log(world);
        console.log(world.bodies);
        const handle = ballRef.current.handle;
        const rb = world.getRigidBody(handle);
        console.log(ballRef.current);
        console.log(rb);
        ballRef.current = rb;
        console.log("333333333333333333333333");
        ballRef.current.setLinvel({ x: 50, y: 0, z: 0 }, true); // Set new linear velocity for each body

        // world.bodies.forEach((body) => {
        //   body.setLinvel({ x: 5, y: 0, z: 0 }, true); // Set new linear velocity for each body
        // });
        console.log("Linear velocities updated");
      }
      setRestore(false); // Reset restore state
    }
  }, [world, restore]);

  useEffect(() => {
    console.log(topRef.current);
    console.log(`topRef: ${topRef.current.handle}`);
    console.log(`bottomRef: ${bottomRef.current.handle}`);
    console.log(`ballRef: ${ballRef.current.handle}`);

    if (takeSnapshot && worldSnapshot.current) {
      console.log("11111111111111111111111111111");
      const snapshot = world.takeSnapshot();
      worldSnapshot.current = snapshot;
      setTakeSnapshot(false);
    }
  }, [takeSnapshot, world]);

  useEffect(() => {
    // console.log(`worldSnapshot2: ${JSON.stringify(worldSnapshot, null, 2)}`);
    // Restore the snapshot if restoreSnapshot is true
    if (restoreSnapshot && worldSnapshot.current) {
      console.log("222222222222222222222");
      const newWorld = rapier.World.restoreSnapshot(worldSnapshot.current);
      setWorld(newWorld);
      setRestoreSnapshot(false);

      setTimeout(() => {
        setRestore(true);
      }, 1000); 
    }
  }, [restoreSnapshot, rapier, setWorld]);

  useEffect(() => {
    // Set initial velocity for the ball to bounce
    if (ballRef.current) {
      ballRef.current.setLinvel({ x: 0, y: 1, z: 0 }, true);
    }
  }, []);

  return (
  <group ref={worldSnapshot}>
      <RigidBody ref={topRef} position={[0, 2, 0]} type="fixed" restitution={1.0} friction={0.0}  userData={{ isBall: "topbox" }}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      <RigidBody ref={bottomRef} position={[0, -2, 0]} type="fixed" restitution={1.0} friction={0.0} userData={{ isBall: "bottombox" }}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>
      <Ball 
        // ref={ballRef}  
        ballRef={ballRef}
        position={[0, 0, 0]} 
        args={[0.5, 32, 32]}  
        color={ballColor}
      />
      {/* <RigidBody ref={ballRef} position={[0, 0, 0]} colliders="ball" restitution={1.0} friction={0.0} userData={{ isBall: {ballColor} }} >
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={ballColor} />
        </mesh>
      </RigidBody> */}
    </group>
  );
};

export default SnapshottingComponent;