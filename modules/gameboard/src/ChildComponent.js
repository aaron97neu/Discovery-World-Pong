import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import StateMachine from 'javascript-state-machine';

const ChildComponent = forwardRef((props, ref) => {
  const [stateMachine, setStateMachine] = useState(null);

  useEffect(() => { 
    const fsm = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'increment', from: 'idle', to: 'incrementing' },
        { name: 'idle', from: 'incrementing', to: 'idle' },
      ],
      methods: {
        onIncrement: () => {
          console.log('incremented');
        },
      },
    });

    if (ref) {
      ref.current = fsm;
    }
  }, [ref]);

  return null;
});

export default ChildComponent;