"""
AudioPlayer Interface definition module.
"""
from threading import Thread
from abc import ABC, abstractmethod

class AudioPlayer(ABC):
    """
    This protocol class defines the interface for all audio players.
    Implementations of this interface will manage the playing of audio
    files.
    """

    @abstractmethod
    def play(self, filename: str, loop: bool=False):
        """
        Implementations of this function plays an audio file.

        Arguments:
            filename -- the audio file filename.
        """

    @abstractmethod
    def stop(self, filename: str):
        """
        Implementations of this function stops a currently playing audio
        file.

        Arguments:
            filename -- the audio file filename.
        """

    def play_async(self, filename: str, loop: bool=False):
        """
        This function implements an asynchronous command to play and audio file.  

        Arguments:
            filename -- the audio file filename.
        """
        Thread(target=self.play, args=(filename,loop)).start()

    def stop_async(self, filename: str):
        """
        This function implements an asynchronous command to stop a playing audio file.  

        Arguments:
            filename -- the audio file filename.
        """
        Thread(
            target=self.stop,
            args=(filename,),
        ).start()