"""
Game Engine Module

This module contains the GameEngine class which is the main class of the application.
It manages the instantiation and composition of the application with dependency injection.
"""

import os
import logging
import time
from dw.state_machine import MQTTClient
from game_state import GameState
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
        logging.info(f"Before MQTTClient:")    
        self.mqtt_client = MQTTClient(paddle_id, self.game_state, 'localhost')
        logging.info(f"After MQTTClient: {self.mqtt_client}")    

        self.controller = Controller(self.game_state)

    def start(self):
        """
        Starts the GameEngine.
        """
        logging.info("Starting KeyboardPaddleControl.")
        logging.info(f"Before MQTTClient start:")   
        self.mqtt_client.start()

        logging.info(f"After MQTTClient start: {self.mqtt_client.is_connected()}")   
        while self.mqtt_client.is_connected() is not True:  # Wait for connection
            time.sleep(0.1)

        logging.info(f"Before controller start:")   
        self.controller.start()
        logging.info(f"After controller start:")   

if __name__ == "__main__":
    keyboard_paddle_control = KeyboardPaddleControl()
    keyboard_paddle_control.start()
