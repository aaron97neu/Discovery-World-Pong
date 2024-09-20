#! /bin/sh

set -x 
export DISPLAY=:0

# Find and kill keepalive script
pkill -f open_windows_pt.sh
killall firefox

exit 0
