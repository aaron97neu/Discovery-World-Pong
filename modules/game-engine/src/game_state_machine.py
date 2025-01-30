"""
Game State Machine Module

This module contains the GameStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
from dw.state_machine import BaseStateMachine
from dw.state_machine import PongAPI

class GameStateMachine(BaseStateMachine):
    """
    GameStateMachine Class

    This class implements a state machine to control game flow.
    """

    states = ['stopped', 'idle', 'intro', 'level1', 'level2', 'level3', 'outro']

    def __init__(self,
                 pong_api: PongAPI):    
        """
        Initializes the GameStateMachine with the given GameState.

        Parameters:
        pong_api (PongAPI): The GameState instance to observe.
        """
        super().__init__(pong_api)
        self.pong_api = pong_api

    def on_enter_idle(self):
        """
        Method called when entering the 'idle' state.
        """
        logging.info("Entering idle state")
        state_message = {"transition": "start"}
        self.pong_api.update('game/state', state_message)
            
    def on_exit_idle(self):
        """
        Method called when exiting the 'idle' state.
        """
        logging.info("Exiting idle state")

    def on_enter_intro(self):
        """
        Method called when entering the 'intro' state.
        """
        logging.info("Entering intro state")

    def on_exit_intro(self):
        """
        Method called when exiting the 'intro' state.
        """
        logging.info("Exiting intro state")

    def on_enter_level1(self):
        """
        Method called when entering the 'level1' state.
        """
        logging.info("Entering level 1 state")

    def on_exit_level1(self):
        """
        Method called when exiting the 'level1' state.
        """

    def on_enter_level2(self):
        """
        Method called when entering the 'level2' state.
        """
        logging.info("Entering level 2 state")

    def on_exit_level2(self):
        """
        Method called when exiting the 'level2' state.
        """
        logging.info("Exiting level2 state")

    def on_enter_level3(self):
        """
        Method called when entering the 'level3' state.
        """
        logging.info("Entering level 3 state")

    def on_exit_level3(self):
        """
        Method called when exiting the 'level3' state.
        """
        logging.info("Exiting level3 state")

    def on_enter_outro(self):
        """
        Method called when entering the 'outro' state.
        """
        logging.info("Entering outro state")

    def on_exit_outro(self):
        """
        Method called when exiting the 'outro' state.
        """
        logging.info("Exiting outro state")
