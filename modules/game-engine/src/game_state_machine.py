"""
Game State Machine Module

This module contains the GameStateMachine class which implements a state machine using the 
'transitions' package to control game flow.
"""

import logging
import time
import threading
from transitions import Machine
from pong import Pong

class GameStateMachine:
    """
    GameStateMachine Class

    This class implements a state machine to control game flow.
    """

    states = ['stopped', 'idle', 'intro', 'level1', 'level2', 'level3', 'outro']

    def __init__(self,
                 game_state,
                 config,
                 top_player,
                 bottom_player,
                 audio_player,
                 tts_synthesizer):
        """
        Initializes the GameStateMachine with the given GameState.

        Parameters:
        game_state (GameState): The GameState instance to observe.
        """
        self.game_state = game_state
        self.config = config
        self.top_player = top_player
        self.bottom_player = bottom_player
        self.audio_player = audio_player
        self.tts_synthesizer = tts_synthesizer
        self.current_fps = self.config.GAME_FPS #(level * 40) + 40#Config.GAME_FPS
        self.machine = Machine(model=self, states=GameStateMachine.states, initial='stopped')
        self.machine.add_transition(trigger='start_machine', source='stopped', dest='idle')
        self.machine.add_transition(trigger='intro', source='idle', dest='intro')
        self.machine.add_transition(trigger='level1', source='intro', dest='level1')
        self.machine.add_transition(trigger='level2', source='level1', dest='level2')
        self.machine.add_transition(trigger='level3', source='level2', dest='level3')
        self.machine.add_transition(trigger='outro', source='level3', dest='outro')
        self.machine.add_transition(trigger='reset', source='outro', dest='idle')

    def on_enter_idle(self):
        """
        Method called when entering the 'idle' state.
        """
        logging.info("Entering idle state")
        self.game_state.game_level = 0
        self.game_state.game_state = 0
        # self.audio_player.play("music_idle.wav")

    def on_exit_idle(self):
        """
        Method called when exiting the 'idle' state.
        """
        logging.info("Exiting idle state")
        # self.audio_player.stop("music_idle.wav")

    def on_enter_intro(self):
        """
        Method called when entering the 'intro' state.
        """
        logging.info("Entering intro state")
        self.audio_player.play("music_background.wav")
        self.audio_player.play("intro.wav")
        time.sleep(21)

    def on_exit_intro(self):
        """
        Method called when exiting the 'intro' state.
        """
        logging.info("Exiting intro state")
        self.audio_player.stop("music_background.wav")

    def on_enter_level1(self):
        """
        Method called when entering the 'level1' state.
        """
        logging.info("Entering level 1 state")
        self.audio_player.play("music_background.wav")
        self.audio_player.play("level_one_complete.wav")
        level = 1
        self.level_init(level)
        time.sleep(15)
        self.level_run(level)

    def on_exit_level1(self):
        """
        Method called when exiting the 'level1' state.
        """
        logging.info("Exiting level1 state")
        self.audio_player.stop("music_background.wav")

    def on_enter_level2(self):
        """
        Method called when entering the 'level2' state.
        """
        logging.info("Entering level 2 state")
        self.audio_player.play("music_background.wav")
        self.audio_player.play("level_two_complete.wav")
        level = 2
        self.level_init(level)
        time.sleep(15)
        self.level_run(level)

    def on_exit_level2(self):
        """
        Method called when exiting the 'level2' state.
        """
        logging.info("Exiting level2 state")
        self.audio_player.stop("music_background.wav")

    def on_enter_level3(self):
        """
        Method called when entering the 'level3' state.
        """
        logging.info("Entering level 3 state")
        self.audio_player.play("music_background.wav")
        self.audio_player.play("level_three_complete.wav")
        level = 3
        self.level_init(level)
        time.sleep(15)
        self.level_run(level, False)

    def on_exit_level3(self):
        """
        Method called when exiting the 'level3' state.
        """
        logging.info("Exiting level3 state")
        self.audio_player.stop("music_background.wav")

    def on_enter_outro(self):
        """
        Method called when entering the 'outro' state.
        """
        logging.info("Entering outro state")
        self.audio_player.play("music_background.wav")
        self.audio_player.play("outro.wav")
        time.sleep(15)

    def on_exit_outro(self):
        """
        Method called when exiting the 'outro' state.
        """
        logging.info("Exiting outro state")
        self.audio_player.stop("music_background.wav")

    def start(self):
        """
        Starts the GameStateMachine by transitioning to the 'idle' state.
        """
        logging.info("GameStateMachine Start")
        self.game_state.add_observer(self, self._on_state_change)
        self.start_machine()

        while True:
            logging.info("Starting game-engine loop")
            time.sleep(5)
  
    def _on_state_change(self, changed_state):
        """
        Callback method for when the GameState changes.

        Parameters:
        changed_state (dict): The changed state values.
        """
        logging.info("changed_state: %s", changed_state)
        if any(key in changed_state for key in ['paddle1_action', 'paddle2_action']):
            logging.info("d1")
            logging.info(self.game_state.get_states(['paddle1_action', 'paddle2_action']).values())
            if all(self.game_state.get_states(['paddle1_action', 'paddle2_action']).values()):
                logging.info("d2")
                self.intro()
        # if 'game_state' in changed_state:
            # new_state = changed_state['game_state']
            # if new_state == 'idle':
            #     self.start()
            # elif new_state == 'intro':
            #     self.play_intro()
            # elif new_state == 'level1':
            #     self.start_level1()
            # elif new_state == 'level2':
            #     self.start_level2()
            # elif new_state == 'level3':
            #     self.start_level3()
            # elif new_state == 'outro':
            #     self.finish_game()
            # elif new_state == 'stopped':
            #     self.reset()

    def level_init(self, level):
        """method representing a person"""
        logging.info("Init level %d", level)
        self.game_state.game_level = level
        self.game_state.game_state = 1
        self.game_state.reset_game_state()
        time.sleep(3) # delay for start here - gives a chance for components to give feedback
        self.game_state.game_state = 2
        time.sleep(1)
        pong_environment = Pong(config = self.config, level = level)
        self.run(level, pong_environment)

    def level_run(self, level, timed_level = True):
        """method representing a person"""
        logging.info("Run level {level}")
        pong_environment = Pong(config = self.config, level = level)
        self.stop_level = False
        threading.Thread(target = self.run, args = (level, pong_environment))
        if timed_level:
            time.sleep(30)
            self.stop_level = True

    def run(self, level, pong_environment):
        """method representing """
        logging.info("running level: %s", level)

        # while not self.stop_level:
        #     pong_environment.step(self, bottom_action, top_action, frames=3, motion_position=None)
        #     # state, reward, done = pong_environment.step(self.config.ACTIONS[action_l], self.config.ACTIONS[action_r], frames=1, motion_position=motion_l)
        #     self.game_state.emit_state(pong_environment.get_packet_info(), request_action=True)
        #     time.sleep(0.01)