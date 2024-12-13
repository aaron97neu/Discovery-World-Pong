"""
Game State Machine Module

This module contains the BaseStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
import time
# from abc import ABC
from transitions import Machine
from transitions.extensions import GraphMachine
# from .base_state import BaseState
from .pong_api import PongAPI

# class BaseStateMachine(ABC):
class BaseStateMachine():
    """
    BaseStateMachine Class

    This class implements a state machine to control game flow.
    """

    states = ['stopped', 'idle', 'intro', 'moveLeftIntro', 'moveRightIntro', 'level1', 'level2', 'level3', 'outro']
    transitions = [
        {'trigger': 'start', 'source': 'stopped', 'dest': 'idle'},
        {'trigger': 'player_ready', 'source': 'idle', 'dest': 'intro'},
        {'trigger': 'start_game', 'source': 'intro', 'dest': 'level1'},
        {'trigger': 'player_exit', 'source': 'intro', 'dest': 'idle'},
        {'trigger': 'intro_complete', 'source': 'intro', 'dest': 'move_left_intro'},
        {'trigger': 'player_exit', 'source': 'move_left_intro', 'dest': 'idle'},
        {'trigger': 'move_left_intro_complete', 'source': 'move_left_intro', 'dest': 'move_right_intro'},
        {'trigger': 'player_exit', 'source': 'move_right_intro', 'dest': 'idle'},
        {'trigger': 'start_game', 'source': 'move_right_intro', 'dest': 'level1'},
        {'trigger': 'player_exit', 'source': 'level1', 'dest': 'idle'},
        {'trigger': 'level1_complete', 'source': 'level1', 'dest': 'level2'},
        {'trigger': 'player_exit', 'source': 'level2', 'dest': 'idle'},
        {'trigger': 'level2_complete', 'source': 'level2', 'dest': 'level3'},
        {'trigger': 'player_exit', 'source': 'level3', 'dest': 'idle'},
        {'trigger': 'level3_complete', 'source': 'level3', 'dest': 'outro'},
        {'trigger': 'player_exit', 'source': 'outro', 'dest': 'idle'},
        {'trigger': 'stop', 'source': 'idle', 'dest': 'stopped'}
        ]

    def __init__(self,
                 pong_api: PongAPI):
        """
        Initializes the BaseStateMachine with the given BaseState.

        Parameters:
        pong_api (PongAPI): The PongAPI instance to observe.
        """
        self.pong_api = pong_api
        self.machine = Machine(model=self, states=BaseStateMachine.states, transitions=BaseStateMachine.transitions, initial='stopped', ignore_invalid_triggers=True)

    def start_machine(self):
        """
        Starts the BaseStateMachine by transitioning to the 'idle' state.
        """
        logging.info("BaseStateMachine Start")
        self.pong_api.register_observer('game/state', self.on_game_state)
        self.start()

        while True:
            # logging.info("Starting BaseStateMachine loop")
            time.sleep(5)

    def on_game_state(self, message):
        """
        Callback method for when the BaseState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        print(f"Game State Transition: {message['transition']}")

        state_transition = message['transition']
        if state_transition == 'start':
            self.start()
        elif state_transition == 'player_ready':
            self.player_ready()
        elif state_transition == 'player_exit':
            self.player_exit()
        elif state_transition == 'intro_complete':
            self.intro_complete()
        elif state_transition == 'move_left_intro_complete':
            self.move_left_intro_complete()
        elif state_transition == 'start_game':
            self.start_game()
        elif state_transition == 'level1_complete':
            self.level1_complete()
        elif state_transition == 'level2_complete':
            self.level2_complete()
        elif state_transition == 'level3_complete':
            self.level3_complete()
        elif state_transition == 'game_complete':
            self.game_complete()
        elif state_transition == 'stop':
            self.stop()
        else:
            logging.info(f"Unknown state transition: {state_transition}")
            return "Default case"

    # def _on_state_change(self, changed_state):
    #     """
    #     Callback method for when the BaseState changes.

    #     Parameters:
    #     changed_state (dict): The changed state values.
    #     """
    #     # logging.info("current_state: %s", self.base_state)
    #     logging.info("changed_state: %s", changed_state)
    #     if 'game_state_transition' in changed_state:
    #         state_transition = changed_state['game_state_transition']
    #         if state_transition == 'start':
    #             self.start()
    #         elif state_transition == 'player_ready':
    #             self.player_ready()
    #         elif state_transition == 'player_exit':
    #             self.player_exit()
    #         elif state_transition == 'intro_complete':
    #             self.intro_complete()
    #         elif state_transition == 'move_left_intro_complete':
    #             self.move_left_intro_complete()
    #         elif state_transition == 'start_game':
    #             self.start_game()
    #         elif state_transition == 'level1_complete':
    #             self.level1_complete()
    #         elif state_transition == 'level2_complete':
    #             self.level2_complete()
    #         elif state_transition == 'level3_complete':
    #             self.level3_complete()
    #         elif state_transition == 'game_complete':
    #             self.game_complete()
    #         elif state_transition == 'stop':
    #             self.stop()
    #         else:
    #             logging.info(f"Unknown state transition: {state_transition}")
    #             return "Default case"

class DiagramModel():
    pass

if __name__ == "__main__":
    logging.info("Diagram BaseStateMachine.")
    model = DiagramModel() # type: ignore
    # base_state_machine = GraphMachine(model, states=BaseStateMachine.states, transitions=BaseStateMachine.transitions, initial='stopped', show_auto_transitions=True) # type: ignore
    base_state_machine = GraphMachine(model, states=BaseStateMachine.states, transitions=BaseStateMachine.transitions, initial='stopped') # type: ignore
    model.get_graph(title='State Machine Diagram for Pong').draw('dw_state_machine_diagram.png', prog='dot') # type: ignore