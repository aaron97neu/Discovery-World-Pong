const StateMachine = require('javascript-state-machine');
const fs = require('fs');
const visualize = require('javascript-state-machine');

// Define the state machine
const fsm = new StateMachine({
  init: 'solid',
  transitions: [
    { name: 'melt', from: 'solid', to: 'liquid' },
    { name: 'freeze', from: 'liquid', to: 'solid' },
    { name: 'vaporize', from: 'liquid', to: 'gas' },
    { name: 'condense', from: 'gas', to: 'liquid' }
  ]
});

// Generate the DOT representation
const dot = visualize(fsm);
console.log(dot.);


// Save the DOT representation to a file
// fs.writeFileSync('fsm.dot', dot, 'utf8');
console.log('DOT file saved as fsm.dot');