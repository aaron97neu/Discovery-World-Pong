"""
PiperVoice TTSSynthesizer implementation module.
"""

import os
import wave
from piper.voice import PiperVoice

class PiperTTSSynthesizer:
    """
    This class is the PiperVoice implementation of the TTSSynthesizer. 
    It recieves recieve a text utterance and synthesize it to a wave file.

    To add voices go to the URL below, download the .onnx and .json files
    for the language and voice you want and add them to the voices folder.
    The .json file should have the same base name as the .onnx file.
    https://rhasspy.github.io/piper-samples/   
    """
    def __init__(self, data_path: str):
        self.data_path = data_path

    def synthesize_to_file(
        self,
        text: str,
        filename: str,
        voice_model: str,
    ):
        """
        This function synthesize a text utterance into a wave audio
        file based on a specified voice model using PiperVoice. 

        Arguments:
            text -- the text utterance.
            filename -- the audio file filename.
            voice_model -- the name of the voice model to use.
        """
        filepath = f"{self.data_path}/{filename}"
        voicedir = "voices/"  # Where onnx model files are stored
        model = voicedir + voice_model + ".onnx"
        voice = PiperVoice.load(model)
        wav_file = wave.open(filepath, "w")
        voice.synthesize(text, wav_file)
        wav_file.close()

    def remove_file(
        self,
        filename: str,
    ):
        """
        This function removes generated audio file. 

        Arguments:
            filename -- the audio file filename.
        """
        filepath = f"{self.data_path}/{filename}"
        os.remove(filepath)

# if implementing streaming tts
#     # Extract data and sampling rate from file
#     # data, fs = sf.read(filename, dtype='float32')

#     # sd.play(data, fs)
#     # status = sd.wait()  # Wait until file is done playing
#     # sd.play(data, fs)
#     # status = sd.wait()  # Wait until file is done playing
#     # sd.play(data, fs)
#     # status = sd.wait()  # Wait until file is done playing

