# Docker

## Containerization Benefits

Containers encapsulate an application as an executable software package that bundles application code with all its related configuration files, dependencies and libraries that it needs to run. Containerized apps are isolated because they don’t bundle within a copy of the OS. Instead, the developer installs an open-source runtime engine (for example, the Docker runtime engine) on the host’s OS becoming the conduit for containers to share an OS with other application containers on the computing system.

You can also share other application container layers, like common libraries and bins, among multiple containers. It eliminates the overhead of installing and running an OS within each app, making containers smaller in capacity (lightweight) and faster to start up, which drives higher server efficiencies. When you isolate apps and containers, you reduce the chance of malicious code in one container impacting others or invading the host system.

## Container Structure

![alt text](/docs/assets/docker_container_structure.png)

Each module exists as its own container and communicates to each other using mqtt topics that are accessible from the mqtt broker container. during the build process the requisite containers gain access to the [shared] or [tts] folders.

## Docker Compose

Docker Compose is a tool for defining and running multi-container applications. It is the key to unlocking a streamlined and efficient development and deployment experience.

Compose simplifies the control of your entire application stack, making it easy to manage services, networks, and volumes in a single, comprehensible YAML configuration file. Then, with a single command, you create and start all the services from your configuration file. See Resources for syntax specification link.

## Dockerfiles

Docker builds images by reading the instructions from a Dockerfile. A Dockerfile is a text file containing instructions for building your source code.

### Build Stages

Dockerfiles can get big and lead to long build times, build stages can short successive compilation of containers. Multistage builds make use of one Dockerfile with multiple FROM instructions. Each of these FROM instructions is a new build stage that can COPY artifacts from the previous stages. By going and copying the build artifact from the build stage, you eliminate all the intermediate steps such as downloading of code, installing dependencies, and testing. All these steps create additional layers, and you want to eliminate them from the final image. See Resources for documentation link.

## Resources

If new to containerization and docker, here are some recommended
documentation & tutorials to read through and attempt.

https://docs.docker.com/reference/compose-file/services/ - docker compose syntax
https://docs.docker.com/build/building/multi-stage/ - docker build stages

https://www.docker.com/101-tutorial/
https://docker-curriculum.com/
https://docs.docker.com/get-started/introduction/