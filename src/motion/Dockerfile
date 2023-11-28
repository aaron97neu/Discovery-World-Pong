# This dockerfile was quickly made to dockerize the application it has not been optimized.
FROM ubuntu:22.04 AS builder
ENV PYTHONDONTWRITEBYTECODE=1
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install curl sudo lsb-base lsb-release -y
ENV DEBIAN_FRONTEND=noninteractive
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN sudo apt-get install software-properties-common -y
RUN sudo add-apt-repository ppa:deadsnakes/ppa
RUN sudo apt-cache policy python3.9
RUN sudo apt-get install python3.9 -y
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1
RUN sudo apt-get install python3.9-dev python3.9-distutils python3.9-venv pkg-config libcairo2-dev gcc libdbus-1-3 libdbus-1-dev libgirepository1.0-dev -y
RUN python -m ensurepip && python -m ensurepip --upgrade
WORKDIR /app
COPY shared ./shared
COPY motion/requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN python -m pip install --upgrade pip && python -m pip install --no-compile --no-cache-dir -r requirements.txt 

FROM ubuntu:22.04 AS final
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install curl sudo lsb-base lsb-release -y
ENV DEBIAN_FRONTEND=noninteractive
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN sudo apt-get install software-properties-common -y
RUN sudo add-apt-repository ppa:deadsnakes/ppa
RUN sudo apt-cache policy python3.9
RUN sudo apt-get install python3.9 -y
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1
RUN sudo apt-get install python3.9-distutils -y
RUN apt-get install ffmpeg libsm6 libxext6 -y
RUN sudo mkdir -p /etc/apt/keyrings
RUN curl -sSf https://librealsense.intel.com/Debian/librealsense.pgp | sudo tee /etc/apt/keyrings/librealsense.pgp > /dev/null
RUN sudo apt-get install apt-transport-https -y
RUN echo "deb [signed-by=/etc/apt/keyrings/librealsense.pgp] https://librealsense.intel.com/Debian/apt-repo `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/librealsense.list
RUN sudo apt-get update -y
RUN sudo apt-get install librealsense2-dkms -y
RUN sudo apt-get install librealsense2-utils -y
RUN sudo apt-get install librealsense2-dev -y 
RUN sudo apt-get install librealsense2-dbg -y
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /opt/venv /opt/venv
COPY motion .
ENV PATH="/opt/venv/bin:$PATH"
CMD ["python", "motion_driver.py"]
