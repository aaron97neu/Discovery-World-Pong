/**
 * @module BaseState
 * @description This module defines the BaseState class which contains game state objects and implements the observer pattern.
 */

/**
 * @enum {string}
 * @description Enum for game state transitions.
 */
const Transition = Object.freeze({
  START: 'start',
  PLAYER_READY: 'playerReady',
  START_GAME: 'startGame',
  PLAYER_EXIT: 'playerExit',
  INTRO_COMPLETE: 'introComplete',
  MOVE_LEFT_INTRO_COMPLETE: 'moveLeftIntroComplete',
  LEVEL1_COMPLETE: 'level1Complete',
  LEVEL2_COMPLETE: 'level2Complete',
  LEVEL3_COMPLETE: 'level3Complete',
  STOP: 'stop'
});

/**
* @class BaseState
* @description Represents the base state of the game, containing various game-related objects and implementing the observer pattern.
*/
export default class BaseState {
  constructor() {
      this.gamePlay = {
          ballPosition: { x: 0, y: 0 },
          topPaddlePosition: { x: 0 },
          bottomPaddlePosition: { x: 0 }
      };

      this.gameStats = {
          topScore: 0,
          bottomScore: 0,
          countDown: 0
      };

      this.gameState = {
          transition: Transition.START
      };

      this.topPaddleState = { x: 0 };
      this.bottomPaddleState = { x: 0 };

      this.observers = {
          gamePlay: [],
          gameStats: [],
          gameState: [],
          topPaddleState: [],
          bottomPaddleState: []
      };
  }

  /**
   * @method addObserver
   * @description Adds an observer for a specific object type.
   * @param {string} objectType - The type of object to observe.
   * @param {function} observer - The observer function to notify on changes.
   */
  addObserver(objectType, observer) {
      if (this.observers[objectType]) {
          this.observers[objectType].push(observer);
      }
  }

  /**
   * @method notifyObservers
   * @description Notifies all observers of a specific object type.
   * @param {string} objectType - The type of object that has changed.
   */
  notifyObservers(objectType) {
      if (this.observers[objectType]) {
          this.observers[objectType].forEach(observer => observer(this[objectType]));
      }
  }

  /**
   * @method updateGamePlay
   * @description Updates the gamePlay object and notifies observers.
   * @param {object} newGamePlay - The new gamePlay object.
   */
  updateGamePlay(newGamePlay) {
      this.gamePlay = newGamePlay;
      this.notifyObservers('gamePlay');
  }

  /**
   * @method updateGameStats
   * @description Updates the gameStats object and notifies observers.
   * @param {object} newGameStats - The new gameStats object.
   */
  updateGameStats(newGameStats) {
      this.gameStats = newGameStats;
      this.notifyObservers('gameStats');
  }

  /**
   * @method updateGameState
   * @description Updates the gameState object and notifies observers.
   * @param {object} newGameState - The new gameState object.
   */
  updateGameState(newGameState) {
      this.gameState = newGameState;
      this.notifyObservers('gameState');
  }

  /**
   * @method updateTopPaddleState
   * @description Updates the topPaddleState object and notifies observers.
   * @param {object} newTopPaddleState - The new topPaddleState object.
   */
  updateTopPaddleState(newTopPaddleState) {
      this.topPaddleState = newTopPaddleState;
      this.notifyObservers('topPaddleState');
  }

  /**
   * @method updateBottomPaddleState
   * @description Updates the bottomPaddleState object and notifies observers.
   * @param {object} newBottomPaddleState - The new bottomPaddleState object.
   */
  updateBottomPaddleState(newBottomPaddleState) {
      this.bottomPaddleState = newBottomPaddleState;
      this.notifyObservers('bottomPaddleState');
  }
}