# Audio Engine
This repository contains the code for the audio engine component of the Rockwell Automation "Pong" exhibit at the Discovery World Museum.

It supports playing audio files and generating audio file based on Text-To-Speech (TTS). Playing multiple audio files concurrently is supported.

## Voice models
The TTS provider can support different voices via voice model files. Some are packaged with the audio engine and can be found in the voice folder.

The default TTS synthesizer being used is PiperVoice. To add additional voices go to the [Piper Samples](https://rhasspy.github.io/piper-samples/), download the .onnx and .json files for the language and voice you want and add them to the voices folder. The .json file should have the same base name as the .onnx file.

## Audio files
TTS files can be generated and played. Some audio files are packaged with the audio engine and can be found in the data folder. 

## Running standalone
To run outside of the pong system, run a docker command similar to the following:
```
docker run --rm --device /dev/snd audio-engine -c --set text='Hello, My name is Pong.' --set filename='hello.wav' --set vm='en_US-hfc_male-medium'
```

## Generating and playing audio within the pong system
Generating and playing audio within the pong system uses MQTT events as commands to the audio engine. The MQTT topics and JSON messages are described as follows.

### Synthesizing TTS
#### Topic: audio/record_tts_to_file

#### Schema: 
```json
{
    "$id": "https://dw-pong.com/tts.schema.json",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "TTS",
    "properties": {    
        "text" : {
            "type": "string"
        }, 
        "filename" : {
            "type": "string"
        }, 
        "voice_model" : {
            "type": "string"
        }
    },
    "required": ["text", "filename"],
    "additionalProperties": false
}
```

#### Exammple: 
```json
{
    "text": "Test.",
    "filename": "test.wav",
    "voice_model": "en_US-hfc_male-medium"
}
```

### Play audio file
#### Topic: audio/play

#### Schema: 
```json
{
    "$id": "https://dw-pong.com/play.schema.json",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Play",
    "properties": {    
        "filename" : {
            "type": "string"
        }
    },
    "required": ["filename"],
    "additionalProperties": false
}
```

#### Exammple: 
```json
{
    "filename": "test.wav"
}
```

### Stop audio file
#### Topic: audio/stop

#### Schema: 
```json
{
    "$id": "https://dw-pong.com/stop.schema.json",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Stop",
    "properties": {    
        "filename" : {
            "type": "string"
        }
    },
    "required": ["filename"],
    "additionalProperties": false
}
```

#### Exammple: 
```json
{
    "filename": "test.wav"
}
```

### Remove audio file
#### Topic: audio/remove
#### Schema: 
```json
{
    "$id": "https://dw-pong.com/remove.schema.json",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Remove",
    "properties": {    
        "filename" : {
            "type": "string"
        }
    },
    "required": ["filename"],
    "additionalProperties": false
}
```

#### Exammple: 
```json
{
    "filename": "test.wav"
}
```

