# Autostart and Setup
This module contains an image and scripts to automatically install linux, 
docker, realsense SDK, nvidia container support, partition the vm, add drivers,
attach peripherals and setup browser windows to load the Pong Game using the
autoinstall feature with ubuntu.

## Autoinstall
> Automatic Ubuntu installation is performed with the autoinstall format. You 
might also know this feature as “unattended”, “hands-off” or “preseeded” 
installation. Automatic installation lets you answer all configuration questions
ahead of time with an autoinstall configuration and lets the installation 
process run without any interaction

https://canonical-subiquity.readthedocs-hosted.com/en/latest/intro-to-autoinstall.html

The inclusion of this file is intended to provide the ability to 
exactly replication Ubuntu installations used in exhibits. Currently, this is 
not implemented, but can be used as a guide during manual installation of the
operating system.

This format is supported in the following installers:
- Ubuntu Server, version 20.04 and later
- Ubuntu Desktop, version 23.04 and later

For the Pong exhibit, only Ubuntu Server 22.04 has been tested. Ubuntu Server
24.04 LTS showed significant Nvidia driver issues immediatly after release and
has not been re-tested since. Ubuntu Desktop was not used as at the start of the
switch to Linux, autoinstall was not available for Ubuntu Desktop.

Refer to above link for tutorials, how-to-guides, and troubleshooting for
autoinstall

## Scripts

`autoinstall-user-data` This script was auto-generated during the installation
Ubuntu and contains all choices made during installation. The intention is to
use this file to automatically flash system with a fresh install if needed. This
is currently not setup, but can be used as documentation of OS setup and a guide
during manual installation.

`close_windows.sh` This script closes all browser windows associated with the
poing exhibit. This can be used when restarting all windows or to kill
misbehaving windows. Note that the script is quite crude, simply calling
`killall firefox`, so this will additionally kill other firefox windows not
associated with the exhbit

`create_profiles.sh` This script creates seperate profiles for each exhibit
window. This is required by firefox for technical reasons. This script should
only be run once for each installation of the exhibit

`open_windows.sh` This script opens and positions each window used by the
exhibit. This script uses firefox kiosk mode for full-screen and window
positioning. Because of occasional issues with firefox crashing due to memory
leaks in application code, each firefox instance is wrapped in an infinite loop
that relaunches the browser upon closing. Therefore, windows cannot be closed
manually and must be killed by `close_windows.sh`

`pong_start.desktop` Wrapper for `open_windows.sh` that allows the windows to be
opened via desktop shortcut or gnome's autostart feature. When this file is
placed in `~/.config/autostart`, it will be executed upon startup.

`pong_stop.desktop` Similar to `pong_start.desktop` but allows closing of all
windows

`post-install.sh` This script attempts to provide a semi-automated installtion
of all dependencies for the exhibit after the OS is installed. It currently does
not do this and needs a good coat of polish. It's starting to outgrow its 'quick
little bash script origins' and a reimplementation should be considered.

`refresh-browsers.sh` This goes to each browser windows and performs a refresh.
This is needed after updating any client side of on any of the visualizations.

## Exhibit Setup From Scratch

1. Install Ubuntu Server Edition 22.04 from scratch
    1. Ubuntu Server Edition was choosen as Desktop does not allow the use of
       the (yet to be implemented) autoinstall-user-data
    1. Ubuntu 24.04 was trialed but found that there were Nvidia Driver
       incompatibilities.
    1. Install, using the raw `autoinstall-user-data` file as a guide. 
       Deviations is fine, however, do not install 3rd party (Nvidia) 
       drivers at this stage. Wait until we install the desktop.
1. Once Ubuntu is installed, copy the `post-install.sh` script and VPN key 
   over to the machine. The home directory is fine. Execute `post-install.sh`
1. Follow along, noting the manual steps during network configuration and
   Github deploy key sections
