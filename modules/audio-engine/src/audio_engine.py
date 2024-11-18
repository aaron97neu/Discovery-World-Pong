"""
AudioEngine/main module.
"""

import logging
import time
from tts_synthesizer import TTSSynthesizer
from audio_player import AudioPlayer
from piper_tts_synthesizer import PiperTTSSynthesizer
# from simpleaudio_audio_player import SimpleaudioAudioPlayer
from vlc_audio_player import VLCAudioPlayer
from tts_text import TTSText
from audio_state import AudioState
from audio_state_machine import AudioStateMachine
from dw.config import Config
from dw.state_machine import MQTTClient

logging.basicConfig(level=logging.INFO)

class AudioEngine(object):
    """
    This class implements the entry point for the audio engine. It instantiates,
    and manages the composition of the engine components then starts the system.
    """

    def __init__(self):
        self.config_files_path = "./tts/config_files"
        self.audio_files_path = "./tts/audio_files"
        self.voice_files_path = "./tts/voice_files"

        self.config = Config.instance()
        self.tts_text = TTSText(self.config_files_path)
        self.audio_state = AudioState()
        self.mqtt_client = MQTTClient("audio-engine", self.audio_state)
        self.tts_synthesizer: TTSSynthesizer = PiperTTSSynthesizer(self.audio_files_path, self.voice_files_path, self.tts_text.voice_model)
        # self.audio_player: AudioPlayer = SimpleaudioAudioPlayer(self.audio_files_path)
        self.audio_player = VLCAudioPlayer(self.audio_files_path)
        self.state_machine = AudioStateMachine(self.audio_state, self.config, self.tts_text, self.tts_synthesizer, self.audio_player)

    def start(self):
        """
        Starts the AudioEngine.
        """
        logging.info("Starting AudioEngine.")
        self.mqtt_client.start()

        while self.mqtt_client.client.is_connected is not True:  # Wait for connection
            time.sleep(0.1)

        self.state_machine.start_machine()

if __name__ == "__main__":
    logging.info("Starting AudioEngine.")
    audio_engine = AudioEngine()
    audio_engine.start()
