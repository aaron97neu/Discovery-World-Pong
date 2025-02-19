import mqtt from 'mqtt';
import Ajv from 'ajv';
import pongAPISchema from './PongAPISchema.js';
import { v4 as uuidv4 } from 'uuid';

export default class PongAPI {
  /**
   * Enum for PongAPI topics.
   * @readonly
   * @enum {string}
   */
  static Topics = {
    GAME_PLAY: 'game/play',
    GAME_STATS: 'game/stats',
    GAME_STATE: 'game/state',
    PADDLE_TOP_POSITION: 'paddle/top/position',
    PADDLE_TOP_STATE: 'paddle/top/state',
    PADDLE_TOP_STATE_TRANSITION: 'paddle/top/state_transition',
    PADDLE_BOTTOM_POSITION: 'paddle/bottom/position',
    PADDLE_BOTTOM_STATE: 'paddle/bottom/state',
    PADDLE_BOTTOM_STATE_TRANSITION: 'paddle/bottom/state_transition',
  };

  /**
   * Creates an instance of PongAPI.
   * @param {string} clientId - The client ID for the MQTT connection.
   * @param {string} brokerUrl - The URL of the MQTT broker.
   */
  constructor(clientId, brokerUrl) {
    this.clientId = clientId;
    this.brokerUrl = brokerUrl;
    this.client = null;
    this.observers = {};
    this.ajv = new Ajv();
    this.pongAPISchema = pongAPISchema;
    this.validate = this.ajv.compile(pongAPISchema);
    this.connected = false;
    this.instanceId = uuidv4();
  }

  getInstanceId() {
    return this.instanceId;
  }

  /**
   * Starts the MQTT connection.
   */
  start() {
    this.client = mqtt.connect(this.brokerUrl, { clientId: this.clientId });
    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      console.log(`PongAPI instanceId: ${this.instanceId}`);
      Object.keys(this.observers).forEach(topic => {
        this.client.subscribe(topic);
      });
      this.connected = true;
    });

    this.client.on('disconnect', () => {
      console.log('Disconnected from MQTT broker');
      this.connected = false;
    });

    this.client.on('error', (err) => {
      console.log('MQTT Broker Connection error:', err);
    });

    this.client.on('message', (topic, message) => {
      // console.log(`Publish -- topic: ${topic}, message: ${message}`)
      const parsedMessage = JSON.parse(message.toString());
      if (this.validateMessage(topic, parsedMessage)) {
        this.notifyObservers(topic, parsedMessage);
      }
    });
  }

  /**
   * Stops the MQTT connection and cleans up.
   */
  stop() {
    if (this.client) {
      this.client.end();
      this.client = null;
      console.log('Disconnected from broker');
    }
  }

  /**
   * Checks if the client is connected.
   * @returns {boolean} - True if connected, false otherwise.
   */
  isConnected() {
    // return this.client && this.client.connected;
    return this.connected;
  }

  /**
   * Registers an observer for a specific topic.
   * @param {string} topic - The topic to subscribe to.
   * @param {function} callback - The callback function to notify.
   */
  registerObserver(topic, callback) {
    if (!this.observers[topic]) {
      this.observers[topic] = [];
      if (this.isConnected()) {
        this.client.subscribe(topic);
      }
    }
    this.observers[topic].push(callback);
  }

  /**
   * Notifies observers of a new message.
   * @param {string} topic - The topic of the message.
   * @param {object} message - The message to notify observers with.
   */
  notifyObservers(topic, message) {
    if (this.observers[topic]) {
      this.observers[topic].forEach(callback => callback(message));
    }
  }

  /**
   * Validates a message against the schema.
   * @param {string} topic - The topic of the message.
   * @param {object} message - The message to validate.
   * @returns {boolean} - True if valid, false otherwise.
   */
  validateMessage(topic, message) {
    // const valid = this.validate({ topic, message });
    const valid = this.validate({ topic: message });
    if (!valid) {
      console.error('Invalid message:', this.validate.errors);
    }
    return valid;
  }

  /**
   * Publishes a message to a topic.
   * @param {string} topic - The topic to publish to.
   * @param {object} message - The message to publish.
   */
  update(topic, message) {
    if (this.isConnected()) {
      if (this.validateMessage(topic, message)) {
        const payload = JSON.stringify(message);
        // console.log(`Publish -- topic: ${topic}, message: ${payload}`)
        this.client.publish(topic, payload);
      }
    }
  }
}
