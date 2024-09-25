"""
TTS Text Module

This module contains the TTSText class which reads multiple text strings from a JSON file and 
assigns them to variables.
"""

import json

class TTSText:
    """
    TTSText Class

    This class reads multiple text strings from a JSON file and assigns them to variables.
    """

    def __init__(self, config_files_path: str):
        """
        Initializes the TTSText with the given JSON file.

        Parameters:
        json_file (str): The path to the JSON file.
        """
        self.config_files_path = config_files_path
        self.json_file = f"{self.config_files_path}/tts_text.json"
        self.voice_model: str = "en_US-hfc_male-medium"
        self.intro: str = ""
        self.level_one_complete: str = ""
        self.level_two_complete: str = ""
        self.level_three_complete: str = ""
        self.outro: str = ""
        self.load_texts()

    def load_texts(self):
        """
        Loads text strings from the JSON file and assigns them to variables.
        """
        with open(self.json_file, 'r', encoding="utf-8") as file:
            data = json.load(file)
            self.voice_model = data['config']['voice_model']
            self.intro = data['intro']
            self.level_one_complete = data['level_one_complete']
            self.level_two_complete = data['level_two_complete']
            self.level_three_complete = data['level_three_complete']
            self.outro = data['outro']
