# Discovery World Pong
This repository contains the code behind the Rockwell Automation "Pong" exhibit at the Discovery World Museum in Milwaukee, WI

An overview of this repo's history and goals can be found in the [vision.md](/docs/vision.md) document.

# Contributing
See [Contributing.md](CONTRIBUTING.md)

# Development
## Dependencies
Docker (and Docker Compose) are required to build the containers.
Other OCI compliant runtimes like Podman should work.
To run the exhibit, an Intel Realsense 435 camera and drivers is required.
See [post-install.sh](setup/post-install.sh) for a full exhibit setup script from a vanilla Ubuntu install.

## Build
To build all the containers, run the following:
```
docker compose build
```

The docker container file provides the following profiles:
- **dev:** Build additional development containers including a mqtt gui and a 
           single screen containing all exhibit screens
- **prod:** Build only the containers used on the exhibit
These can be run with the following commands:
```
docker compose --profile dev up
docker compose --profile prod up
```

Rockwell Automation requires all machines (incl containers) to have a ZScaler
SSL certificate installed in order to connect to the internet. These containers
support this and will install the certs with the build argument `CERTS=zscaler`
as shown below. Without this arguemnt, the certificates will not be installed.
```
docker compose up --build-arg CERTS=zscaler
```

### Tags
The latest `reslease/x.y.z` tag is the most recent stable version. 
The `latest` tag is not used.
Maintainers should always be specifying a version when pulling, and if a maintainer truely needs
"the latest version", `next` better communicates that it is the bleeding edge.

The CI/CD system will automatically build and push containers for all `main` and PR commits.
All proposed code should be built in the same way that the final code is built so that any 
discrepancies in the build environment between developer machines and the release built system are 
accounted for.
In addition, this facilitates easier testing by pulling from the registry instead of building. 
This allows developers to test proposed code an exhibit twin (or any other suitable test system) by
just pulling from the compose instead of pulling the source in rebuilding, and removes any potential
issues with local build system.
Finally, in an emergency, the exhibit itself can use proposed code from any published commit while a
hotfix is deployed to the main codebase.

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
