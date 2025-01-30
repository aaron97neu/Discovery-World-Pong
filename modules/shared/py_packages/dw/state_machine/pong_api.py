import paho.mqtt.client as mqtt
import json
from jsonschema import validate, ValidationError
from enum import Enum
import logging
from .pong_api_schema import pong_api_schema

logging.basicConfig(level=logging.INFO)

class Topics(Enum):
    GAME_PLAY = 'game/play'
    GAME_STATS = 'game/stats'
    GAME_STATE = 'game/state'
    PADDLE_TOP = 'paddle/top'
    PADDLE_BOTTOM = 'paddle/bottom'

class PongAPI:
    def __init__(self, client_id, broker='mqtt-broker', port=1883):
        self.client_id = client_id
        self.broker = broker
        self.port = port
        self.client = mqtt.Client(client_id)
        self.observers = {topic: [] for topic in Topics}
        self.connected = False

        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        logging.info(f"Connected with result code {rc}")
        self.connected = True
        for topic in self.observers:
            self.client.subscribe(topic.value)

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        logging.info("Recieve - topic: %s, message: %s", topic, msg.payload)
        payload = json.loads(msg.payload)
        if self.validate_message(topic, payload):
            for callback in self.observers[Topics(topic)]:
                callback(payload)

    def validate_message(self, topic, message):
        schema = pong_api_schema.get(topic)
        try:
            validate(instance=message, schema=schema)
            return True
        except ValidationError as e:
            logging.error(f"Validation error for topic {topic}: {e.message}")
            return False

    def start(self):
        self.client.connect(self.broker, self.port, 60)
        self.client.loop_start()

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
        self.connected = False

    def is_connected(self):
        return self.connected

    def register_observer(self, topic, callback):
        if topic in Topics:
            self.observers[topic].append(callback)
            if self.connected:
                self.client.subscribe(topic.value)

    def update(self, topic, message):
        if self.validate_message(topic, message):
            payload = json.dumps(message)
            logging.info("Send - topic: %s, message: %s", topic, payload)
            self.client.publish(topic, payload)