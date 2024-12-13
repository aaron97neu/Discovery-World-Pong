import mqtt from 'mqtt';
import Ajv from 'ajv';
import { pongSchema } from './PongAPISchema.js';

/**
 * PongAPI class to handle MQTT communication for a Pong game.
 */
export default class PongAPI {
    static topics = ['game/play', 'game/stats', 'game/state', 'paddle/top', 'paddle/bottom'];

    /**
     * Constructor for PongAPI.
     * @param {string} clientId - The client ID for the MQTT connection.
     * @param {string} brokerUrl - The URL of the MQTT broker.
     */
    constructor(clientId, brokerUrl) {
        this.clientId = clientId;
        this.brokerUrl = brokerUrl;
        this.client = null;
        this.ajv = new Ajv();
        this.observers = {};
        PongAPI.topics.forEach(topic => this.observers[topic] = []);
    }

    /**
     * Start the MQTT connection.
     */
    start() {
        this.client = mqtt.connect(this.brokerUrl, { clientId: this.clientId });
        this.client.on('connect', () => {
            PongAPI.topics.forEach(topic => this.client.subscribe(topic));
        });
        this.client.on('message', (topic, message) => this.notifyObservers(topic, message));
    }

    /**
     * Stop the MQTT connection and cleanup.
     */
    stop() {
        if (this.client) {
            this.client.end();
            this.client = null;
        }
    }

    /**
     * Check if the client is connected.
     * @returns {boolean} - True if connected, false otherwise.
     */
    isConnected() {
        return this.client && this.client.connected;
    }

    /**
     * Notify observers of a received message.
     * @param {string} topic - The topic of the message.
     * @param {Buffer} message - The message received.
     */
    notifyObservers(topic, message) {
        const jsonMessage = JSON.parse(message.toString());
        const validate = this.ajv.compile(pongSchema[topic]);
        if (validate(jsonMessage)) {
            this.observers[topic].forEach(callback => callback(jsonMessage));
        } else {
            console.log(`Validation error for topic ${topic}:`, validate.errors);
        }
    }

    /**
     * Register an observer for a specific topic.
     * @param {string} topic - The topic to observe.
     * @param {function} callback - The callback function to call when a message is received.
     */
    registerObserver(topic, callback) {
        if (PongAPI.topics.includes(topic)) {
            this.observers[topic].push(callback);
        } else {
            console.log(`Invalid topic: ${topic}`);
        }
    }

    /**
     * Update the game/play topic.
     * @param {object} message - The message to publish.
     */
    updateGamePlay(message) {
        this.publishMessage('game/play', message);
    }

    /**
     * Update the game/stats topic.
     * @param {object} message - The message to publish.
     */
    updateGameStats(message) {
        this.publishMessage('game/stats', message);
    }

    /**
     * Update the game/state topic.
     * @param {object} message - The message to publish.
     */
    updateGameState(message) {
        this.publishMessage('game/state', message);
    }

    /**
     * Update the paddle/top topic.
     * @param {object} message - The message to publish.
     */
    updatePaddleTop(message) {
        this.publishMessage('paddle/top', message);
    }

    /**
     * Update the paddle/bottom topic.
     * @param {object} message - The message to publish.
     */
    updatePaddleBottom(message) {
        this.publishMessage('paddle/bottom', message);
    }

    /**
     * Publish a message to a specific topic.
     * @param {string} topic - The topic to publish to.
     * @param {object} message - The message to publish.
     */
    publishMessage(topic, message) {
        const validate = this.ajv.compile(pongSchema[topic]);
        if (validate(message)) {
            this.client.publish(topic, JSON.stringify(message));
        } else {
            console.log(`Validation error for topic ${topic}:`, validate.errors);
        }
    }
}