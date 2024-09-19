"""
TTSSynthesizer Interface definition module.
"""

from threading import Thread
from abc import ABC, abstractmethod

class TTSSynthesizer(ABC):
    """
    This ABC class defines the interface for all TTS synthesizers.
    Implementations of this interface will recieve a text utterance and
    synthesize it to a wave file.
    """

    @abstractmethod
    def synthesize_to_file(self,
                           text: str,
                           filename: str,
                           voice_model: str = "en_US-hfc_male-medium"):
        """
        Implementations of this function synthesize a text utterance into
        a wave audio file based on a specified voice model. 

        Arguments:
            text -- the text utterance.
            filename -- the audio file filename.
            voice_model -- the name of the voice model to use.
        """

    @abstractmethod        
    def remove_file(self, 
                    filename: str):
        """
        Implementations of this function removes a generated audio
        file.

        Arguments:
            filename -- the audio file filename.
        """

    def synthesize_to_file_async(
        self,
        text: str,
        filename: str,
        voice_model: str = "en_US-hfc_male-medium"
    ):
        """
        This function implements an asynchronous command to synthesize a text 
        utterance into a wave audio file based on a specified voice model.  

        Arguments:
            text -- the text utterance.
            filename -- the audio file filename.
            voice_model -- the name of the voice model to use.
        """
        Thread(
            target=self.synthesize_to_file,
            args=(
                text,
                filename,
                voice_model
            ),
        ).start()

    def remove_file_async(self, filename: str):
        """
        This function implements an asynchronous command to stop a playing audio file.  

        Arguments:
            filename -- the audio file filename.
        """
        Thread(
            target=self.remove_file,
            args=(filename,),
        ).start()
