"""
MQTT Client Module

This module contains the MQTTClient class which is an observer of GameState and handles MQTT 
communication.
"""

import logging
import paho.mqtt.client as mqtt


class MQTTClient:
    """
    MQTTClient Class

    This class handles MQTT communication and observes the GameState for changes.
    """

    def __init__(self, paddle_id, game_state):
        """
        Initializes the MQTTClient with the given GameState.

        Parameters:
        game_state (GameState): The GameState instance to observe.
        """
        self.paddle_id = paddle_id
        logging.info("paddle_id: %s", paddle_id)
        self.game_state = game_state
        self.client = mqtt.Client(client_id=f"keyboard-paddle-control-{paddle_id}")
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        self.connected = False

        self.subscribe_map = {
            # f"{self.game_state.paddle}/movement": "movement"
        }

        self.publish_map = {
            "movement": f"{self.paddle_id}/movement",
            "active": f"{self.paddle_id}/active"
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
        for topic in self.subscribe_map.keys():
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
        state_key = self.subscribe_map.get(msg.topic)
        if state_key:
            self.game_state.set_state(state_key, msg.payload.decode(), caller=self)

    def start(self):
        """
        Starts the MQTTClient by connecting to the broker and observing the GameState.
        """
        self.client.connect_async("mqtt-broker", port=1883, keepalive=60)
        self.client.loop_start()
        self.game_state.add_observer(self, self._on_state_change)

    def _on_state_change(self, changed_state):
        """
        Callback method for when the GameState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        self.client.publish("debbug_topic", "test")
        for key, value in changed_state.items():
            topic = self.publish_map.get(key)
            logging.info("key: %s, value: %s, topic: %s", key, value, topic)
            if topic:
                self.client.publish(topic, value)