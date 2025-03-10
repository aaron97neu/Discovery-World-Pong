#! /bin/sh

# Print out each line as it's executed
set -x 

# This allows the script to be run over a SSH session. It's almost always 0, but
# There has been an occasion where it's been switched to 1 for some reason. This
# should be sorted out and hardened at some point.
export DISPLAY=:0

# Find and kill keepalive script
# *_pt is sometimes used for the physical twin when there are differences.
# open_windows.sh should be modified to accommodate this.
pkill -f open_windows_pt.sh
pkill -f open_windows.sh
killall firefox

exit 0
