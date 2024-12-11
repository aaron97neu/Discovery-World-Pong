"""
MQTT AudioCommandProvider implementation module.
"""

import logging
import json
import uuid
from paho.mqtt import client as mqtt
from audio_command_handler import AudioCommandHandler
from audio_schema_validator import AudioSchemaValidator

class MQTT:
    """
    This class is the MQTT implementation of the 
    AudioCommandProvider. It recieves input from an MQTT broker and 
    calls a AudioCommandHandler.
    """

    def __init__(self, audio_command_handler: AudioCommandHandler):
        client_id = "audio-engine-" + str(uuid.uuid1())
        self.client = mqtt.Client(client_id=client_id)
        self.client.connect_async("mqtt-broker", port=1883, keepalive=60)
        self.client.on_connect = self.__on_connect
        self.client.on_message = self.__on_message
        self.audio_command_handler = audio_command_handler
        self.audio_schema_validator = AudioSchemaValidator()

    def __on_connect(self, client, userdata, flags, rc) -> None:
        """
        This function is call on connection to the MQTT broker. Then
        subscribes to the audio topics.

        Arguments:
            msg -- the JSON formatted audio message.
        """
        if rc == 0:
            logging.info("Connected to MQTT Broker!")
        else:
            logging.warning("Failed to connect, return code %d\n", rc)

        client.subscribe("audio/record_tts_to_file")
        client.subscribe("audio/play")
        client.subscribe("audio/stop")

    def __on_message(self, client, userdata, msg):
        """
        This function is call when an audio event is recieve from the 
        MQTT broker.

        Arguments:
            msg -- the JSON formatted audio message.
        """
        topic = msg.topic
        payload = json.loads(msg.payload)
        match topic:
            case "audio/record_tts_to_file":
                valid = self.audio_schema_validator.validate_tts(payload)

                if valid:
                    text = payload["text"]
                    filename = payload["filename"]

                    if "voice_model" in payload:
                        voice_model = payload["voice_model"]
                    else:
                        voice_model = "en_US-amy-medium"

                    self.audio_command_handler.record_tts_to_file_async(
                        text, filename, voice_model
                    )
            case "audio/play":
                valid = self.audio_schema_validator.validate_play(payload)

                if valid:
                    filename = payload["filename"]

                self.audio_command_handler.play_async(filename)
            case "audio/stop":
                valid = self.audio_schema_validator.validate_stop(payload)

                if valid:
                    filename = payload["filename"]
                self.audio_command_handler.stop_async(filename)
            case "audio/remove_file":
                valid = self.audio_schema_validator.validate_remove(payload)

                if valid:
                    filename = payload["filename"]
                self.audio_command_handler.remove_file_async(filename)
            case _:
                logging.info("Unsupported topic recieved.")

    def start(self, args):
        """
        This function starts recieving of audio events from the MQTT broker.

        Arguments:
            args -- an implemention specific set of arguments.
        """
        self.client.loop_forever()
