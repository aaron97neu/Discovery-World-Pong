"""
MQTT Client Module

This module contains the MQTTClient class which is an observer of BaseState and handles 
MQTT communication.
"""

import logging
from abc import ABC
# import json
import paho.mqtt.client as mqtt
from .base_state import BaseState

class MQTTClient(ABC):
    """
    MQTTClient Class

    This class handles MQTT communication and observes the BaseState for changes.
    """

    def __init__(self, client_id, game_state: BaseState, enable_subscriptions=None):
        """
        Initializes the MQTTClient with the given BaseState.

        Parameters:
        service_state (ServiceState): The ServiceState instance to observe.
        """
        self.client_id = client_id
        self.game_state = game_state  
        self.client = mqtt.Client(client_id=self.client_id)
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        self.connected = False

        if not enable_subscriptions:
            self.enable_subscriptions = [
                'game/state_changed', 
                'paddle1/activated',
                'paddle1/moved', 
                'paddle2/activated',
                'paddle2/moved', 
                'ball/moved',
                'player1/scored',
                'player2/scored',
            ]
        else:
            self.enable_subscriptions = enable_subscriptions

        self.topic_to_state_map = {
            'game/state_changed': 'game_state', 
            'paddle1/activated': 'paddle1_activated',
            'paddle1/moved': 'paddle1_movemment', 
            'paddle2/activated': 'paddle2_activated',
            'paddle2/moved': 'paddle2_movement', 
            'ball/moved': 'ball_movement',
            'player1/scored': 'player1_score',
            'player2/scored': 'player2_score',
        }

        self.state_to_topic_map = {
            'game_state': 'game/state_changed', 
            'paddle1_activated': 'paddle1/activated',
            'paddle1_movemment': 'paddle1/moved', 
            'paddle2_activated': 'paddle2/activated',
            'paddle2_movement': 'paddle2/moved', 
            'ball_movement': 'ball/moved',
            'player1_score': 'player1/scored',
            'player2_score': 'player2/scored',
        }

    def _on_connect(self, client, userdata, flags, rc):
        """
        Callback method for when the client connects to the broker.

        Parameters:
        client (mqtt.Client): The MQTT client instance.
        userdata (any): The private user data.
        flags (dict): Response flags sent by the broker.
        rc (int): The connection result.
        """
        self.connected = True
        for topic in self.enable_subscriptions:
            logging.info("MQTT sub: %s", topic)
            client.subscribe(topic)

    def _on_disconnect(self, client, userdata, rc):
        """
        Callback method for when the client disconnects from the broker.

        Parameters:
        client (mqtt.Client): The MQTT client instance.
        userdata (any): The private user data.
        rc (int): The disconnection result.
        """
        self.connected = False

    def _on_message(self, client, userdata, msg):
        """
        Callback method for when a message is received from the broker.

        Parameters:
        client (mqtt.Client): The MQTT client instance.
        userdata (any): The private user data.
        msg (mqtt.MQTTMessage): The received message.
        """
        logging.info("MQTT msg")
        logging.info("MQTT msg.topic: %s, msg.payload: %s", msg.topic, msg.payload.decode())
        state_key = self.topic_to_state_map.get(msg.topic)
        if state_key:
            self.game_state.set_state(state_key, msg.payload.decode(), caller=self)

    def start(self):
        """
        Starts the MQTTClient by connecting to the broker and observing the BaseState.
        """
        self.client.connect_async("mqtt-broker", port=1883, keepalive=60)
        self.client.loop_start()
        self.game_state.add_observer(self, self._on_state_change)

    def _on_state_change(self, changed_state):
        """
        Callback method for when the BaseState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        for key, value in changed_state.items():
            topic = self.state_to_topic_map.get(key)
            if topic:
                self.client.publish(topic, value)
