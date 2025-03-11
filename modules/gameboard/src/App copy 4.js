import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import SnapshottingComponent from './SnapshottingComponent';

const App = () => {
  const [takeSnapshot, setTakeSnapshot] = useState(false);
  const [restoreSnapshot, setRestoreSnapshot] = useState(false);

  return (
    <>
      <Canvas>
      <ambientLight intensity={1.5} />
        <Physics gravity={[0, 0, 0]}>
          <SnapshottingComponent 
          takeSnapshot={takeSnapshot} 
          setTakeSnapshot={setTakeSnapshot}  
          restoreSnapshot={restoreSnapshot} 
          setRestoreSnapshot={setRestoreSnapshot} />
        </Physics>
      </Canvas>
      <div>
        <button onClick={() => setTakeSnapshot(true)}>Take Snapshot</button>
        <button onClick={() => setRestoreSnapshot(true)}>Restore Snapshot</button>
      </div>
    </>
  );
};

export default App;