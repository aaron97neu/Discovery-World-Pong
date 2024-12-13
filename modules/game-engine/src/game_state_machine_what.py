"""
Game State Machine Module

This module contains the GameStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
# import time
# from transitions import Machine
from dw.state_machine import BaseStateMachine
# from game_state import GameState
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

    # def start_machine(self):
    #     """
    #     Starts the GameStateMachine by transitioning to the 'idle' state.
    #     """
    #     logging.info("GameStateMachine Start")
    #     self.pong_api.register_observer('game/state', self.on_game_state)

    #     while True:
    #         logging.info("Starting audio-engine loop")
    #         time.sleep(5)


    # def on_game_state(self, message):
    #     """
    #     Callback method for when the BaseState changes.

    #     Parameters:
    #     changed_state (dict): The changed state values.
    #     """
    #     print(f"Game State Transition: {message['transition']}")

    #     state_transition = message['transition']
    #     if state_transition == 'start':
    #         self.start()
    #     elif state_transition == 'player_ready':
    #         self.player_ready()
    #     elif state_transition == 'player_exit':
    #         self.player_exit()
    #     elif state_transition == 'intro_complete':
    #         self.intro_complete()
    #     elif state_transition == 'move_left_intro_complete':
    #         self.move_left_intro_complete()
    #     elif state_transition == 'start_game':
    #         self.start_game()
    #     elif state_transition == 'level1_complete':
    #         self.level1_complete()
    #     elif state_transition == 'level2_complete':
    #         self.level2_complete()
    #     elif state_transition == 'level3_complete':
    #         self.level3_complete()
    #     elif state_transition == 'game_complete':
    #         self.game_complete()
    #     elif state_transition == 'stop':
    #         self.stop()
    #     else:
    #         logging.info(f"Unknown state transition: {state_transition}")
    #         return "Default case"

    # def _on_state_change(self, changed_state):
    #     """
    #     Callback method for when the GameState changes.

    #     Parameters:
    #     changed_state (dict): The changed state values.
    #     """
    #     logging.info("changed_state: %s", changed_state)
    #     # if 'game_state' in changed_state:
    #     #     new_state = changed_state['game_state']
    #     #     if new_state == 'idle':
    #     #         self.reset()
    #     #     elif new_state == 'intro':
    #     #         self.play_intro()
    #     #     elif new_state == 'level1':
    #     #         self.level1()
    #     #     elif new_state == 'level2':
    #     #         self.level2()
    #     #     elif new_state == 'level3':
    #     #         self.level3()
    #     #     elif new_state == 'outro':
    #     #         self.outro()

    def on_enter_idle(self):
        """
        Method called when entering the 'idle' state.
        """
        logging.info("Entering idle state")
            
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
