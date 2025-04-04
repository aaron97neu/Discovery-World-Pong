#! /bin/bash
set -x

# We have 4 screens in the following layout:
#
#                     ----------------------------------
#                     |          |   ____   |          |
#                     |          |  /o  o\  |          |
#                     |          |  | __ |  |          |
#                     |          |  \____/  |          |
#                     |          |          |          |
#                     | 1 DP11   | 2 DP-3   | 3 DP-5   |
#                     | Left Info| ClckTwr  | Right    |
#                     | Screen   |          | Info     |
#                     |          |          | Screen   |
#                     |          |          |          |
#                     |          |          |          |
#                     ----------------------------------
#
#
#   ----------------------------------------------------------------------
#   |                                                ___                 |
#   |                                                                    |
#   |                                                                    |
#   |                                                                    |
#   |                            Main Play Area                          |
#   |                             0 HDMI-0 (Primary)                     |
#   |                                            *                       |
#   |                                                                    |
#   |                                                                    |
#   |                            ___                                     |
#   ----------------------------------------------------------------------
#
# Likely monitor configuration:
#$ DISPLAY=:0 xrandr --listactivemonitors 
#Monitors: 4
# 0: +*HDMI-0 1920/478x1080/269+0+0  HDMI-0
# 1: +DP-1 1920/521x1080/293+1920+0  DP-1
# 2: +DP-3 1920/521x1080/293+3840+0  DP-3
# 3: +DP-5 1920/521x1080/293+5760+0  DP-5
# Get the screen height

# Fix for ssh/remote connections:
export DISPLAY=:0

function launch_browser() {
    local profile=$1
    local url=$2
    local display=$3
    
    # Some windows (human visualizer mostly) crash after a few hours/days due to
    # a memory leak that I spent way too much time failing to find. This will
    # just restart it. Def a band-aid
    while true; do
        # Launch browser instance
        firefox -P "$profile" --kiosk --new-instance --new-window "$url" --kiosk-monitor "$display" # > /dev/null 2>&1
        echo "Firefox ($profile) exited. Restarting..."
    done
}

# Ensure and other previous windows are closed
# TODO: This won't work successfully if open_windows.sh is already running.
# We can't do ./close_windows.sh as that will kill this script. 
killall firefox

# TODO: Put together a framwork so that this can work with different deployments
# which have different 
launch_browser neural-net-visualizer http://localhost:5002 0 &
sleep 2
launch_browser clocktower-visualizer http://localhost:5003 2 &
sleep 2
launch_browser human-visualizer http://localhost:5001 1 &
sleep 2
launch_browser gameboard http://localhost:5000 3 &
sleep 2

# Stop printing out lines as they are executed
set +x
# Stay alive
while true;
do
	sleep 5
done
