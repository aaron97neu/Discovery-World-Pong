import AudioFiles from './AudioFiles.js';

class AudioPlayer {
  constructor() {
    this.audioFiles = new AudioFiles();
  }

  async play(id) {
    const audio = this.audioFiles.getAudio(id);
    if (audio) {
      await audio.play();
    } else {
      console.error(`Audio with ID "${id}" not found.`);
    }
  }

  pause(id) {
    const audio = this.audioFiles.getAudio(id);
    if (audio) {
      audio.pause();
    } else {
      console.error(`Audio with ID "${id}" not found.`);
    }
  }

  stop(id) {
    const audio = this.audioFiles.getAudio(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      console.error(`Audio with ID "${id}" not found.`);
    }
  }

  setVolume(id, volume) {
    const audio = this.audioFiles.getAudio(id);
    if (audio) {
      audio.volume = volume;
    } else {
      console.error(`Audio with ID "${id}" not found.`);
    }
  }

  onEnd(id, callback) {
    const audio = this.audioFiles.getAudio(id);
    if (audio) {
      audio.onended = callback;
    } else {
      console.error(`Audio with ID "${id}" not found.`);
    }
  }
}

export default AudioPlayer;