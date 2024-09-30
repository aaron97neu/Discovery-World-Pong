"""
VLC AudioPlayer implementation module.
"""

import logging
from typing import Dict

# import vlc
from vlc import Instance, MediaPlayer, PlaybackMode
from audio_player import AudioPlayer

class VLCAudioPlayer(AudioPlayer):
    """
    This class is a VLC implementation of the AudioPlayer interface.
    """

    def __init__(self, audio_files_path: str):
        self.audio_files_path = audio_files_path
        self.media_players: Dict[str, MediaPlayer] = {}

    # def play(self, filename: str, loop: bool):
    #     """
    #     This function plays an audio file.

    #     Arguments:
    #         filename -- the audio file filename.
    #     """

    #     if filename in self.media_players:
    #         self.stop(filename)

    #     filepath = f"{self.audio_files_path}/{filename}"
    #     # self.media_players[filename] = MediaPlayer(filepath) # type: ignore
    #     # self.media_players[filename].play()

    #     # creating Instance class object
    #     # player = Instance("--intf dummy --aout alsa")
    #     player:Instance = Instance("--intf dummy --aout alsa --input-repeat=-1") # type: ignore

    #     # creating a new media list 
    #     media_list = player.media_list_new() 

    #     # creating a media player object 
    #     media_player = player.media_list_player_new() 

    #     # creating a new media
    #     media = player.media_new_path(filepath)

    #     # # creating a media player object
    #     # media_player = player.media_player_new()

    #     # adding media to media list 
    #     media_list.add_media(media)

    #     # setting media list to the mediaplayer 
    #     media_player.set_media_list(media_list) 

    #     # setting loop 
    #     a = player.vlm_set_loop("exhibit_activation_noise", True) 
    #     logging.info("this is it: %s - %s", "exhibit_activation_noise", a)
    #     a = player.vlm_set_loop(filename, True) 
    #     logging.info("this is it: %s - %s", filename, a)
    #     a = player.vlm_set_loop(filepath, True) 
    #     logging.info("this is it: %s - %s", filepath, a)

    #     self.media_players[filename] = media_player

    #     # media_player.set_media(media)

    #     # start playing video
    #     media_player.play()
        
    def play(self, filename: str, loop: bool):
        """
        This function plays an audio file.

        Arguments:
            filename -- the audio file filename.
        """

        if filename in self.media_players:
            self.stop(filename)

        filepath = f"{self.audio_files_path}/{filename}"
        # self.media_players[filename] = MediaPlayer(filepath) # type: ignore
        # self.media_players[filename].play()

        # creating Instance class object
        # player = Instance("--intf dummy --aout alsa")
        player:Instance = Instance("--intf dummy --aout alsa --input-repeat=-1") # type: ignore

        # creating a new media
        media = player.media_new_path(filepath)
        
        if loop:
            # -1 for infinite does not work
            media.add_options("input-repeat=65535")

        # creating a media player object
        media_player = player.media_player_new()

        media_player.set_media(media)

        self.media_players[filename] = media_player

        # media_player.set_media(media)

        # start playing video
        logging.info("Playing: %s", filepath)
        media_player.play()
        

    def stop(self, filename: str):
        """
        This function stops a currently playing audio file.

        Arguments:
            filename -- the audio file filename.
        """
        logging.info("Playing: %s", filename)
        self.media_players[filename].stop()
