"""
VLC AudioPlayer implementation module.
"""

from typing import Dict

# import vlc
from vlc import Instance, MediaPlayer
from audio_player import AudioPlayer

class VLCAudioPlayer(AudioPlayer):
    """
    This class is a VLC implementation of the AudioPlayer interface.
    """

    def __init__(self, audio_files_path: str):
        self.audio_files_path = audio_files_path
        self.media_players: Dict[str, MediaPlayer] = {}

    def play(self, filename: str):
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
        player = Instance("--intf dummy")

        # creating a new media
        media = player.media_new(filepath)

        # creating a media player object
        media_player = player.media_player_new()

        self.media_players[filename] = media_player

        media_player.set_media(media)

        # setting video scale
        media_player.video_set_scale(0.6)

        # start playing video
        media_player.play()

    def stop(self, filename: str):
        """
        This function stops a currently playing audio file.

        Arguments:
            filename -- the audio file filename.
        """
        self.media_players[filename].stop()
