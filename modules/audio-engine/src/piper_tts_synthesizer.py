"""
PiperVoice TTSSynthesizer implementation module.
"""

import os
import wave
from piper.voice import PiperVoice
from tts_synthesizer import TTSSynthesizer


class PiperTTSSynthesizer(TTSSynthesizer):
    """
    This class is the PiperVoice implementation of the TTSSynthesizer.
    It recieves recieve a text utterance and synthesize it to a wave file.

    To add voices go to the URL below, download the .onnx and .json files
    for the language and voice you want and add them to the voices folder.
    The .json file should have the same base name as the .onnx file.
    https://rhasspy.github.io/piper-samples/
    """

    def __init__(self, audio_files_path: str, 
                 voice_files_path: str,
                 voice_model: str):
        self.audio_files_path = audio_files_path
        self.voice_files_path = voice_files_path
        self.voice_model = voice_model

    def synthesize_to_file(self,
                           text: str,
                           filename: str):
        """
        This function synthesize a text utterance into a wave audio
        file based on a specified voice model using PiperVoice.

        Arguments:
            text -- the text utterance.
            filename -- the audio file filename.
            voice_model -- the name of the voice model to use.
        """
        filepath = f"{self.audio_files_path}/{filename}"
        # voicedir = "voices/"  # Where onnx model files are stored
        # model = voicedir + self.voice_model + ".onnx"
        model = f"{self.voice_files_path}/{self.voice_model}.onnx"
        voice = PiperVoice.load(model)
        wav_file = wave.open(filepath, "w")
        voice.synthesize(text, wav_file)
        wav_file.close()

    def remove_file(
        self,
        filename: str):
        """
        This function removes generated audio file.

        Arguments:
            filename -- the audio file filename.
        """
        filepath = f"{self.audio_files_path}/{filename}"
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
