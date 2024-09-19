"""
Simpleaudio/pydub AudioPlayer implementation module.
"""

import logging
from typing import Dict
import pathlib
from audio_player import AudioPlayer
from pydub import AudioSegment
from simpleaudio import PlayObject, play_buffer


class SimpleaudioAudioPlayer(AudioPlayer):
    """
    This class is a Simpleaudio/pydub implementation of the AudioPlayer interface.
    """

    def __init__(self, audio_files_path: str):
        self.audio_files_path = audio_files_path
        self.play_objs: Dict[str, PlayObject] = {}

    def play(self, filename: str):
        """
        This function plays an audio file.

        Arguments:
            filename -- the audio file filename.
        """

        logging.info("Play: %s", filename)

        if filename in self.play_objs:
            self.stop(filename)

        file_extension = pathlib.Path(filename).suffix[1:]
        filepath = f"{self.audio_files_path}/{filename}"
        sound = AudioSegment.from_file(filepath, format=file_extension)

        self.play_objs[filename] = play_buffer(
            sound.raw_data,
            num_channels=sound.channels,
            bytes_per_sample=sound.sample_width,
            sample_rate=sound.frame_rate,
        )

        self.play_objs[filename].wait_done()
        # play(sound)

    def stop(self, filename: str):
        """
        This function stops a currently playing audio file.

        Arguments:
            filename -- the audio file filename.
        """
        self.play_objs[filename].stop()
