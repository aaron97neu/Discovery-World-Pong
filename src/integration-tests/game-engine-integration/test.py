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

# "Enum" (array) for game states
game_state = [
    "wait",      # 0: Wait for human presence  
    "ready",     # 1: Ready
    "running",   # 2: Game is running
    "game over"  # 3: Game is over
]


def test_running_on_presence(mqtt_client, human_present):
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
    logging.debug("Subscribing to motion/presence and games/state")
    mqtt_client.subscribe("motion/presence")
    mqtt_client.subscribe("game/state")
    logging.debug("Subscribed to motion/presence and games/state")
    mqtt_data = mqtt_client.user_data_get()
    logging.debug(mqtt_data)
    
    #######
    # Act #
    #######
    # Accomplished by requesting `human_present` fixture

    ##########
    # Assert #
    ##########
    max_wait = 10
    starttime = time.time()
    state_msg = poll_for_message(mqtt_data, "game/state", message=json.loads('{"state": 2}'), timeout=max_wait)

    
    logging.info(f"Game State message {state_msg} detected. Elapsed: {time.time() - starttime}s")

    # Extract integer state value from json representation of form {"state": n}
    if state_msg is not None and "state" in state_msg:
        state_msg = state_msg["state"]
    
    assert(state_msg == 2)
 
def test_no_presense_stop(mqtt_client, human_present):
    """
    Test Presence Stop

    This test looks to ensure that when a player is no longer present, the game
    eventually returns to the "waiting for human" state
    """
    # https://docs.pytest.org/en/stable/explanation/anatomy.html
    # Define our Arrange, Act, Assert, Cleanup States

    ###########
    # Arrange #
    ###########
    mqtt_client.subscribe("motion/presence")
    mqtt_client.subscribe("game/state")

    # Ensure the game is running
    mqtt_client.publish("motion/presence", "true")
    logging.info("Awaiting game to start")
    poll_for_message(mqtt_data, "game/state", json.loads('{"state": 2}'), timeout=60)

    # Move the player to the side, this stops the a stalemate where both paddles
    # are in the center and the ball bounces between the two indefinetly. The
    # ball will eventually phase through a paddle when it gets fast enough,
    # but this takes forever
    logging.debug("Moving paddle out of center")
    for i in range(0, 100):
        mqtt_client.publish("motion/position", 0.1) # values[0, 1], 0 is completely left
        time.sleep(0.1)


    #######
    # Act #
    #######
    logging.info("Removing Presence")  
    mqtt_client.publish("motion/presence", "false")

    ##########
    # Assert #
    ##########
    logging.info(f"Awaiting game reaching state {game_state[0]}")
    max_wait = 300
    starttime = time.time()
    state_msg = poll_for_message(mqtt_data, "game/state", json.loads('{"state": 0}'), timeout=max_wait)
    if state_msg == None:
        pytest.fail(f"Game did not start by reaching state == 0 within {max_wait}s of presence being detected")

    logging.info(f"Game State message {state_msg} detected. Elapsed: {time.time() - starttime}s")

    # Extract integer state value from json representation of form {"state": n}
    if state_msg is not None and "state" in state_msg:
        state_msg = state_msg["state"]
    
    assert(state_msg == 0)

def test_state_sequence(mqtt_client, human_present):
    ###########
    # Arrange #
    ###########
    mqtt_client.subscribe("motion/presence")
    mqtt_client.subscribe("game/level")

    # Stop the game
    mqtt_client.publish("motion/presence", "false")
    max_wait = 60
    state_msg = poll_for_message(mqtt_data, "game/state", json.loads('{"state": 0}'), timeout=max_wait)
    if state_msg == None:
        pytest.fail(f"Game did not stop by reaching state == 0 within {max_wait}s of presence being removed")

    assert(state_msg["state"] == 0)

    ##########
    # Assert #
    ##########

    # State 1: Ready
    for i in range(0,10):
        mqtt_client.publish("motion/presence", "true")
        time.sleep(0.1)
    max_wait = 30
    state_msg = poll_for_message(mqtt_data, "game/state", json.loads('{"state": 1}'), timeout=max_wait)
    if state_msg == None:
        pytest.fail(f"Game did not start by reaching state == 1 within {max_wait}s of presence being detected")
    assert(state_msg["state"] == 1)


    # State 2: Running
    max_wait = 10
    starttime = time.time()
    state_msg = poll_for_message(mqtt_data, "game/state", json.loads('{"state": 2}'), timeout=max_wait)
    if state_msg == None:
        pytest.fail(f"Game did not reach state == 2 within {max_wait}s of being in state 1")

    logging.info(f"Game state message {state_msg} detected. Elapsed: {time.time() - starttime}s")
    assert(state_msg["state"] == 2)

    mqtt_client.publish("motion/position", 0.1) # Move paddle off to the side to lose faster



    # State 3: Game Over
    logging.info(f"Awaiting Game over")
    max_wait = 60
    starttime = time.time()
    state_msg = poll_for_message(mqtt_data, "game/state", json.loads('{"state": 3}'), timeout=max_wait)
    if state_msg == None:
        pytest.fail(f"Game did not reach state == 3 within {max_wait}s of being in state 1")

    logging.info(f"Game state message {state_msg} detected. Elapsed: {time.time() - starttime}s")
    assert(state_msg["state"] == 3)


