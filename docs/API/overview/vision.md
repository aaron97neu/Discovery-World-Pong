# Discovery World Pong's Development Vision
Written in December 2023 by Aaron Neustedter

The history of this exhibit is quite a long one.
It has been developed by many developers with different expertises and skill levels - from undergraduates to interns to industry professionals, often with little or no overlap or handoff procedures.
Due to this, each developer used languages and techniques that they were familiar with - not an inherently bad decision.
However, the result of this is that each of the components tend to be written with disjoint techniques in different languages and stitched together with MQTT.
The original requirement of loosely coupled modular components to facilitate machine learning competitions didn't help this.
This isn't inherently a bad thing, but it leads to a jarring maintenance experience that requires the maintenance team to be experts in each language/technique.
Not a good recipe if you want the exhibit to have a low cost/skeleton crew maintenance.
Because of this, the team tasked to revitalize the exhibit in 2024 asked me to take a look at our situation and come up with a vision for the project moving forward.


In this manifesto, I will summarize the current architecture, outline to possible long term options, and propose the option I subjectively feel is best.

## The current architecture
Paul Schmirler's MQTT API diagram, while not all encompassing, provides a valuable starting point for discussions of the current modules:
![MQTT Messaging Diagram](assets/mqtt_messaging_diagram.png)

To help illustrate the situation, I will summarize each component, its development methodology, and its purpose.
### Off the Shelf Components
#### MQTT-Explorer
This unmodified MQTT client providing a GUI for visualizing and debugging MQTT messaging.

#### MQTT-Broker
AN unmodified mosquitto server for brokering messages 

### Custom Developed Components
#### AI (ai-paddle-control)
This python module reads the current game state, applies the appropriate pre-trained model, and then publishes its prediction.

#### Gameboard Visualization (gameboard)
This NPM react app provides the visualization of the current game state is a visually pleasing 3D model meant for player interaction.

#### Clock Visualization (clocktower-visualizer)
This NPM react app provides a personification of the opponent, who reacts emotionally to the game state and events such as scoring.

#### Neural Visualization (neural-net-visualizer)
This python web-server visualizes the neural network's nodes and activations. The web application is a simple javascript/html application.

#### Depthfeed Visualization (human-visualizer)
Extremely similar architecture as the Neural Visualization, uses a python webserver to host a simple javascript/html application showing a depth map represtation of the Intel Realsense camera. 

#### Realsense (human-paddle-control)
Python module that reads the depth camera, identifies humans, and then publishes the position of the human's presence.

#### Game (game-engin)
Python module which controls central game logic. Reads player actions and outputs current game state including paddle positions, ball positions, score, level, etc.

## Architecture options moving forward
### Goals
- Low maintenance: Large dependency chains or multiple significant expertise requirements should be avoided  
- Modular "Player" components: Both P1 and P2 should be able to be switched for different AIs created by disjoint groups, different human controls (a keyboard, 2 player game), or a new control scheme that has not been conceived. This will help with automated and manual testing without a depth camera as well as the potential for future "AI Tournaments". Additional work will have to be done to make this pluggable and hot-swappable, but the underlying infrastructure should remain ready to support this.
- "Pencils Down": This refresh has a limited amount of development time. Once this time is up, even if we have not completed everything we have committed, the application _must_ continue to work in a sustainable state.
- Ease of contribution: This project has been maintained as a back-burner item for many of its maintainers. Therefore, it must be easy for a maintainer to jump in, re-familiarize themselves, and make quick fixes. In addition, outside parties offering help should be able to get up to speed quickly. 

### A single application
Single, unified, and tightly integrated applications simplify many parts of development and eliminates the "modularity cost" that we currently see in the project. 
In addition, this will force a single language and architecture to be used.
However, if the requirement for "pluggable players" persists, it will still force some modularity to be used.
The largest downside of the approach is that it is a gamble.
If finished complete and on time, this could replicate the current exhibit with some substantial foundational improvements.
However, if unfinished when time is called, we will have to pick between two incomplete implementations.
While I have faith in my developer's abilities, I am unwilling to commit their resources to such a gamble.

### A web-based approach
Similar to the single, unified application, but Discovery World's exhibit is simply pointed to a (potentially publicly accessible) web page, like it is a flash game of the 2000s.
This has a number of improvements over the previous option.
First, almost all the components are web-based to begin with, allowing significant code-reuse.
Second, the most volatile infrastructure would be a server that is managed by the maintainers and much easier access and maintain, without needing a NAT buster or physical access to the exhibit.
This is more in-line with mordern software development practices.
This would inherently solve many of the maintenance issues that are currently very high priority.
However, there will still be maintenance issues.
No operating system is set up out of the box to boot, login, and open several web pages to specific screens, so some tinkering will have to be done with the client machine, and that tinkering must be maintained.
Even with these improvements, I still hesitate to go after this "all or nothing" approach. 

### Maintaining the current status-quo
This approach would maintain the current codebase, with a singular focus on infrastructure, maintenance procedures, and documentation.
No application code development will be done.
This will certainly ensure a singular focus on the maintainability of the exhibit, but there are serious problems with the application code that - while tolerable - should be fixed.

### Piecemeal Refactoring
A variant of previous, we start by committing to maintain the status-quo, but develop an "optimal" refactored end state - say each module is re-implemented in Unity - and refactor each module as they become relevant.
This allows us to maintain a working state all the way through development, to prioritize infrastructure improvements, and target the modules that need the most work.

### Conclusion and Opinion
In my opinion, this final option - Piecemeal refactoring - is best one.
It has the smallest probability of failure, maintains the modular architecture despite its costs, but allows for a future of easier maintenance.
The question now is what is the optimal end state? What language and architecture should we be aiming for?

### Refactoring Targeted End State
We have a few possible options for our end state.
The majority of the current system was developed in python for the underlying logic and nodejs & traditional js/html for visualizations, so picking one of these could make sense.
- Nodejs is appropriate for backend or simulation tasks, however its notorious dependency chain is cause for maintenance concern. In addition, it is disliked by the current round of maintainers.
- Python is an easy to learn but is would have to be coupled with nodejs for frontend web visualizations (as it currently is).
- Unity is a versatile game engine that can be target Linux, Windows, or web. It has native SDK support for the depth camera with advanced features and is a strength of the current team. However, questions remain in its containerization and licensing expenses.

My vote is for the following:
Spend a minimal amount of time evaluating Unity.
There is documentation showing its ability to be containerized for CI/CD purposes but can a deployed unity application be containerized? In addition, confirm its licensing challenges.
If both of these questions come back positive, start refactoring with unity-based docker modules feeding webpages as the target, otherwise proceed with the current python + nodejs + react stack.
