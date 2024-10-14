"""
Game State Machine Module

This module contains the BaseStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
import time
from abc import ABC
from transitions import Machine
from transitions.extensions import GraphMachine
from .base_state import BaseState

class BaseStateMachine(ABC):
    """
    BaseStateMachine Class

    This class implements a state machine to control game flow.
    """

    states = ['stopped', 'idle', 'intro', 'level1', 'level2', 'level3', 'outro']
    transitions = [{'trigger': 'start', 'source': 'stopped', 'dest': 'idle'},
        {'trigger': 'player_ready', 'source': 'idle', 'dest': 'intro'},
        {'trigger': 'intro_complete', 'source': 'intro', 'dest': 'level1'},
        {'trigger': 'game_complete', 'source': 'intro', 'dest': 'idle'},
        {'trigger': 'level1_complete', 'source': 'level1', 'dest': 'level2'},
        {'trigger': 'game_complete', 'source': 'level1', 'dest': 'idle'},
        {'trigger': 'level2_complete', 'source': 'level2', 'dest': 'level3'},
        {'trigger': 'game_complete', 'source': 'level2', 'dest': 'idle'},
        {'trigger': 'level3_complete', 'source': 'level3', 'dest': 'outro'},
        {'trigger': 'game_complete', 'source': 'outro', 'dest': 'idle'},
        {'trigger': 'stop', 'source': 'idle', 'dest': 'stopped'}]

    def __init__(self,
                 base_state: BaseState):
        """
        Initializes the BaseStateMachine with the given BaseState.

        Parameters:
        game_state (BaseState): The BaseState instance to observe.
        """
        self.base_state = base_state
        self.machine = Machine(model=self, states=BaseStateMachine.states, transitions=BaseStateMachine.transitions, initial='stopped', ignore_invalid_triggers=True)
        # self.machine = Machine(model=self, states=BaseStateMachine.states, initial='stopped', ignore_invalid_triggers=True)
        # self.machine.add_transition(trigger='start', source='stopped', dest='idle')
        # self.machine.add_transition(trigger='intro', source='idle', dest='intro')
        # self.machine.add_transition(trigger='level1', source='intro', dest='level1')
        # self.machine.add_transition(trigger='level2', source='level1', dest='level2')
        # self.machine.add_transition(trigger='level3', source='level2', dest='level3')
        # self.machine.add_transition(trigger='outro', source='level3', dest='outro')
        # self.machine.add_transition(trigger='reset', source='outro', dest='idle')
        # self.machine.add_transition(trigger='stop', source='idle', dest='stopped')

    def start_machine(self):
        """
        Starts the BaseStateMachine by transitioning to the 'idle' state.
        """
        logging.info("BaseStateMachine Start")
        self.base_state.add_observer(self, self._on_state_change)
        self.start()

        while True:
            # logging.info("Starting BaseStateMachine loop")
            time.sleep(5)

    def _on_state_change(self, changed_state):
        """
        Callback method for when the BaseState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        logging.info("current_state: %s", self.base_state)
        logging.info("changed_state: %s", changed_state)
        if 'game_state_transition' in changed_state:
            state_transition = changed_state['game_state_transition']
            if state_transition == 'start':
                self.start()
            elif state_transition == 'player_ready':
                self.player_ready()
            elif state_transition == 'intro_complete':
                self.intro_complete()
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

class DiagramModel():
    pass

if __name__ == "__main__":
    logging.info("Diagram BaseStateMachine.")
    model = DiagramModel() # type: ignore
    # base_state_machine = GraphMachine(model, states=BaseStateMachine.states, transitions=BaseStateMachine.transitions, initial='stopped', show_auto_transitions=True) # type: ignore
    base_state_machine = GraphMachine(model, states=BaseStateMachine.states, transitions=BaseStateMachine.transitions, initial='stopped') # type: ignore
    model.get_graph(title='State Machine Diagram for Pong').draw('dw_state_machine_diagram.png', prog='dot') # type: ignore