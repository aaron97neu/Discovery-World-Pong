#! /bin/sh

# This allows the script to be run over a SSH session. It's almost always 0, but
# There has been an occasion where it's been switched to 1 for some reason. This
# should be sorted out and hardened at some point.
export DISPLAY=:0

firefox -CreateProfile neural-net-visualizer
firefox -CreateProfile clocktower-visualizer
firefox -CreateProfile human-visualizer
firefox -CreateProfile gameboard

exit 0
