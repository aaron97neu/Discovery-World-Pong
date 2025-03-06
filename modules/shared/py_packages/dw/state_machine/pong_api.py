import paho.mqtt.client as mqtt
import json
from jsonschema import validate, ValidationError, SchemaError
from enum import Enum
import logging
# from .pong_api_schema import pong_api_schema

logging.basicConfig(level=logging.INFO)

class Topics(Enum):
    GAME_PLAY = 'game/play'
    GAME_STATS = 'game/stats'
    GAME_STATE = 'game/state'
    PADDLE_TOP = 'paddle/top'
    PADDLE_BOTTOM = 'paddle/bottom'
    PADDLE_TOP_POSITION = 'paddle/top/position'
    PADDLE_TOP_STATE = 'paddle/top/state'
    PADDLE_TOP_STATE_TRANSITION = 'paddle/top/state_transition'
    PADDLE_BOTTOM_POSITION = 'paddle/bottom/position'
    PADDLE_BOTTOM_STATE = 'paddle/bottom/state'
    PADDLE_BOTTOM_STATE_TRANSITION = 'paddle/bottom/state_transition'
    DEPTH_FEED = 'depth/feed'

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

        # Load JSON schema from file
        with open('./PongAPISchema.json', 'r') as file:
            self.schema = json.load(file)

    def on_connect(self, client, userdata, flags, rc):
        logging.info(f"Connected with result code {rc}")
        self.connected = True
        for topic, observers in self.observers.items():
            if observers:
                logging.info(f"Subscribed to topic: {topic.value}")
                self.client.subscribe(topic.value)

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        # logging.info("Recieve - topic: %s, message: %s", topic, msg.payload)
        try:
            payload = json.loads(msg.payload)
            if self.validate_message(topic, payload):
                for callback in self.observers[Topics(topic)]:
                    callback(payload)
        except TypeError as e:
            print(f"Error: {e}")
        except json.JSONDecodeError as e:
            print(f"JSONDecodeError: {e}")

    def validate_message(self, topic, message):
        # logging.info("validate_message - topic: %s, message: %s", topic, message)
        # schema = pong_api_schema.get(topic)
        schema = self.schema.get(topic)
        # logging.info(f"validate_message - schema: {schema}")
        try:
            validate(instance=message, schema=schema)
            return True
        except SchemaError as e:
            logging.error(f"Schema Error for topic {topic}: {e.message}")
            return False
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
        # logging.error(f"Register observer for topic {topic.value}")
        if topic in Topics:
            self.observers[topic].append(callback)
            if self.connected:
                logging.error(f"Subscribed to topic {topic.value}")
                self.client.subscribe(topic.value)

    def update(self, topic, message):
        # logging.info("Update - topic: %s, message: %s", topic.value, message)
        if self.validate_message(topic.value, message):
            try:
                payload = json.dumps(message)
                # logging.info("Update - topic: %s, payload: %s", topic.value, payload)
                self.client.publish(topic.value, payload)
            except TypeError as e:
                logging.error(f"Payload Error: {e.message}")
            except json.JSONDecodeError as e:
                logging.error(f"Payload JSONDecodeError: {e.message}")
                