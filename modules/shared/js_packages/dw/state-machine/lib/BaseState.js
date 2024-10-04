/**
 * @file BaseState.js
 * @class BaseState
 * @description Manages shared state and notifies observers on state changes.
 */

// class BaseState {
export default class BaseState {
    constructor() {
      this.state = {
        game_state: null,
        game_state_transition: null,
      };
      this.observers = [];
    }
  
    /**
     * @method addObserver
     * @description Adds an observer with a specified callback method.
     * @param {Object} observer - The observer object.
     * @param {Function} callback - The callback method.
     */
    addObserver(observer, callback) {
      this.observers.push({ observer, callback });
    }
  
    /**
     * @method removeObserver
     * @description Removes an observer.
     * @param {Object} observer - The observer object.
     */
    removeObserver(observer) {
      this.observers = this.observers.filter(obs => obs.observer !== observer);
    }
  
    /**
     * @method notifyObservers
     * @description Notifies observers of state changes.
     * @param {Object} changes - The changed state values.
     * @param {Object} caller - The caller object.
     */
    notifyObservers(changes, caller) {
      this.observers.forEach(({ observer, callback }) => {
        if (observer !== caller) callback(changes);
      });
    }
  
    /**
     * @method setState
     * @description Sets a single state value.
     * @param {String} key - The state key.
     * @param {any} value - The state value.
     * @param {Object} caller - The caller object.
     */
    setState(key, value, caller) {
      console.log("BaseState setState D1: %s, %s", key, value)
      console.log("BaseState setState D2: %s", this.state[key])
      if (this.state[key] !== value) {
        console.log("BaseState setState D3")
        this.state[key] = value;
        this.notifyObservers({ [key]: value }, caller);
        console.log("BaseState setState D4")
      }
    }
  
    /**
     * @method setStates
     * @description Sets multiple state values.
     * @param {Object} newState - The new state values.
     * @param {Object} caller - The caller object.
     */
    setStates(newState, caller) {
      const changes = {};
      for (const key in newState) {
        if (this.state[key] !== newState[key]) {
          this.state[key] = newState[key];
          changes[key] = newState[key];
        }
      }
      if (Object.keys(changes).length > 0) {
        this.notifyObservers(changes, caller);
      }
    }
  
    /**
     * @method getState
     * @description Gets a single state value.
     * @param {String} key - The state key.
     * @returns {any} - The state value.
     */
    getState(key) {
      return this.state[key];
    }
  
    /**
     * @method getStates
     * @description Gets multiple state values.
     * @param {Array} keys - The state keys.
     * @returns {Object} - The state values.
     */
    getStates(keys) {
      const result = {};
      keys.forEach(key => {
        result[key] = this.state[key];
      });
      return result;
    }
  }
  
  // module.exports = BaseState;
// export default BaseState;  