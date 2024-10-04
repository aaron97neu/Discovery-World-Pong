/**
 * @file MQTTClient.js
 * @description Implements an MQTT client using 'mqtt.js'.
 */
import mqtt from 'mqtt';
// const mqtt = require('mqtt');

// class MQTTClient {
export default class MQTTClient {
    constructor(client_id, baseState) {
        this.client_id = client_id;
        this.baseState = baseState;
        this.connected = false;
        this.subscribeMap = {
            'game/state': 'game_state',
            'game/state_transition': 'game_state_transition'
        };
        this.publishMap = {
            'game_state': 'game/state',
            'game_state_transition': 'game/state_transition'
        };
    }

    /**
     * Connects to the MQTT broker.
     */
    start() {
        this.client = mqtt.connect('ws://localhost:9001', {
            clientId: this.client_id,
            keepalive: 60
        });

        this.client.on('connect', this.onConnect.bind(this));
        this.client.on('disconnect', this.onDisconnect.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        // this.baseState.addObserver(this, this.onStateChange.bind(this));        
    }

    /**
     * Handles MQTT connect event.
     */
    onConnect() {
        this.connected = true;
        for (let topic in this.subscribeMap) {
            this.client.subscribe(topic);
        }
    }

    /**
     * Handles MQTT disconnect event.
     */
    onDisconnect() {
        this.connected = false;
    }

    /**
     * Handles MQTT message event.
     * @param {string} topic - The topic of the message.
     * @param {Buffer} message - The message payload.
     */
    onMessage(topic, message) {
        console.log("MQTTClient onMessage D1: %s, %s", topic, message)
        const stateKey = this.subscribeMap[topic];
        console.log("MQTTClient onMessage D2: %s", stateKey)
        if (stateKey) {
            console.log("MQTTClient onMessage D3")
            this.baseState.setState(stateKey, message.toString(), this);
        }
    }

    /**
     * Handles state changes from BaseState.
     * @param {Object} changedState - The changed state values.
     */
    onStateChange(changedState) {
        for (let key in changedState) {
            const topic = this.publishMap[key];
            if (topic) {
                this.client.publish(topic, changedState[key]);
            }
        }
    }
}

// module.exports = MQTTClient;
// export default MQTTClient;