def test_level_sequence(mqtt_client, human_present):
    ###########
    # Arrange #
    ###########
    mqtt_client.subscribe("motion/presence")
    mqtt_client.subscribe("game/state")
    mqtt_client.subscribe("game/level")

    # Start the game
    for i in range(0,10):
        mqtt_client.publish("motion/presence", "true")
        time.sleep(0.1)

    max_wait = 60
    state = poll_for_message(mqtt_data, "game/state", json.loads('{"state": 2}'), timeout=max_wait)
    if state == None:
        pytest.fail(f"Game did not start by reaching state == 2 within {max_wait}s of presence being detected")

    # To get through all the levels, we have to win. We will keep the player
    # paddle in just off center to bounce the ball around the AI paddle
    logging.debug("Moving player paddle slightly off center")
    for i in range(0, 100):
        mqtt_client.publish("motion/position", 0.51) # values[0, 1], 0 is completely left
        time.sleep(0.1)


    ##########
    # Assert #
    ##########

    # Level 1
    max_wait = 5
    starttime = time.time()
    level = poll_for_message(mqtt_data, "game/level", json.loads('{"level": 1}'), timeout=max_wait)
    if level == None:
        pytest.fail(f"Game did not start by reaching level == 1 within {max_wait}s of being in state 1")

    logging.info(f"Game level message {level} detected. Elapsed: {time.time() - starttime}s")
    assert(level["level"] == 1)


    # Level 2
    logging.info(f"Awaiting Level {level['level']} Ending")
    max_wait = 60
    starttime = time.time()
    level = poll_for_message(mqtt_data, "game/level", json.loads('{"level": 2}'), timeout=max_wait)
    if state == None:
        pytest.fail(f"Game did not transition to level 2 within {max_wait}s of level 1 starting")

    logging.info(f"Game level message {level} detected. Elapsed: {time.time() - starttime}s")
    assert(level["level"] == 2)

    """ # Apparently there are only 2 levels?
    # Level 3
    logging.info(f"Awaiting Level {level['level']} Ending")
    max_wait = 60
    starttime = time.time()
    level = poll_for_message(mqtt_data, "game/level", json.loads('{"level": 3}'), timeout=max_wait)
    if state == None:
        pytest.fail(f"Game did not transition to level 3 within {max_wait}s of level 2 starting")

    logging.info(f"Game level message {level} detected. Elapsed: {time.time() - starttime}s")
    assert(level["level"] == 3)
    """

    # Level 0 - When not in a level
    logging.info(f"Awaiting Level {level['level']} Ending")
    max_wait = 60
    starttime = time.time()
    level = poll_for_message(mqtt_data, "game/level", json.loads('{"level": 0}'), timeout=max_wait)
    if state == None:
        pytest.fail(f"Game did not transition to level 3 within {max_wait}s of level 2 starting")

    logging.info(f"Game level message {level} detected. Elapsed: {time.time() - starttime}s")
    assert(level["level"] == 0)
    


def test_moveBottomPaddleLeft(mqtt_client, human_present):
    state = human_present



    

"""
def test_game_engine(mqtt_client):
    mqtt_client.subscribe("test/topic")
    mqtt_client.subscribe("quit")
    mqtt_client.subscribe("motion/position")
    mqtt_client.subscribe("motion/presence")
    mqtt_client.subscribe("game/state")
    mqtt_client.subscribe("paddle1/position")
    
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
"""

def on_connect(client, userdata, flags, rc, properties=None):
    logging.info("MQTT Client connected with result code " + str(rc))
    client.subscribe("motion/presence")
    client.subscribe("game/state")
    client.subscribe("game/level")
    
def on_message(client, userdata, msg):
    logging.debug("on_message: " + msg.topic + " " + str(msg.payload))
    payloadContent = json.loads(msg.payload)
    userdata[msg.topic] = payloadContent

@pytest.fixture
def human_present(mqtt_client):
    """
    Human Present Fixture

    This fixture provides the game in a state where a human is presumed to be
    present by manually sending the motion/presence MQTT

    NOTE: This _does not_ guarentee that the state has changed from 0 to 1. In
    fact, there is typically one more 0 state sent before it switches over to 1

    """
    logging.debug("Awaiting connection")
    while (mqtt_client.is_connected()):
        logging.debug(f"Connected: {mqtt_client.is_connected()}")
        time.sleep(0.2)
    logging.info("Connected")

    logging.debug("Subscribing: motion/presence and game/state")
    mqtt_client.subscribe("motion/presence")
    mqtt_client.subscribe("game/state")
    logging.debug("Subscribed: motion/presnece and game/state")
    
    logging.debug("Aquiring MQTT Client User Data")
    mqtt_data = mqtt_client.user_data_get()
    logging.debug(mqtt_data)

    # Await a state message to ensure the game engine is ready
    poll_for_message(mqtt_data, "game/state", timeout=60)

    # Ensure we are starting from a new game by resetting the game
    logging.debug("Publish: motion/presence false")  
    mqtt_client.publish("motion/presence", "false")

    logging.debug("Publish: motion/presence true")  
    mqtt_client.publish("motion/presence", "true")
    
    """
    logging.debug("Awaiting game/state message")
    max_wait=10
    state = poll_for_message(mqtt_data, "game/state", timeout=max_wait)
    if state == None:
        pytest.fail(f"Game state did not update within {max_wait}s of presence being detected")

    logging.info("Game State message detected")
    # Should be an integer representing the state of the game
    logging.debug(f"\tgame/state: {state['state']}")
    
    return state
    """
    return

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
    * `mqtt_data`: (Required) Client User data object. Assumes that object is a dictonary with
        each key being the topic and each value being the most recent message 
        received
    * `topic`: (Required) String representation of the topic requested
    * `message`: (Optional) JSON deseralized representation of the desired message. If None or not
        specified, will return on any message
    * `polltime`: (Optional) Time in seconds to poll. Defaults to 0.2s if not specified
    * `timeout`: (Optional) Time in seconds to timeout if no new messages. Defaults to 10s

    Returns:
    * Message received in JSON deseralized via `json.loads()`
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