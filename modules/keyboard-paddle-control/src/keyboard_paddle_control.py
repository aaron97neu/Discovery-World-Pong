import os
from mqtt_client import MQTTClient
from keyboard_controller import KeyboardController

class KeyboardPaddlerControl:
    def __init__(self, mqtt_broker, mqtt_port, mqtt_client_id, max, min, increment, starting_position):
        self.mqtt_client = MQTTClient(mqtt_broker, mqtt_port, mqtt_client_id)
        self.keyboard_controller = KeyboardController(self.mqtt_client, max, min, increment, starting_position)

    def run(self):
        self.mqtt_client.connect()
        try:
            self.keyboard_controller.start_listening()
        except KeyboardInterrupt:
            print("Keyboard paddle stopped.")
        finally:
            self.mqtt_client.disconnect()

if __name__ == "__main__":
    MQTT_BROKER = os.getenv('MQTT_BROKER', 'localhost')
    MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
    MQTT_CLIENT_ID = os.getenv('MQTT_CLIENT_ID', 'keyboard-paddle-control')
    MAX = float(os.getenv('MAX', '0.9'))
    MIN = float(os.getenv('MIN', '0.1'))
    INCREMENT = float(os.getenv('INCREMENT', '0.01'))
    STARTING_POSITION = 0.5
    
    app = KeyboardPaddlerControl(MQTT_BROKER, MQTT_PORT, MQTT_CLIENT_ID, MAX, MIN, INCREMENT, STARTING_POSITION)
    app.run()
