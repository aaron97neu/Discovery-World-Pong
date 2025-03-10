# Visualizers

These modules visualize different sections of the PONG game.
Each visualization is contained in its separate docker container,
and displayed on a different screen.

All these visualization modules are intended to only be **read-only**.
Display values sent over mqtt messages. No publishing messages.

## Clock Tower 

![alt text](/docs/assets/clocktower_viz.png)
This visualization represents the **Allen-Bradley Clock Tower** by Fitzugh Scott.
the blue spheres are the neural network activations, and
the red spheres represents the output from the AI matrix.

Three.js is used in a react application to visualize the Clock Tower with 
assets generated from blender.

see [/docs/guides/react.md](../../guides/react.md) for react tutorials and basic commands.

## Gameboard

![alt text](/docs/assets/gameboard_viz.png)
This is a visualization of the game state read from mqtt topics.
Similar to the Clock Tower, the gameboard also implements Three.js
in a react application to visualize the gameboard.

see **/docs/guides/react.md** for react tutorials and basic commands.

## Human Player

![alt text](/docs/assets/human_player_viz.png)
This is a visualization of the realsense depth camera from the mqtt messages,
using plain js through a pyhton http server.

The mqtt messages contains a base64 encoded jpeg which is published from the depth realsense camera
and the visualizer subscribes to those messages to display the jpeg.

**see here for the python library:** https://docs.python.org/3/library/http.server.html
**see here for mqtt js library:** https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.js

**known issues:** memory leak in website/browser over runtime

## Neural Network

![alt text](/docs/assets/neural_network_viz.png)
This is a visualization of the neuron activations and how the AI comes to decision based on a select neurons.
Similar to the Human Player visualization, a plain js, python http server is implemented here.

### AI
All paddle positioning decisions are made in API ai_paddle_control. refer to **docs/AI_method.md** for more specific information.

### Code Objective
The neural networks are reading the AI matrix from the shared resource **/src/shared/models**, 
and this neural network visualizer has helper functions/methods to understand the a select range of neuron(there are billions) decisions being made.

Scripts from `models/` dir are found in **/src/shared/models**, and brought in during buildtime. (See docker-compose.yml and Dockerfile)
These scripts provide the model weights which are used in conjunction with activation MQTT packets to provide neuron activation visualization
