import * as AUDIO from './loadAudioFiles';

class AudioFileMap {
  constructor() {
    this.fileMap = new Map([
      ['exhibitActivationNoise', new Audio(AUDIO.exhibitActivationNoise)],
      ['musicIdle', new Audio(AUDIO.musicIdle)],
      ['musicBackground', new Audio(AUDIO.musicBackground)],
      ['levelDefeat', new Audio(AUDIO.levelDefeat)],
      ['paddleHit', new Audio(AUDIO.paddleHit)],
      ['pointLose', new Audio(AUDIO.pointLose)],
      ['pointScore', new Audio(AUDIO.pointScore)],
      ['wallHitLeft', new Audio(AUDIO.wallHitLeft)],
      ['wallHitRight', new Audio(AUDIO.wallHitRight)]
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
