import mqtt from 'mqtt';

class MQTTClient {
  constructor() {
    this.client = null;
    this.onConnectCallback = null;
  }

  connect(onConnectCallback) {
    const broker = process.env.REACT_APP_MQTT_BROKER;
    const port = process.env.REACT_APP_MQTT_PORT;
    const clientId = process.env.REACT_APP_MQTT_CLIENT_ID;

    this.client = mqtt.connect(`ws://${broker}:${port}`, { clientId });
    this.onConnectCallback = onConnectCallback;

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      if (this.onConnectCallback) {
        this.onConnectCallback();
      }
    });

    this.client.on('disconnect', () => {
      console.log('Disconnected from MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('Connection error: ', err);
      this.client.end();
    });

    this.client.on('reconnect', () => {
      console.log('Reconnecting...');
    });
  }

  isConnected() {
    return this.client && this.client.connected;
  }

  publish(topic, message) {
    if (this.isConnected()) {
      this.client.publish(topic, message);
    }
  }
}

export default MQTTClient;
