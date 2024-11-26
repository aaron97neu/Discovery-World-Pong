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
            # self.game_state.set_state('active', True, self)

            while not self.done:
                if keyboard.is_pressed('a'):
                    logging.info(f"The type of the variable is: {type(self.game_state.get_state('game_bottom_paddle_position')).__name__}")
                    game_bottom_paddle_position = self.game_state.get_state('game_bottom_paddle_position') - 1
                    self.game_state.set_state('game_bottom_paddle_position', game_bottom_paddle_position, self)
                    logging.info(f"game_bottom_paddle_position: {self.game_state.get_state('game_bottom_paddle_position')}")
                elif keyboard.is_pressed('d'):
                    game_bottom_paddle_position = self.game_state.get_state('game_bottom_paddle_position') + 1
                    self.game_state.set_state('game_bottom_paddle_position', game_bottom_paddle_position, self)
                    logging.info(f"game_bottom_paddle_position: {self.game_state.get_state('game_bottom_paddle_position')}")
                # else:
                #     self.game_state.set_state('paddle_movement', 0, self)
                time.sleep(0.1)  # Adjust the sleep time as needed
        except KeyboardInterrupt:
            print("Exiting...")
