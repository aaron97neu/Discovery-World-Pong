/**
 * @file MQTTClient.js
 * @description Implements an MQTT client using 'mqtt.js'.
 */
import mqtt from 'mqtt';
// const mqtt = require('mqtt');

// class MQTTClient {
export default class MQTTClient {
    constructor(broker_url, client_id, baseState) {
        this.broker_url = broker_url;
        this.client_id = client_id;
        this.baseState = baseState;
        this.connected = false;
        this.subscribeMap = {
            'game/state': 'game_state',
            'game/state_transition': 'game_state_transition',
            'game/countdown': 'game_countdown',
            'game/bottom_paddle_position': 'game_bottom_paddle_position',
            'game/top_paddle_position': 'game_top_paddle_position',
            'game/ball_position': 'game_ball_position',            
        };
        this.publishMap = {
            'game_state': 'game/state',
            'game_state_transition': 'game/state_transition',
            'game_countdown': 'game/countdown',
            'game_bottom_paddle_position': 'game/bottom_paddle_position',
            'game_top_paddle_position': 'game/top_paddle_position',
            'game_ball_position': 'game/ball_position',
        };
    }

    /**
     * Connects to the MQTT broker.
     */
    start() {
        console.log("MQTTClient broker_url: %s", this.broker_url)
        // this.client = mqtt.connect('ws://localhost:9001', {
        this.client = mqtt.connect(this.broker_url, {
            clientId: this.client_id,
            // keepalive: 60
        });

        this.client.on('connect', this.onConnect.bind(this));
        this.client.on('disconnect', this.onDisconnect.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.baseState.addObserver(this, this.onStateChange.bind(this));        
    }

    stop() {
        this.client.end();
    }
    
    /**
     * Handles MQTT connect event.
     */
    onConnect() {
        console.log("MQTT onConnect")
        this.connected = true;
        for (let topic in this.subscribeMap) {
            this.client.subscribe(topic);
        }
    }

    /**
     * Handles MQTT disconnect event.
     */
    onDisconnect() {
        console.log("MQTT onDisconnect")
        this.connected = false;
    }

    /**
     * Handles MQTT message event.
     * @param {string} topic - The topic of the message.
     * @param {Buffer} message - The message payload.
     */
    onMessage(topic, message) {
        const stateKey = this.subscribeMap[topic];
        if (stateKey) {
            this.baseState.setState(stateKey, message.toString(), this);
        }
    }

    /**
     * Handles state changes from BaseState.
     * @param {Object} changedState - The changed state values.
     */
    onStateChange(changedState) {
        console.log("MQTT onStateChange")
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