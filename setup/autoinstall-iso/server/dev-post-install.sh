#!/usr/bin/env bash
set -x -e

#############
# Variables #
#############
username=$USER
devtools=false
ovpn='physical-twin.ovpn' # OpenVPN conf file, assumed to be in same directory

#############################
# Install Required Software #
#############################
# Things to be installed:
# unattended-upgrades - for automatic security updates
# docker - dw-pong is containerized
# nvidia-container-toolkit - give access to the GPU
# ubuntu-desktop - GUI for pong
# RealSense SDK - For camera support

# Nvidia Drivers:
# Server edition wants to install the non-graphical nvidia server drives.
# We need to switch to grahical drivers
sudo ubuntu-drivers install

# Download package information 
sudo apt-get update

# Do the desktop seperate, we don't want all the extras and it's a big install
sudo apt-get install -y \
	--no-install-recommends ubuntu-desktop

# Development note - we restarted the server here

# Install additional software we need
sudo apt-get install -y \
	firefox \
	chromium-broswer \  # Chrome is easier to move around the screen than firefox
	xdotool \           # Used for moving widnows, emulating keypresses
	unattended-upgrades # automatic security updates

# Install optional development tools
if $devtools ; then
	sudo apt-get install -y \
		nvtop \
		neovim \
		inotify-tools
fi

##############
# Networking #
##############

sudo apt-get install -y \
	network-manager \
	network-manager-openvpn

# TODO: sed this
# sudo vim /etc/netplan/00-installer-config.yaml 
# Add renderer:
# ```
# # This is the network config written by 'subiquity'
# network:
#   renderer: NetworkManager
#   ethernets:
#     enp2s0:
#       dhcp4: true
#   version: 2
# ```
# sudo vim /usr/lib/NetworkManager/conf.d/10-globally-managed-devices.conf
# ```
# [keyfile]
# unmanaged-devices=*,except:type:wifi,except:type:ethernet,except:type:gsm,except:type:cdma
# ```

sudo systemctl restart NetworkManager

sudo nmcli dev set enp2s0 managed yes
sudo nmcli c import type openvpn file $ovpn
sudo nmcli connection up DiscoveryWorld


# Enable unattended-upgrades
sudo unattended-upgrades -d

# Docker
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
sudo snap remove docker

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker dwpong

# Add Nvidia container toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
	sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
	&& curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
	sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
	sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

########################
# Source Code Download #
########################
# Check if we need to generate a new key
if [ ! -f ~/.ssh/dw_deploy.pub ]; then
	# Generate deploy key
	ssh-keygen \
		-N '' \
		-a 128 \
		-C 'Discovery World Pong GitHub Deploy Key' \
		-f ~/.ssh/dw_deploy \
		-t ed25519
fi
echo '```'
cat ~/.ssh/dw_deploy.pub
echo '```'

echo "Please enter the above-printed key into the git repository as a deploy key. Once complete hit enter to continue"
read

# Configure git
git config --global core.sshCommand "ssh -i ~/.ssh/dw_deploy"
git config --global init.defaultBranch main
ssh-keyscan -H github.com >> ~/.ssh/known_hosts

# Create space for repo
sudo mkdir /opt/pong
sudo chown $USER:$USER /opt/pong 
cd /opt/pong

# avoid nested dirs
# https://stackoverflow.com/a/16900010
git init
git remote add origin git@github.com:Rockwell-Automation-Inc/Discovery-World-Pong.git
git fetch origin
git checkout -b main --track origin/main # origin/master is clone's default

# Enable CI/CD
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFjs+VwfElX0NmRQ5GNRATpOsaFqP72t3iS7lcAdr2l8 github-continuous-deployment' >> ~/.ssh/authorized_keys
echo '```'
ssh-keyscan -H localhost 2>/dev/null
echo '```'

echo "Please copy the above-printed key into the GitHub Actions variables as the relevant public key. Once complete hit enter to continue"
read

# Add Firefox profiles to use in open_windows.sh
/opt/pong/setup/create_profiles.sh 

# Automatic System Restart
config_file='/etc/apt/apt.conf.d/50unattended-upgrades'

config_line='Unattended-Upgrade::Automatic-Reboot '
sudo grep -q "^$config_line" $config_file; greprc=$?
if [[ $greprc -eq 1 ]]; then
	echo "Appending Automatic reboot option to $config_file"
	echo 'Unattended-Upgrade::Automatic-Reboot "true";' | sudo tee -a $config_file
else
	echo "Automatic reboot already configured. Not touching that configuration"
fi

config_line='Unattended-Upgrade::Automatic-Reboot-WithUsers '
sudo grep -q "^$config_line" $config_file; greprc=$?
if [[ $greprc -eq 1 ]]; then
	echo "Appending Automatic Reboot With Users option to $config_file"
	echo 'Unattended-Upgrade::Automatic-Reboot-WithUsers "true";' | sudo tee -a $config_file
else
	echo "Automatic reboot with users already configured. Not touching that configuration"
fi

config_line='Unattended-Upgrade::Automatic-Reboot-Time '
sudo grep -q "^$config_line" $config_file; greprc=$?
if [[ $greprc -eq 1 ]]; then
	echo "Appending Automatic Reboot time option to $config_file"
	# UTC - 9pm local (central US) time
	echo 'Unattended-Upgrade::Automatic-Reboot-Time "02:00";' | sudo tee -a $config_file
else
	echo "Automatic reboot time already configured. Not touching that configuration"
fi

# Splashtop Management
mkdir /tmp/st && cd /tmp/st
wget https://download.splashtop.com/linux/STB_CSRS_Ubuntu_v3.6.4.0_amd64.tar.gz
tar xzf STB_CSRS_Ubuntu_v3.6.4.0_amd64.tar.gz
sudo apt install -y -f
sudo dpkg -i Splashtop_Streamer_Ubuntu_amd64.deb

# Depth-sensor setup
cd ~
sudo apt-get install curl sudo lsb-base lsb-release -y
sudo apt-get install ffmpeg libsm6 libxext6 -y
sudo apt install -f

# Ensure the keyring directory exists
sudo mkdir -p /etc/apt/keyrings

# Add Intel RealSense repository key
# Jammy update is the most recent update that is supported by Intel RealSense as of March 2025
# **Look at overview.md for more information**
sudo curl -sSf https://librealsense.intel.com/Debian/librealsense.pgp | sudo tee /etc/apt/keyrings/librealsense.pgp > /dev/null
sudo apt-get install apt-transport-https -y

# Add the repository
sudo echo "deb [signed-by=/etc/apt/keyrings/librealsense.pgp] https://librealsense.intel.com/Debian/apt-repo jammy main" | sudo tee /etc/apt/sources.list.d/librealsense.list

# Update and install RealSense packages
sudo apt-get update
sudo apt-get install -y librealsense2-dkms librealsense2-utils librealsense2-dev librealsense2-dbg

########
# TODO #
#######
# Auto-login
# /etc/gdm/custom.conf

# Package update check setup frequency


# No-sleep
# /home/dwpong/.config/dconf/user

# Arrange displays and resolutions

# Disable notifications and enable DnD mode

# Window autostart
cp /opt/pong/setup/pong_start.desktop ~/.config/autostart/

echo 'All finished. Please restart the system'