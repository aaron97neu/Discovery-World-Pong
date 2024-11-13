# Discovery World Pong
This forked repository contains the code behind the Rockwell Automation "Pong" exhibit at the Discovery World Museum in Milwaukee, WI. This forked repo is where the MSOE Senior Design Team 2024-2025 is making their contributions to the exhibit. The names of the Senior Design Team are as follows:
- Virginia Conaty
- Matthew Wehman
-
-
-

An overview of this repo's history and goals can be found in the [vision.md](/docs/vision.md) document.

# Contributing
See [Contributing.md](CONTRIBUTING.md)

Steps from Aaron Neustedter for MSOE Senior Design Team to contribute to the main repo
1. Fork the repository.
2. Create a branch with the form ```feature/feature-name``` on the fork. Push early and often.
3. Once your feature starts to take shape, open a WIP PR on our repo. It's helpful for us to see your code early as this speeds review time and may help us reorient you if you are barking up the wrong tree.
4. Once your code is ready to merge, mark it as ready and shoot one of us an email. We will review it, ask for changes, and merge it.

# Development
## Dependencies
Docker (and Docker Compose) are required to build the containers.
Other OCI compliant runtimes like Podman should work.
To run the exhibit, an Intel Realsense 435 camera and drivers is required.

See [post-install.sh](setup/post-install.sh) for a full exhibit setup script from a vanilla Ubuntu install. When adding the keys to github, ensure the deploy key(the first key) is marked as read and write permissions. This allows you to push and pull from the repo.

**Important:**
After running ```post-install.sh```, in order to push the forked repository edit/create a file ```~/.ssh/config``` and add in the following configuration:
```
Host github.com
  IdentityFile ~/.ssh/deploy_key
  IdentitiesOnly yes
```
where ```deploy_key``` is replaced with the name of your ssh public key that is being used for github. This ensures you have the correct permissions.

## Build
To build all the containers, run the following:
```
docker compose build
```

### Start/stop the exhibit using docker-compose
To start the containers using docker-compose run the following:
```
docker compose up -d
```
To stop the containers using docker-compose run the following:
```
docker compose down
```

To open each GUI window in their positions used in the exhibit, run the following:
```
./setup/open_windows.sh
```
Keep in mind that unless the machine has its monitors configured similarly to the exhibit, the behavior is undefined.
To manually open the windows, open an internet browser to the following sites:
#### Gameboard
[http://localhost:5000](http://localhost:5000)
#### Human Visualizer (Depth Camera Heatmap)
[http://localhost:5001](http://localhost:5001)
##### Neural Network Visualizer
[http://localhost:5002](http://localhost:5002)
##### Clocktower Visualizer
[http://localhost:5003](http://localhost:5003)

To close all GUI windows, run the following
```
./setup/close_windows.sh
```


### MQTT Messaging
![MQTT Messaging Diagram](/docs/assets/mqtt_messaging_diagram.png "MQTT Messaging Diagram")
