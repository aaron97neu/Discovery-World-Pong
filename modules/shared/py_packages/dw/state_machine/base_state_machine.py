"""
Game State Machine Module

This module contains the GameStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
import time
from abc import ABC
from transitions import Machine
from dw.state_machine import BaseState

class BaseStateMachine(ABC):
    """
    GameStateMachine Class

    This class implements a state machine to control game flow.
    """

    states = ['stopped', 'idle', 'intro', 'level1', 'level2', 'level3', 'outro']

    def __init__(self,
                 base_state: BaseState):
        """
        Initializes the GameStateMachine with the given GameState.

        Parameters:
        game_state (GameState): The GameState instance to observe.
        """
        self.base_state = base_state
        self.machine = Machine(model=self, states=BaseStateMachine.states, initial='stopped')
        self.machine.add_transition(trigger='start_machine', source='stopped', dest='idle')
        self.machine.add_transition(trigger='intro', source='idle', dest='intro')
        self.machine.add_transition(trigger='level1', source='intro', dest='level1')
        self.machine.add_transition(trigger='level2', source='level1', dest='level2')
        self.machine.add_transition(trigger='level3', source='level2', dest='level3')
        self.machine.add_transition(trigger='outro', source='level3', dest='outro')
        self.machine.add_transition(trigger='reset', source='outro', dest='idle')


    def start(self):
        """
        Starts the GameStateMachine by transitioning to the 'idle' state.
        """
        logging.info("GameStateMachine Start")
        self.game_state.add_observer(self, self._on_state_change)

        while True:
            logging.info("Starting audio-engine loop")
            time.sleep(5)

    def _on_state_change(self, changed_state):
        """
        Callback method for when the GameState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        logging.info("changed_state: %s", changed_state)
        # if 'game_state' in changed_state:
        #     new_state = changed_state['game_state']
        #     if new_state == 'idle':
        #         self.reset()
        #     elif new_state == 'intro':
        #         self.play_intro()
        #     elif new_state == 'level1':
        #         self.level1()
        #     elif new_state == 'level2':
        #         self.level2()
        #     elif new_state == 'level3':
        #         self.level3()
        #     elif new_state == 'outro':
        #         self.outro()

    # def on_enter_idle(self):
    #     """
    #     Method called when entering the 'idle' state.
    #     """
    #     logging.info("Entering idle state")
            
    # def on_exit_idle(self):
    #     """
    #     Method called when exiting the 'idle' state.
    #     """
    #     logging.info("Exiting idle state")

    # def on_enter_intro(self):
    #     """
    #     Method called when entering the 'intro' state.
    #     """
    #     logging.info("Entering intro state")

    # def on_exit_intro(self):
    #     """
    #     Method called when exiting the 'intro' state.
    #     """
    #     logging.info("Exiting intro state")

    # def on_enter_level1(self):
    #     """
    #     Method called when entering the 'level1' state.
    #     """
    #     logging.info("Entering level 1 state")

    # def on_exit_level1(self):
    #     """
    #     Method called when exiting the 'level1' state.
    #     """

    # def on_enter_level2(self):
    #     """
    #     Method called when entering the 'level2' state.
    #     """
    #     logging.info("Entering level 2 state")

    # def on_exit_level2(self):
    #     """
    #     Method called when exiting the 'level2' state.
    #     """
    #     logging.info("Exiting level2 state")

    # def on_enter_level3(self):
    #     """
    #     Method called when entering the 'level3' state.
    #     """
    #     logging.info("Entering level 3 state")

    # def on_exit_level3(self):
    #     """
    #     Method called when exiting the 'level3' state.
    #     """
    #     logging.info("Exiting level3 state")

    # def on_enter_outro(self):
    #     """
    #     Method called when entering the 'outro' state.
    #     """
    #     logging.info("Entering outro state")

    # def on_exit_outro(self):
    #     """
    #     Method called when exiting the 'outro' state.
    #     """
    #     logging.info("Exiting outro state")