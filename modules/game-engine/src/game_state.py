"""
Game State Module

This module contains the GameState class which implements the application state using the 
Global Object pattern and the Observer pattern.
"""

class GameState:
    """
    GameState Class

    This class manages the application state and notifies observers of state changes.
    """

    def __init__(self, tts_text):
        """
        Initializes the GameState with default values and an empty list of observers.
        """
        self.tts_text = tts_text
        self._state = {
            'paddle1_action': None,
            'paddle1_frame': None,
            'paddle2_action': None,
            'paddle2_frame': None,
            'motion_position': None,
            'motion_presence': None,
            'game_level': None,
            'game_state': None,
            'puck_position': None,
            'paddle1_position': None,
            'paddle2_position': None,
            'player1_score': None,
            'player2_score': None,
            'game_frame': None
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
