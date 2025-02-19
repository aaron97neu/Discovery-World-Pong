import * as AUDIO from './loadAudioFiles';

class AudioFileMap {
  constructor() {
    this.fileMap = new Map([
      ['tylerIntro', new Audio(AUDIO.tylerIntro)],
      ['tylerMove', new Audio(AUDIO.tylerMove)],
      ['tylerDuel', new Audio(AUDIO.tylerDuel)],
      ['tylerCountdown', new Audio(AUDIO.tylerCountdown)],
      ['tylerThree', new Audio(AUDIO.tylerThree)],
      ['tylerTwo', new Audio(AUDIO.tylerTwo)],
      ['tylerOne', new Audio(AUDIO.tylerOne)],
      ['tylerGo', new Audio(AUDIO.tylerGo)],
      ['tylerLevelOneComplete', new Audio(AUDIO.tylerLevelOneComplete)],
      ['tylerLevelTwoComplete', new Audio(AUDIO.tylerLevelTwoComplete)],
      ['tylerLevelThreeComplete', new Audio(AUDIO.tylerLevelThreeComplete)],
      ['tylerOutro', new Audio(AUDIO.tylerOutro)]
    ]);
  }

  getAudio(id) {
    return this.fileMap.get(id);
  }
}

export default AudioFileMap;
