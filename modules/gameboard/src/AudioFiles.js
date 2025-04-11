import * as AUDIO from './loadAudioFiles';

class AudioFileMap {
  constructor() {
    this.fileMap = new Map([
      ['exhibitActivationNoise', new Audio(AUDIO.exhibitActivationNoise)],
      ['musicIdle', new Audio(AUDIO.musicIdle)],
      ['musicBackground', new Audio(AUDIO.musicBackground)],
      ['level1Win', new Audio(AUDIO.level1Win)],
      ['level2Win', new Audio(AUDIO.level2Win)],
      ['levelDefeat', new Audio(AUDIO.levelDefeat)],
      ['onTheScoreboard', new Audio(AUDIO.onTheScoreboard)],
      ['paddleHit', new Audio(AUDIO.paddleHit)],
      ['pointLose', new Audio(AUDIO.pointLose)],
      ['pointScore', new Audio(AUDIO.pointScore)]
    ]);

    // Preload all audio files
    this.preloadAllAudio();
  }

  preloadAllAudio() {
    this.fileMap.forEach((audio, key) => {
      audio.load(); // Force the browser to preload the audio file
    });
  }

  getAudio(id) {
    return this.fileMap.get(id);
  }
}

export default AudioFileMap;
