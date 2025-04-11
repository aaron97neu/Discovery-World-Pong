import mqtt from 'mqtt';
import Ajv from 'ajv';
import pongAPISchema from './PongAPISchema.json';
import { v4 as uuidv4 } from 'uuid';

const PongAPI = (clientId, brokerUrl, connectCallback, disconnectCallback) => {
  const instanceId = uuidv4();
  let client = null;
  let connected = false;
  const observers = {};
  const ajv = new Ajv();
  const validate = ajv.compile(pongAPISchema);

  const getInstanceId = () => instanceId;

  const start = () => {
    client = mqtt.connect(brokerUrl, { clientId });
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      console.log(`PongAPI instanceId: ${instanceId}`);
      Object.keys(observers).forEach(topic => {
        client.subscribe(topic);
      });
      connected = true;

      if (connectCallback && typeof connectCallback === 'function') {
        connectCallback();
      }
    });

    client.on('disconnect', () => {
      console.log('Disconnected from MQTT broker');
      connected = false;

      if (disconnectCallback && typeof disconnectCallback === 'function') {
        disconnectCallback();
      }
    });

    client.on('error', (err) => {
      console.log('MQTT Broker Connection error:', err);
    });

    client.on('message', (topic, message) => {
      const parsedMessage = JSON.parse(message.toString());
      if (validateMessage(topic, parsedMessage)) {
        notifyObservers(topic, parsedMessage);
      }
    });
  };

  const stop = () => {
    if (client) {
      client.end();
      client = null;
      console.log('Disconnected from broker');
    }
  };

  const isConnected = () => connected;

  const registerObserver = (topic, callback) => {
    if (!observers[topic]) {
      observers[topic] = [];
      if (isConnected()) {
        client.subscribe(topic);
      }
    }
    observers[topic].push(callback);
  };

  const notifyObservers = (topic, message) => {
    if (observers[topic]) {
      observers[topic].forEach(callback => callback(message));
    }
  };

  const validateMessage = (topic, message) => {
    const valid = validate({ topic: message });
    if (!valid) {
      console.error('Invalid message:', validate.errors);
    }
    return valid;
  };

  const update = (topic, message) => {
    if (isConnected()) {
      if (validateMessage(topic, message)) {
        const payload = JSON.stringify(message);
        client.publish(topic, payload);
      }
    }
  };

  return {
    getInstanceId,
    start,
    stop,
    isConnected,
    registerObserver,
    update,
  };
};

PongAPI.Topics = {
  GAME_PLAY: 'game/play',
  GAME_STATS: 'game/stats',
  GAME_STATE: 'game/state',
  PADDLE_TOP_POSITION: 'paddle/top/position',
  PADDLE_TOP_STATE: 'paddle/top/state',
  PADDLE_TOP_STATE_TRANSITION: 'paddle/top/state_transition',
  PADDLE_BOTTOM_POSITION: 'paddle/bottom/position',
  PADDLE_BOTTOM_STATE: 'paddle/bottom/state',
  PADDLE_BOTTOM_STATE_TRANSITION: 'paddle/bottom/state_transition',
  DEPTH_FEED: 'depth/feed',
};

export default PongAPI;
