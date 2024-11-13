# import keyboard
# from pynput import keyboard
import readchar

class KeyboardController:
    def __init__(self, mqtt_client, max, min, increment, starting_position):
        self.mqtt_client = mqtt_client
        self.max = max
        self.min = min
        self.increment = increment
        self.position = starting_position

    def move(self, direction):
        # print('move:', direction)
        if not self.mqtt_client.is_connected():
            print('MQTT client is not connected')
            return

        new_position = self.position
        if direction == 'L':
            new_position = max(self.min, self.position - self.increment)
        elif direction == 'R':
            new_position = min(self.max, self.position + self.increment)
        
        self.position = new_position
        # print(f'Position: {self.position}')
        self.mqtt_client.publish('motion/position', f'{self.position:.2f}')

    def start_listening(self):
        print("Starting keylogger. Press 'a' to move left, 'd' to move right, 'q' to quit.")
        while True:
            key = readchar.readkey()
            if key == 'a':
                self.move('L')
            elif key == 'd':
                self.move('R')
            elif key == 'q':
                print("Exiting application.")
                break
