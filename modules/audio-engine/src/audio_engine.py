"""
AudioEngine/main module.
"""

import logging
import time
import code.config
from dw_shared.config import Config
from mqtt_client import MQTTClient
from audio_state_machine import AudioStateMachine
from dw_shared.config import config
from dw_shared.state_machine import GameState
from tts_synthesizer import TTSSynthesizer
from audio_player import AudioPlayer
from piper_tts_synthesizer import PiperTTSSynthesizer
from simpleaudio_audio_player import SimpleaudioAudioPlayer
from tts_text import TTSText
import dw_shared
from 

logging.basicConfig(level=logging.INFO)

class AudioEngine(object):
    """
    This class implements the entry point for the audio engine. It instantiates,
    and manages the composition of the engine components then starts the system.
    """

    def __init__(self):
        logging.info("D1")
        self.audio_files_path = "audio_files"

        logging.info("D2")
        self.config = Config.instance()
        logging.info("D3")
        self.tts_text = TTSText("./tts/tts_text.json")
        logging.info("D4")
        self.game_state = GameState()
        logging.info("D5")
        self.mqtt_client = MQTTClient("audio-engine", self.game_state)
        logging.info("D6")
        self.tts_synthesizer: TTSSynthesizer = PiperTTSSynthesizer(self.audio_files_path)
        logging.info("D7")
        self.audio_player: AudioPlayer = SimpleaudioAudioPlayer(self.audio_files_path)
        logging.info("D8")
        # self.audio_player = VLCAudioPlayer(self.data_path)
        self.state_machine = AudioStateMachine(self.config, self.tts_text, self.tts_synthesizer, self.audio_player)
        logging.info("D9")

    def start(self):
        """
        Starts the AudioEngine.
        """
        logging.info("Starting AudioEngine.")
        self.mqtt_client.start()
        logging.info("D20")

        while self.mqtt_client.connected is not True:  # Wait for connection
            time.sleep(0.1)
        logging.info("D21")

        self.state_machine.start()
        logging.info("D22")


if __name__ == "__main__":
    logging.info("Starting AudioEngine.")
    audio_engine = AudioEngine()
    audio_engine.start()
