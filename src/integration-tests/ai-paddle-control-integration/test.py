import sys
import logging
import json
import threading
import time
import paho.mqtt.client as mqtt
import paho.mqtt.subscribe as subscribe
import paho.mqtt.publish as publish
import os
import pytest
from collections import namedtuple

#containers built settings
#hostname = "mqtt-broker"
#import shared.config as Config

#command prompt settings
hostname = os.environ.get ('MQTTBROKER',"localhost")
import shared.code.config as Config

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('paho.mqtt.client')
logger.setLevel(0)

# global var to store last message from each topic. This is used spin lock on
# messages creating a pseudo blocking read.
mqtt_data = {}

ai_mqtt_packet = {
    'puck/position': '{"x": 95.5, "y": 25}', # y: 23
    'player1/score': '{"score": 0}',
    'player2/score': '{"score": 2}',
    'paddle1/position': '{"position": 122.88}',
    'paddle2/position': '{"position": 120.0}', #114.0
    'game/level': '{"level": 2}', 
    'game/frame': '{"frame": 370}' #375
    }

def test_ai_responses(mqtt_client):
    ###########
    # Arrange #
    ###########


    #######
    # Act #
    #######

    # Send the equalivent gamestate get AI response
    for k, v in ai_mqtt_packet.items():
        logging.info(f"Sending {v} to {k}")
        mqtt_client.publish(k, v)
    


    ##########
    # Assert #
    ##########
    p1act = poll_for_message(mqtt_data, 'paddle1/action')
    logging.info(f"P1 Action: {p1act}")

    p1frame = poll_for_message(mqtt_data, 'paddle1/frame')
    logging.info(f"P1 Frame: {p1frame}")

    activation = poll_for_message(mqtt_data, 'ai/activation')
    logging.info(f"Activation: ")
    
    assert(True)


    ###########
    # Cleanup #
    ###########

    

def on_connect(client, userdata, flags, rc, properties=None):
    logging.info("MQTT Client connected with result code " + str(rc))
    # Setup subs to validate response
    client.subscribe('paddle1/action') # 2
    client.subscribe('paddle1/frame') # 375
    client.subscribe('paddle2/action')
    client.subscribe('paddle2/frame')
    client.subscribe('ai/activation')
    
def on_message(client, userdata, msg):
    logging.debug("on_message: " + msg.topic + " " + str(msg.payload))
    payloadContent = json.loads(msg.payload)
    userdata[msg.topic] = payloadContent


# Request arguement gives information about the test requester
# Technically our mqtt_client fixture is requesting the built in request fixture
@pytest.fixture
def mqtt_client(request):
    """
    MQTT Client Fixture

    This fixture provides a MQTT client that is connected to the broker and sets
    up subscriptions. In addition, it sets up an on_message callback that
    modifies the MQTT client user_data object to be a dictonary of the last
    message send to each topic, with the topic names being the keys

    TODO: I'd love each test to manage it's own subscriptions, but it seems
    to fail when I try this. Investigate further
    """

    # Create an MQTT client instance
    logging.info("Creating MQTT Client")
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=request.node.name, userdata=mqtt_data)
    logging.info("MQTT Client Created")

    client.on_connect = on_connect
    client.on_message = on_message

    #request for connection
    logging.info("MQTT Client Connecting")
    client.connect_async(hostname, port=1883, keepalive=60)
    
    # Start the loop
    logging.info("MQTT Client Requesting Prosessing Loop Start")
    client.loop_start()
    logging.info("MQTT Client Processing Loop Start Request Successful")
    
    #wait for connection before returning
    while (client.is_connected()):
        time.sleep(0.2)
    logging.info("MQTT Client Validated Sucessful Connect")

    # https://docs.pytest.org/en/stable/how-to/fixtures.html#teardown-cleanup-aka-fixture-finalization
    logging.info("Yielding MQTT client to test")
    yield client

    logging.info("Teardown started. Disconnecting Client")
    client.disconnect()


def poll_for_message(mqtt_data, topic, message=None, polltime=0.2, timeout=10):
    """
    Poll For Message (on MQTT Message Bus)
    
    Helper method that blocks until a message arrives. Assumes that there is a
    on_message callback inserting messages into mqtt client user data object
    
    Arguments:
    * `mqtt_data`: Client User data object. Assumes that object is a dictonary with
        each key being the topic and each value being the most recent message 
        received
    * `topic`: String representation of the topic requested
    * `message`: json deseralized representation of the desired message. If None, 
        will return on any message
    * `polltime`: Time in seconds to poll
    * `timeout`: Time in seconds to timeout if no new messages 

    Returns:
    * Message received in JSON deseralized via json.loads()
    * `None` if timeout triggers
    """
    
    # Disable info level logging in this function, it was validated working
    # This expires at the end of the function call
    logging.getLogger().setLevel(logging.INFO)

    logging.debug("|| POLL FOR MESSAGE ||")
    starttime = time.time()
    # Loop until timeout is reached
    while (time.time() - starttime) < timeout:
        logging.debug(f"|| POLL FOR MESSAGE || Poll Loop Start: mqtt_data: {mqtt_data.keys()}")
        # Check if any messages exist for given topic
        if (topic in mqtt_data.keys()):
            logging.debug(f"|| POLL FOR MESSAGE || {topic} found. Looking for message: {message}")
            # If any message was requested, return the body
            if message == None:
                logging.debug(f"|| POLL FOR MESSAGE || Returning {mqtt_data[topic]}")
                return mqtt_data[topic]

            # Compare received message to requested message
            logging.debug(f"|| POLL FOR MESSAGE || Message found {mqtt_data[topic]}")
            if mqtt_data[topic] == message:
                logging.debug(f"|| POLL FOR MESSAGE || Returning {mqtt_data[topic]}")
                return mqtt_data[topic]
        logging.debug(f"|| POLL FOR MESSAGE || Sleeping {polltime}")
        time.sleep(polltime)
    
    # timeout triggers
    logging.debug(f"|| POLL FOR MESSAGE || Timeout triggered")
    return None