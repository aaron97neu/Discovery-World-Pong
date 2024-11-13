import paho.mqtt.client as mqtt

class MQTTClient:
    def __init__(self, mqtt_broker, mqtt_port, mqtt_client_id):
        self.mqtt_broker = mqtt_broker
        self.mqtt_port = mqtt_port
        self.mqtt_client_id = mqtt_client_id
        self.connected = False
        self.client = mqtt.Client(self.mqtt_client_id)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect
        # self.client.on_publish = self.on_publish

    def on_connect(self, client, userdata, flags, rc):
        # print(f"Connected with result code {rc}")
        self.connected = True

    # def on_publish(self, client, userdata, mid):
    #     print(f"Message {mid} published.")

    def on_disconnect(self, client, userdata, rc):
        # print(f"Disconnected with result code {rc}")
        self.connected = False

    def connect(self):
        self.client.connect(self.mqtt_broker, self.mqtt_port, 60)
        self.client.loop_start()

    def publish(self, topic, message):
        if self.is_connected():
            self.client.publish(topic, message)
        else:
            print("MQTT client is not connected.")

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()

    def is_connected(self):
        return self.connected
