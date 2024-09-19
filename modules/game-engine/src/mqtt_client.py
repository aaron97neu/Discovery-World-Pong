"""
MQTT Client Module

This module contains the MQTTClient class which is an observer of GameState and handles 
MQTT communication.
"""

import logging
import json
import paho.mqtt.client as mqtt

class MQTTClient:
    """
    MQTTClient Class

    This class handles MQTT communication and observes the GameState for changes.
    """

    def __init__(self, game_state):
        """
        Initializes the MQTTClient with the given GameState.

        Parameters:
        game_state (GameState): The GameState instance to observe.
        """
        self.game_state = game_state
        self.client = mqtt.Client(client_id="game-engine")
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        self.connected = False

        self.subscribe_map = {
            'paddle1/action': 'paddle1_action', 'paddle1/frame': 'paddle1_frame',
            'paddle2/action': 'paddle2_action', 'paddle2/frame': 'paddle2_frame',
            'motion/position': 'motion_position', 'motion/presence': 'motion_presence'
        }

        self.publish_map = {
            'game_level': 'game/level', 'game_state': 'game/state', 'puck_position': 'puck/position',
            'paddle1_position': 'paddle1/position', 'paddle2_position': 'paddle2/position',
            'player1_score': 'player1/score', 'player2_score': 'player2/score', 'game_frame': 'game/frame'
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
        self.client.publish("audio/record_tts_to_file", "text_json")

    def _on_state_change(self, changed_state):
        """
        Callback method for when the GameState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        for key, value in changed_state.items():
            topic = self.publish_map.get(key)
            if topic:
                self.client.publish(topic, value)

    def synthesize_to_file(self, text: str, filename: str, voice_model: str = "en_US-hfc_male-medium"):
        """
        Implementations of this function synthesize a text utterance into
        a wave audio file based on a specified voice model. 

        Arguments:
            text -- the text utterance.
            filename -- the audio file filename.
            voice_model -- the name of the voice model to use.
        """
        logging.info("synthesize_to_file")
        # text_json = json.dumps({"text": text,
        #                         "filename": filename,
        #                         "voice_model": voice_model})

        text_json = json.dumps({"text": "Test.",
                                "filename": "test.wav",
                                "voice_model": "en_US-hfc_male-medium"})
        
        logging.info("MQTT pub: %s, text_json: %s", "audio/record_tts_to_file", text_json)

        # self.client.publish("audio/record_tts_to_file", text_json)
        self.client.publish("audio/record_tts_to_file", "text_json")

    def remove_file(self, filename: str):
        """
        Implementations of this function removes a generated audio
        file.

        Arguments:
            filename -- the audio file filename.
        """
        self.client.publish("audio/remove_file", json.dumps({"filename": str(filename)}))

    def play(self, filename: str):
        """
        Implementations of this function plays an audio file.

        Arguments:
            filename -- the audio file filename.
        """
        self.client.publish("audio/play", json.dumps({"filename": str(filename)}))

    def stop(self, filename: str):
        """
        Implementations of this function stops a currently playing audio
        file.

        Arguments:
            filename -- the audio file filename.
        """
        self.client.publish("audio/stop", json.dumps({"filename": str(filename)}))
