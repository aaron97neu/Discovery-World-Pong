"""
MQTT Client Module

This module contains the MQTTClient class which is an observer of BaseState and handles 
MQTT communication.
"""

import logging
from abc import ABC
import json
import paho.mqtt.client as mqtt
from .base_state import BaseState

class MQTTClient(ABC):
    """
    MQTTClient Class

    This class handles MQTT communication and observes the BaseState for changes.
    """

    def __init__(self, client_id, game_state: BaseState, broker='mqtt-broker', port=1883, enable_subscriptions=None):
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
                'game/state',
                'game/state_transition',
                'game/countdown',
                'game/ball_position',            
                'game/bottom_paddle_position',
                'game/top_paddle_position',
                'game/bottom_score',
                'game/top_score',
            ]
        else:
            self.enable_subscriptions = enable_subscriptions

        self.topic_to_state_map = {
            'game/state': 'game_state',
            'game/state_transition': 'game_state_transition',
            'game/countdown': 'game_countdown',
            'game/ball_position': 'game_ball_position',            
            'game/bottom_paddle_position': 'game_bottom_paddle_position',
            'game/top_paddle_position': 'game_top_paddle_position',
            'game/bottom_score': 'game_bottom_score',
            'game/top_score': 'game_top_score',
        }

        self.state_to_topic_map = {
            'game_state': 'game/state',
            'game_state_transition': 'game/state_transition',
            'game_countdown': 'game/countdown',
            'game_ball_position': 'game/ball_position',
            'game_bottom_paddle_position': 'game/bottom_paddle_position',
            'game_top_paddle_position': 'game/top_paddle_position',
            'game_bottom_score': 'game/bottom_score',
            'game_top_score': 'game/top_score',
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

    def is_connected(self):
        """
        """
        # return self.connected;
        return self.client.is_connected();


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
        logging.info("MQTT state_key: %s", state_key)
        if state_key:
            payload_str = msg.payload.decode('utf-8')
            payload_json = json.loads(payload_str)
            self.game_state.set_state(state_key, payload_json[f"{state_key}"], caller=self)
            # self.game_state.set_state(state_key, msg.payload.decode(), caller=self)

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
            logging.info(f"key: {key}, value: {value}")
            topic = self.state_to_topic_map.get(key)
            logging.info(f"topic: {topic}")
            if topic:
                jsonValue = f"{{{topic}: {value}}}"
                json.dumps(value)
                self.client.publish(topic, value)
                # self.client.publish(topic, value)
