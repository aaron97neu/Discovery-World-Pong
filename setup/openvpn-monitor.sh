#!/bin/bash

# Define the OpenVPN connection name (replace 'my_vpn' with your actual name)
CONNECTION_NAME="mgmt-OVPN"

# Function to check OpenVPN status
check_vpn_status() {
    vpn_status=$(nmcli con status "$CONNECTION_NAME" | grep "State:" | awk '{print $2}')
   if [[ "$vpn_status" == "connected" ]]; then
      echo "OpenVPN connected."
      exit 0 # Success
   else
      echo "OpenVPN not connected!"
      exit 1 # Failure - indicating disconnection
   fi
}

# Main loop
while true; do
   check_vpn_status

   if [ $? -eq 1 ]; then # Check if check_vpn_status returned an error (code 1)
     echo "Attempting to reconnect..."
     nmcli con up "$CONNECTION_NAME"
      sleep 10 # Give time for reconnection attempt
   fi

   sleep 60 # Check every minute
done
