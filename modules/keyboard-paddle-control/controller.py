"""
Default AudioCommandHandler implementation module.
"""

import logging
import time
import keyboard

class Controller:
    """
    This class 
    """

    def __init__(
        self, game_state
    ):
        self.done = False
        self.game_state = game_state

    def start(self):
        """
        This function implements a synchronous command to stop a playing audio file.  
        """
        # Main loop to capture keyboard input
        try:
            logging.info("starting loop")
            self.game_state.set_state('active', True, self)

            while not self.done:
                if keyboard.is_pressed('a'):
                    self.game_state.set_state('movement', 1, self)
                elif keyboard.is_pressed('d'):
                    self.game_state.set_state('movement', 2, self)
                # else:
                #     self.game_state.set_state('paddle_movement', 0, self)
                time.sleep(0.1)  # Adjust the sleep time as needed
        except KeyboardInterrupt:
            print("Exiting...")
