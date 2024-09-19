"""
Game Engine Module

This module contains the GameEngine class which is the main class of the application.
It manages the instantiation and composition of the application with dependency injection.
"""

import os
import logging
import time
from game_state import GameState
from mqtt_client import MQTTClient
from controller import Controller

logging.basicConfig(level=logging.INFO)

class KeyboardPaddleControl:
    """
    KeyboardPaddleControl Class

    This class is responsible for managing the instantiation and composition of the application.
    """

    def __init__(self):
        """
        Initializes the KeyboardPaddleControl with necessary components.
        """
        # Get the topic prefix from the environment variable
        paddle_id = os.getenv('PADDLE_ID', 'bottom_paddle')

        self.game_state = GameState()
        self.mqtt_client = MQTTClient(paddle_id, self.game_state)

        self.controller = Controller(self.game_state)

    def start(self):
        """
        Starts the GameEngine.
        """
        self.mqtt_client.start()

        while self.mqtt_client.connected is not True:    #Wait for connection
            time.sleep(0.1)

        self.controller.start()

if __name__ == "__main__":
    keyboard_paddle_control = KeyboardPaddleControl()
    keyboard_paddle_control.start()
