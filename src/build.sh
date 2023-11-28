#!/bin/bash

# docker build -t dw_ai -f ./ai/Dockerfile .
# docker build -t dw_depthfeed -f ./depthfeed/Dockerfile .
# docker build -t dw_game -f ./game/Dockerfile .
# docker build -t dw_motion -f ./motion/Dockerfile .
# docker build -t dw_visualization -f ./visualization/Dockerfile .
# cd pong-react
# docker build -t dw_pong-react -f ./Dockerfile .
# cd ..
# cd visualization-react
# docker build -t dw_visualization-react -f ./Dockerfile .
# cd ..


podman build -t dw_ai -f ./ai/Dockerfile .
podman build -t dw_depthfeed -f ./depthfeed/Dockerfile .
podman build -t dw_game -f ./game/Dockerfile .
podman build -t dw_motion -f ./motion/Dockerfile .
podman build -t dw_visualization -f ./visualization/Dockerfile .
cd pong-react
podman build -t dw_pong-react -f ./Dockerfile .
cd ..
cd visualization-react
podman build -t dw_visualization-react -f ./Dockerfile .
cd ..
