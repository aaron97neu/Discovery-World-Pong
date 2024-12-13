import logging
import json
import paho.mqtt.client as mqtt
from jsonschema import validate, ValidationError
from .pong_api_schema import pong_api_schema

class PongAPI:
    topics = ['game/play', 'game/stats', 'game/state', 'paddle/top', 'paddle/bottom']

    def __init__(self, client_id, broker='mqtt-broker', port=1883):
        self.client_id = client_id
        self.broker = broker
        self.port = port
        self.client = mqtt.Client(client_id)
        self.connected = False
        self.observers = {topic: [] for topic in self.topics}

    def start(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        logging.info(f'broker: {self.broker}')
        logging.info(f'port: {self.port}')
        self.client.connect(self.broker, self.port, 60)
        self.client.loop_start()

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
        self.connected = False

    def is_connected(self):
        logging.info(f'PongAPI is_connected: {self.connected}')
        return self.connected

    def on_connect(self, client, userdata, flags, rc):
        logging.info("PongAPI on_connect")
        self.connected = True
        for topic in self.topics:
            self.client.subscribe(topic)

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = json.loads(msg.payload.decode())
        if self.validate_message(topic, payload):
            for callback in self.observers[topic]:
                callback(payload)

    def validate_message(self, topic, message):
        try:
            validate(instance=message, schema=pong_api_schema[topic])
            return True
        except ValidationError as e:
            print(f"Validation error for topic {topic}: {e.message}")
            return False

    def register_observer(self, topic, callback):
        if topic in self.topics:
            self.observers[topic].append(callback)

    def update_game_play(self, message):
        self.publish_message('game/play', message)

    def update_game_stats(self, message):
        self.publish_message('game/stats', message)

    def update_game_state(self, message):
        self.publish_message('game/state', message)

    def update_paddle_top(self, message):
        self.publish_message('paddle/top', message)

    def update_paddle_bottom(self, message):
        self.publish_message('paddle/bottom', message)

    def publish_message(self, topic, message):
        if self.validate_message(topic, message):
            self.client.publish(topic, json.dumps(message))