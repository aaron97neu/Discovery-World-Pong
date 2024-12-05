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

def test_visual(mqtt_client):
    ###########
    # Arrange #
    ###########
    base64picture = "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"

    #######
    # Act #
    #######
    mqtt_client.publish("depth/field", base64picture)


    ##########
    # Assert #
    ##########
    assert(True)


    ###########
    # Cleanup #
    ###########
    

def on_connect(client, userdata, flags, rc, properties=None):
    logging.info("MQTT Client connected with result code " + str(rc))
    
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
