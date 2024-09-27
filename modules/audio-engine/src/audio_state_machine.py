"""
Audio State Machine Module

This module is derived from the AudioStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
from dw.config import Config
from dw.state_machine import BaseStateMachine
from tts_text import TTSText
from tts_synthesizer import TTSSynthesizer
from audio_player import AudioPlayer
from audio_state import AudioState

class AudioStateMachine(BaseStateMachine):
    """
    AudioStateMachine Class

    This class implements a state machine to control game flow.
    """

    def __init__(self, audio_state: AudioState, config: Config, tts_text: TTSText, tts_synthesizer: TTSSynthesizer, audio_player: AudioPlayer):
        """
        Initializes the AudioStateMachine with the given GameState.
.
        """
        logging.info("D10")

        super().__init__(audio_state)

        self.config: Config = config
        logging.info("D11")
        self.tts_text: TTSText = tts_text
        logging.info("D12")
        self.tts_synthesizer: TTSSynthesizer = tts_synthesizer
        logging.info("D13")
        self.audio_player: AudioPlayer = audio_player
        logging.info("D14")

        self.tts_synthesizer.synthesize_to_file(self.tts_text.intro, "intro.wav")
        logging.info("D15")
        self.tts_synthesizer.synthesize_to_file(self.tts_text.level_one_complete, "level_one_complete.wav")
        logging.info("D16")
        self.tts_synthesizer.synthesize_to_file(self.tts_text.level_two_complete, "level_two_complete.wav")
        logging.info("D17")
        self.tts_synthesizer.synthesize_to_file(self.tts_text.level_three_complete, "level_three_complete.wav")
        logging.info("D18")
        self.tts_synthesizer.synthesize_to_file(self.tts_text.outro, "outro.wav")
        logging.info("D19")

    def start(self):
        """
        Starts the AudioStateMachine by transitioning to the 'idle' state.
        """
        logging.info("AudioStateMachine Start")
        self.audio_player.play_async("exhibit_activation_noise.mp3", True)
        super().start()

    def on_enter_idle(self):
        """
        Method called when entering the 'idle' state.
        """
        logging.info("Entering idle state")
        self.audio_player.play_async("music_idle.wav")

    def on_exit_idle(self):
        """
        Method called when exiting the 'idle' state.
        """
        logging.info("Exiting idle state")
        self.audio_player.stop("music_idle.wav")
 
    def on_enter_intro(self):
        """
        Method called when entering the 'intro' state.
        """
        logging.info("Entering intro state")
        self.audio_player.play_async("music_background.wav")
        self.audio_player.play_async("intro.wav")

    def on_exit_intro(self):
        """
        Method called when exiting the 'intro' state.
        """
        logging.info("Exiting intro state")
        self.audio_player.stop("intro.wav")
        self.audio_player.stop("music_background.wav")

    def on_enter_level1(self):
        """
        Method called when entering the 'level1' state.
        """
        logging.info("Entering level 1 state")
        self.audio_player.play_async("music_background.wav")
        self.audio_player.play_async("level_one_complete.wav")

    def on_exit_level1(self):
        """
        Method called when exiting the 'level1' state.
        """
        self.audio_player.stop("level_one_complete.wav")
        self.audio_player.stop("music_background.wav")

    def on_enter_level2(self):
        """
        Method called when entering the 'level2' state.
        """
        logging.info("Entering level 2 state")
        self.audio_player.play_async("music_background.wav")
        self.audio_player.play_async("level_two_complete.wav")

    def on_exit_level2(self):
        """
        Method called when exiting the 'level2' state.
        """
        logging.info("Exiting level2 state")
        self.audio_player.stop("level_two_complete.wav")
        self.audio_player.stop("music_background.wav")

    def on_enter_level3(self):
        """
        Method called when entering the 'level3' state.
        """
        logging.info("Entering level 3 state")
        self.audio_player.play_async("music_background.wav")
        self.audio_player.play_async("level_three_complete.wav")

    def on_exit_level3(self):
        """
        Method called when exiting the 'level3' state.
        """
        logging.info("Exiting level3 state")
        self.audio_player.stop("level_three_complete.wav")
        self.audio_player.stop("music_background.wav")

    def on_enter_outro(self):
        """
        Method called when entering the 'outro' state.
        """
        logging.info("Entering outro state")
        self.audio_player.play_async("music_background.wav")
        self.audio_player.play_async("outro.wav")

    def on_exit_outro(self):
        """
        Method called when exiting the 'outro' state.
        """
        logging.info("Exiting outro state")
        self.audio_player.stop("outro.wav")
        self.audio_player.stop("music_background.wav")

