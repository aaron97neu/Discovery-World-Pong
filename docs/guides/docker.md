# Docker

## Containerization Benefits

Containers encapsulate an application as an executable software package that bundles application code with all its related configuration files, libraries, and any other userspace dependencies that it needs to run. Because of this, containerized apps do not have an requirements to run beyond a compatible kernel and runtime engine (for example, the Docker runtime engine). While userspace is typically highly isolated, the host’s OS is shared .

Generally, containers have significantly higher server efficiencies than the equivalent implemented via virtual machines. In addition, the isolation between containers can help ensures that failures in one module do not affect others. 

## Container Structure

![alt text](/docs/assets/docker_container_structure.png)

Each module exists as its own container and communicates to each other using mqtt topics that are accessible from the mqtt broker container. During the build process the requisite containers gain access to the [shared] or [tts] folders which reusable code boilerplate.

## Docker Compose

Docker Compose is a tool for defining and running multi-container applications. It is the key to unlocking a streamlined and efficient development and deployment experience.

Compose simplifies the control of your entire application stack, making it easy to manage services, networks, and volumes in a single, comprehensible YAML configuration file. Then, with a single command, you create and start all the services from your configuration file. See Resources for syntax specification link.

## Dockerfiles

Docker builds images by reading the instructions from a Dockerfile. A Dockerfile is a text file containing instructions for building your source code.

### Build Stages

Dockerfiles can get big and lead to long build times, build stages can short successive compilation of containers. Multistage builds make use of one Dockerfile with multiple FROM instructions. Each of these FROM instructions is a new build stage that can COPY artifacts from the previous stages. By going and copying the build artifact from the build stage, you eliminate all the intermediate steps such as downloading of compilers, installing build libraries, and testing. All these steps create additional layers, and you want to eliminate them from the final image. See Resources for documentation link.

## Resources

If new to containerization and docker, here are some recommended
documentation & tutorials to read through and attempt.

https://docs.docker.com/reference/compose-file/services/ - docker compose syntax
https://docs.docker.com/build/building/multi-stage/ - docker build stages

https://www.docker.com/101-tutorial/
https://docker-curriculum.com/
https://docs.docker.com/get-started/introduction/