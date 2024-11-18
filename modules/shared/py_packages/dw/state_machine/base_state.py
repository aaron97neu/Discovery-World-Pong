"""
Game State Module

This module contains the BaseState class which implements the application state using the 
Global Object pattern and the Observer pattern.
"""

from abc import ABC
from typing import TypedDict

   
class BaseState(ABC):
    """
    BaseState Class

    This class manages the application state and notifies observers of state changes.
    """
    class State(TypedDict):
        game_countdown: int
        game_ball_position: int
        game_bottom_paddle_position: int
        game_top_paddle_position: int
        game_bottom_score: int
        game_top_score: int
        game_state: str
        game_state_transition: str  

    def __init__(self):
        """
        Initializes the BaseState with default values and an empty list of observers.
        """
        self._state: BaseState.State = {
            'game_countdown': 0,
            'game_ball_position': 0,
            'game_bottom_paddle_position': 0,
            'game_top_paddle_position': 0,
            'game_bottom_score': 0,
            'game_top_score': 0,
            'game_state': "",
            'game_state_transition': "",
        }
        self._observers = []

    def add_observer(self, observer, callback):
        """
        Adds an observer to the list of observers.

        Parameters:
        observer (object): The observer object.
        callback (method): The method to call when notifying the observer.
        """
        self._observers.append((observer, callback))

    def remove_observer(self, observer):
        """
        Removes an observer from the list of observers.

        Parameters:
        observer (object): The observer object to remove.
        """
        self._observers = [obs for obs in self._observers if obs[0] != observer]

    def _notify_observers(self, changed_state, caller):
        """
        Notifies observers of state changes.

        Parameters:
        changed_state (dict): The changed state values.
        caller (object): The caller object that initiated the state change.
        """
        for observer, callback in self._observers:
            if observer != caller:
                callback(changed_state)

    def set_state(self, key, value, caller=None):
        """
        Sets a single state value and notifies observers if the value has changed.

        Parameters:
        key (str): The state key to set.
        value (any): The state value to set.
        caller (object): The caller object that initiated the state change.
        """
        if self._state[key] != value:
            self._state[key] = value
            self._notify_observers({key: value}, caller)

    def get_state(self, key):
        """
        Gets a single state value.

        Parameters:
        key (str): The state key to get.

        Returns:
        any: The state value.
        """
        return self._state[key]

    def set_states(self, state_dict, caller=None):
        """
        Sets multiple state values and notifies observers if any values have changed.

        Parameters:
        state_dict (dict): A dictionary of state key-value pairs to set.
        caller (object): The caller object that initiated the state change.
        """
        changed_state = {}
        for key, value in state_dict.items():
            if self._state[key] != value:
                self._state[key] = value
                changed_state[key] = value
        if changed_state:
            self._notify_observers(changed_state, caller)

    def get_states(self, keys):
        """
        Gets multiple state values.

        Parameters:
        keys (list): A list of state keys to get.

        Returns:
        dict: A dictionary of state key-value pairs.
        """
        return {key: self._state[key] for key in keys}
