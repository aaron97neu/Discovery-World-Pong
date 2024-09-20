"""
Game Engine Module

This module contains the GameEngine class which is the main class of the application.
It manages the instantiation and composition of the application with dependency injection.
"""

import logging
import time
from dw.state_machine import BaseState, MQTTClient
from dw import Config
from dw.utils import Timer
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
        self.game_state = BaseState()
        self.mqtt_client = MQTTClient("game-engine", self.game_state)
        self.top_player = AIPlayer(self.game_state, top=True)
        self.bottom_player = AIPlayer(self.game_state, bottom=True)
        # self.bottom_player = MotionPlayer(self.game_state)
        self.game_state_machine = GameStateMachine(self.game_state)

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
