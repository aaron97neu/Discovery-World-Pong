# Discovery World Pong - Keyboard Paddle Control
This repository contains the code behind the Keyboard Paddle Controller for the "Pong" exhibit at the Discovery World Museum in Milwaukee, WI

The 'a' and 'd' keys will move the paddle left and right respectively.

# Development
## Dependencies
Docker (and Docker Compose) are required to build the containers.
Other OCI compliant runtimes like Podman should work.

## Build
To build the keyboard-paddle-control container, run the following from the keyboard-paddle-control directory:
```
docker build -t keyboard-paddle-control .
```

### Start/stop the keyboard-paddle-control container
To start the container using docker run the following from the keyboard-paddle-control directory:
```
docker run -it --rm --name keyboard-paddle-control -e MQTT_BROKER=<IP ADDRESS OF THE MQTT BROKER> -e PADDLE_ID=bottom_paddle -v /dev:/dev --privileged keyboard-paddle-control:latest
```
To stop the container:
```
Press the 'q' key
```
