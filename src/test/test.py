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


def test_presense_start(mqtt_client, human_present):
    """
    Test Presence Start/Stop

    This test looks at how the MQTT presense message interacts with the game's
    state (and therefore game/state MQTT Message). This test looks at the 
    "rising edge" where presence goes from false to true (Simulating a patron 
    entering the exhibit)
    """
    # https://docs.pytest.org/en/stable/explanation/anatomy.html
    # Define our Arrange, Act, Assert, Cleanup States

    ###########
    # Arrange #
    ###########
    mqtt_data = mqtt_client.user_data_get()
    logging.debug(mqtt_data)
    
    time_elapsed = 0
    check_interval = 0.1
    max_wait = 5
    state_messages = 0
    while True: #wait for mqtt broker update
        time.sleep (check_interval)
        time_elapsed = time_elapsed + check_interval

        if time_elapsed > max_wait:
            pytest.fail(f"Game did not start within {max_wait}s of presence being detected")

        if "game/state" in mqtt_data.keys():
            state_messages = state_messages + 1
            state = (mqtt_data["game/state"])['state']
            logging.info("game/state message: {state}")
            if state != 0:
                break


    logging.info(f"Game State message != 0 detected. Elapsed: {state_messages} messages")
    # Should be an integer representing the state of the game
    state = (mqtt_data["game/state"])['state']
    logging.debug(f"game/state: {state}")
    
    assert(state != 0)
 
def test_no_presense_stop(mqtt_client, human_present):
    """
    Test Presence Start/Stop

    This test looks at how the MQTT presense message interacts with the game's
    state (and therefore game/state MQTT Message). This test looks at both the 
    "rising edge" where presence goes from false to true and "falling edge"
    where presence goes from true to false (Simulating a patron entering and 
    leaving the exhibit)
    """
    # https://docs.pytest.org/en/stable/explanation/anatomy.html
    # Define our Arrange, Act, Assert, Cleanup States

    ###########
    # Arrange #
    ###########
    state = human_present
    assert(state != 0)


    #######
    # Act #
    #######
    logging.debug("Publish: motion/presence false")  
    mqtt_client.publish("motion/presence", "false")

    ##########
    # Assert #
    ##########
    time_elapsed = 0
    check_interval = 0.1
    max_wait = 300
    while ((mqtt_data["game/state"])['state'] != 0): #wait for mqtt broker update
        time.sleep (check_interval)
        time_elapsed = time_elapsed + check_interval
        
        if time_elapsed > max_wait:
            pytest.fail(f"Game did not stop within {max_wait}s of presence no longer being detected")

    state = (mqtt_data["game/state"])['state']
    logging.info(f"game/state: {state}. Elapsed: {time_elapsed}s")
    
    assert((mqtt_data["game/state"])['state'] == 0)


def test_moveBottomPaddleLeft(mqtt_client):
    logging.info("in move Bottom Paddle left")
    
    #line 170 of main in game_driver waits for subscriber.motion_presence
    mqtt_client.publish("motion/presence", "true")
    


def test_game_engine(mqtt_client):
    logging.info("Game Engine Test Started")
    mqtt_data = mqtt_client.user_data_get()
    logging.info (mqtt_data)
    
    ##############  Start the game-engine loop  #################################
    #line 170 of main in game_driver waits for subscriber.motion_presence
    logging.info("publish motion/presence false")  
    mqtt_client.publish("motion/presence", "false")
    time.sleep(2)

    logging.info("publish motion/presence true")  
    mqtt_client.publish("motion/presence", "true")
    
    while (not ("game/state" in mqtt_data.keys())): #wait for mqtt broker update
        time.sleep (0.5)
    temp = mqtt_data["game/state"]
    logging.info(f"game/state: {temp}")    
    #game_state(0 - wait for human presence, 1 - ready, 2 - running, 3 - game over )
    #mqtt_client.publish("game/state", payload=json.dumps({"state": state}))
    assert (mqtt_data["game/state"] != 0)


    logging.info("publish motion/position 0.0")
    mqtt_client.publish("motion/position", "0.0")           # motion/position value ranges from 0.0 to 1.0 which will change the paddle1/position
    while (not ("paddle1/position" in mqtt_data.keys())):   #wait for mqtt broker update
        time.sleep (0.5)
    temp = mqtt_data["paddle1/position"]
    logging.info(f"paddle1/position: {temp}")

    #move paddle position to the right edge
    logging.info("publish motion/position 1.0")
    mqtt_client.publish("motion/position", "1.0")  
    temp = mqtt_data["paddle1/position"]
    logging.info(f"paddle1/position: {temp}")

    ################################## Setting score #############################################
    #reset player scores
    mqtt_client.publish("player1/score", payload=json.dumps({"score": 0}))     #player1 is the bottom player 
    mqtt_client.publish("player2/score", payload=json.dumps({"score": 0}))     #player2 is the top player  


    logging.info("force game to end by setting motion/presence = false game/level = 3, player2/score = 3")
    
    # set the motion/presence to false, will force the game to wait when the level is higher than 3
    mqtt_client.publish("motion/presence", "false")
    
    # game level is incremented in the main loop and published for the gameboard to display,
    # publishing the game/level does not change the game level in the game driver
    # if level < 3: # if the game hasn't started yet and the next level would be level 1
    #     print("proceed to next level")
    #     level = level + 1
    mqtt_client.publish("game/level", payload=json.dumps({"level": 3}))
    
    # since the score is controlled inside pong.py, it cannot be changed when the game is playing
    # player1/score is published for displayed, it does not change the game behavior
    mqtt_client.publish("player1/score", payload=json.dumps({"score": 3}))
    
def test_assert(mqtt_client):
    assert(1 == 1)

def on_connect(client, userdata, flags, rc, propertiess=None):
    logging.info("MQTT Client connected with result code " + str(rc))

    client.subscribe("test/topic")
    client.subscribe("quit")
    client.subscribe("motion/position")
    client.subscribe("motion/presence")
    client.subscribe("game/state")
    client.subscribe("paddle1/position")
    
def on_message(client, userdata, msg):
    logging.debug("on_message: " + msg.topic + " " + str(msg.payload))
    payloadContent = json.loads(msg.payload)
    userdata[msg.topic] = payloadContent

@pytest.fixture
def human_present(mqtt_client):
    """

    """

    mqtt_data = mqtt_client.user_data_get()
    logging.debug(mqtt_data)

    # Ensure we are starting from a new game by resetting the game    
    logging.debug("Publish: motion/presence false")  
    mqtt_client.publish("motion/presence", "false")
    time.sleep(5)

    logging.debug("Publish: motion/presence true")  
    mqtt_client.publish("motion/presence", "true")
    
    time_elapsed = 0
    check_interval = 0.1
    max_wait = 5
    while (not ("game/state" in mqtt_data.keys())): #wait for mqtt broker update
        time.sleep (check_interval)
        time_elapsed = time_elapsed + check_interval

        if time_elapsed > max_wait:
            pytest.fail(f"Game did not start within {max_wait}s of presence being detected")

    logging.info("Game State message detected")
    # Should be an integer representing the state of the game
    state = (mqtt_data["game/state"])['state']
    logging.debug(f"game/state: {state}")

    return state

# Request arguement gives information about the test requester
# Technically our mqtt_client fixture is requesting the built in request fixture
@pytest.fixture
def mqtt_client(request):

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
