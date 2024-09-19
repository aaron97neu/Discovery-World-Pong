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

    def __init__(self, json_file):
        """
        Initializes the TTSText with the given JSON file.

        Parameters:
        json_file (str): The path to the JSON file.
        """
        self.json_file = json_file
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
            self.intro = data.get('intro')
            self.level_one_complete = data.get('level_one_complete')
            self.level_two_complete = data.get('level_two_complete')
            self.level_three_complete = data.get('level_three_complete')
            self.outro = data.get('outro')
