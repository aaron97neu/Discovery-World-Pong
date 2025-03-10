# Audio Engine

This module supports playing audio files and generating audio file based on Text-To-Speech (TTS). Playing multiple audio files concurrently is supported.

## Voice models
The TTS provider can support different voices via voice model files. Some are packaged with the audio engine and can be found in the voice folder.

The default TTS synthesizer being used is PiperVoice. To use different voices download the .onnx and .json files for the language and voice you want and add them to the voices folder. The .json file should have the same base name as the .onnx file.

tts_text.json is used to feed PiperVoice text for generating a wav audio file. See Resources for a link to the repository, which contains more installation and usage documentation.

## Audio files
TTS files can be generated and played. Some audio files are packaged with the audio engine and can be found in the data folder. 

## Resources

https://github.com/rhasspy/piper
