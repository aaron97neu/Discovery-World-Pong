"""
Game Engine Module

This module contains the GameEngine class which is the main class of the application.
It manages the instantiation and composition of the application with dependency injection.
"""

import logging
import time
# from game_state import GameState
# from mqtt_client import MQTTClient
# from game_state_machine import GameStateMachine
# from shared.config import Config

from dw.state_machine import GameState, GameStateMachine
from dw import Config
from dw.utils import Timer
from .tts_text import TTSText
from player import AIPlayer, MotionPlayer

logging.basicConfig(level=logging.INFO)


class GameEngine:
    """
    GameEngine Class

    This class is responsible for managing the instantiation and composition of the application.
    """

    def __init__(self):
        """
        Initializes the GameEngine with necessary components.
        """
        self.config = Config.instance()
        self.tts_text = TTSText("./tts_text.json")
        self.game_state = GameState(self.tts_text)
        self.mqtt_client = MQTTClient(self.game_state)
        self.top_player = AIPlayer(self.game_state, top=True)
        self.bottom_player = AIPlayer(self.game_state, bottom=True)
        # self.bottom_player = MotionPlayer(self.game_state)
        self.game_state_machine = GameStateMachine(self.game_state,
                                              self.config,
                                              self.top_player,
                                              self.bottom_player,
                                              self.mqtt_client,
                                              self.mqtt_client)

    def start(self):
        """
        Starts the GameEngine.
        """
        self.mqtt_client.start()

        while self.mqtt_client.connected is not True:    #Wait for connection
            time.sleep(0.1)

        self.game_state_machine.start()

if __name__ == "__main__":
    game_engine = GameEngine()
    game_engine.start()
