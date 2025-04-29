import * as AUDIO from './loadAudioFiles';

class AudioFileMap {
  constructor() {
    this.fileMap = new Map([
      ['tylerIntro', new Audio(AUDIO.tylerIntro)],
      ['tylerMove', new Audio(AUDIO.tylerMove)],
      ['tylerDuel', new Audio(AUDIO.tylerDuel)],
      ['tylerCountdown', new Audio(AUDIO.tylerCountdown)],
      ['tylerLevelOneComplete', new Audio(AUDIO.tylerLevelOneComplete)],
      ['tylerLevelTwoComplete', new Audio(AUDIO.tylerLevelTwoComplete)],
      ['tylerLevelThreeComplete', new Audio(AUDIO.tylerLevelThreeComplete)],
      ['tylerOutro', new Audio(AUDIO.tylerOutro)]
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
