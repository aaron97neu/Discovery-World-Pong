# Game Engine

## Importance of State Machine

Abstraction in a codebase is a must for reliability, maintenance, and ease of development. It allows for modularity and simplifies the communication between different functions of the code. A state machine organizes the interactions during the game cleanly with the separated phases(states) based on the user input given.

## Pong State Machine

![alt text](/docs/assets/state_machine_diagram.png)

This state machine has 7 states which divides gameplay: 

`stopped` During this state, no soundtracks are being played, and visualizers are static.

`idle` During this state, the idle soundtrack is played, and the game is waiting for someone to enter the gameplay area visualized by the player_ready arrow. 

`intro` During this state, the audio engine plays the introduction soundtrack to the booth and the gameboard shows the player a tutorial.

`level1` During this state, the audio engine plays the level1 intro and soundtrack, the game engine selects the level 1 AI trained model. if AI wins, state returns to idle after playing the level defeat soundtrack. If player wins moves to level 2.

`level2` During this state, the audio engine plays the level2 intro and soundtrack, the game engine selects the level 2 AI trained model. if AI wins, state returns to idle after playing the level defeat soundtrack. If player wins moves to level 3.

`level3` During this state, the audio engine plays the level3 intro and soundtrack, the game engine selects the level 3 AI trained model. if AI wins, state returns to idle after playing the level defeat soundtrack. If player wins moves to next state.

`outro` After game ends, audio engine plays a thanks for playing sound track and state loops back to idle phase.

## State Machine Implementation

State Machine module was implemented using the [transitions python package](https://pypi.org/project/transitions/) in [shared/py_packages/dw/state_machine] such that any module can access the state machine. In the future, to add more levels, or branched gameplay, all that is required is adding another state, and linking the required AV assets for implementation.

### Observers & Module Interactions

The modules use a combination of an Observer & State Machine patterns to detect changes in the game from the MQTT topics. The Observer pattern is mostly used when you have an object or a set of objects (known as the Observers) that want to be informed/updated about any changes in the state of one or more objects. The observers hold the previous state and notifies other services of any changes. In this case we are observing the base_state machine, player scores, paddle movements and other topics. The modules are designed such that the game_engine does not need call for other modules to execute code, rather the modules execute the code event-based. 