# from distutils.command.config import config
import time
import logging
import paho.mqtt.client as mqtt
import numpy as np
import json

from dw.state_machine import PongAPI, Topics
# from dw import Config
# from dw.utils import utils

logging.basicConfig(level=logging.INFO)

"""
This class was removed from the driver to follow previous development patterns
"""

class MotionSubscriber:
    """
    MQTT compliant game state subscriber
    """

    # def on_connect(self, client, userdata, flags, rc):
    #     print("Connected with result code " + str(rc))
    #     # client.subscribe("puck/position") # we can use this subscription to drive the player update rather than relying on our own loop
    #     # client.subscribe("player1/score")
    #     # client.subscribe("player2/score")
    #     # client.subscribe("paddle1/position")
    #     # client.subscribe("paddle2/position")
    #     client.subscribe("game/level")
    #     client.subscribe("game/state")

    # # since we are only sending information at regular intervals this may not be needed
    # def on_message(self, client, userdata, msg):
    #     topic = msg.topic
    #     payload = json.loads(msg.payload)
    #     if topic == "game/level":
    #         self.level = payload["level"]
    #     if topic == "game/state":
    #         self.game_state = payload["state"]
    # #     if topic == "puck/position":
    #         # self.puck_x = payload["x"]
    #         # self.puck_y = payload["y"]
    #         # We'll use this update to grab a player position value and then publish

    def on_game_state(self, message):
        """
        Callback method for when the BaseState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """

        transition = message["transition"]
        if transition == "game_complete":
            # data = {"state": "start"}    
            data = {"state": "not_ready"}    
            self.publish(Topics.PADDLE_BOTTOM_STATE, data, retain=True)   

    # def state(self, message):
    #     on_game_state(self, message)

    # def on_game_play(self, message):
    #     """
    #     Callback method for when the BaseState changes.

    #     Parameters:
    #     changed_state (dict): The changed state values.
    #     """
    #     self.level = message["level"]

        
    # def publish(self, topic, message, qos=0):
    #     """
    #     Use the subscriber to send a message to update game variables elsewhere
    #     """
    #     p = json.dumps(message)
    #     self.client.publish(topic, payload=p, qos=qos)

    def publish(self, topic, message, retain: bool = False):
        """
        Use the state subscriber to send a message since we have the connection open anyway
        :param topic: MQTT topic
        :param message: payload object, will be JSON stringified
        :return:
        """
        logging.debug("Update - topic: %s, message: %s", topic, message)
        self.pong_api.update(topic, message, retain=retain)

    # get depth camera feed into browser
    def emit_depth_feed(self, feed):
        logging.debug("Depth Feed - feed: %s", feed)
        # self.client.publish("depth/feed", payload=json.dumps({"feed": feed}))
        data = {"feed": FileNotFoundError}   
        self.publish(Topics.DEPTH_FEED, {"feed": feed})
        #print(f'emitting depth feed: {feed}')

    def __init__(self):
        self.pong_api = PongAPI("human-paddle-control")
        self.level = 0
        self.game_state = 0

        # self.client = mqtt.Client(client_id="human-paddle-control")
        # self.client.on_connect = lambda client, userdata, flags, rc : self.on_connect(client, userdata, flags, rc)
        # self.client.on_message = lambda client, userdata, msg : self.on_message(client, userdata, msg)
        # # self.client.connect_async("localhost", port=1883, keepalive=60)
        # # self.client.connect_async("192.168.2.214", port=1883, keepalive=60)
        # self.client.connect_async("mqtt-broker", port=1883, keepalive=60)
        
    def start(self):
        print("MotionSubscriber start - begin")
        # self.client.loop_forever()
        self.pong_api.start()
        self.pong_api.register_observer(Topics.GAME_STATE, self.on_game_state)
        data = {"state": "not_ready"}    
        logging.debug("Update1 - topic: %s, message: %s", Topics.PADDLE_BOTTOM_STATE, data)
        self.publish(Topics.PADDLE_BOTTOM_STATE, data, retain=True)
        print("MotionSubscriber start - end")
