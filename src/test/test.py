import sys
import logging
import json
import threading
import time
import paho.mqtt.client as mqtt
import paho.mqtt.subscribe as subscribe
import paho.mqtt.publish as publish
import os

#containers built settings
#hostname = "mqtt-broker"
#import shared.config as Config

#command prompt settings
hostname = os.environ.get ('MQTTBROKER',"localhost")
import shared.code.config as Config



logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('paho.mqtt.client')
logger.setLevel(logging.ERROR)

mqtt_data = {"quit":0, "connect_status":"not connected"}


def test_moveBottomPaddleLeft(mqtt_client):
    logging.info("in move Bottom Paddle left")
    
    #line 170 of main in game_driver waits for subscriber.motion_presence
    mqtt_client.publish("motion/presence", "true")
    
    #game_state(0 - wait for human presence, 1 - ready, 2 - running, 3 - game over )
    #mqtt_client.publish("game/state", payload=json.dumps({"state": state}))

    #reset player scores
    #mqtt_client.publish("player1/score", payload=json.dumps({"score": 0}))
    #mqtt_client.publish("player2/score", payload=json.dumps({"score": 0}))

    #self.bottom_agent.act = MotionPlayer(subscriber) see player.py
    #action_l, motion_l, prob_l = self.bottom_agent.act() #action_1 will be 3 when bottom_agent is MotionPlayer
                #return (3 absolute), 0.5, 1
    #    if topic == "paddle2/action": self.paddle2_action = int(payload["action"])
    #mqtt_client.publish ("paddle1/position", payload=json.dumps({"position": 90}))
    #publish topic motion/position a value between 0.0 to 1.0, paddle1/position changes from 1 to 192
    #paddle1 position is calculated in Pong(config = config, level = level) step method see pong.py
    #       Config.ACTIONS = ["LEFT", "RIGHT", "NONE", "ABSOLUTE"]
    #       Config.ACTIONS[action_l = 3] is "ABSOLUTE"
    #       self.bottom.handle_action(bottom_action, motion_position)
    #         Paddle
    #           def MotionMove(self, motion_position):
    #               #print(f'depthMove with value = {depth}')
    #               desiredPos = motion_position * self.config.WIDTH #((depth-500)/2000) * Pong.HEIGHT
    #               distance = desiredPos - self.x
    #               vel = (self.speed * (distance/self.config.WIDTH) * 25)
    #               s  elf.velocity[0] += vel
    #           def update(self):
    #                """
    #                Run game tick housekeeping logic
    #                """
    #                # First blindly increment position by velocity
    #                next_x = self.x + self.velocity[0]
    #                next_y = self.y + self.velocity[1]  # Y should never actually change, but it feels right to include it
    #                self.velocity = [0, 0]  # We don't actually want velocity to persist from tick to tick, so deplete it all
    #                # Then back up position if we cross the screen border
    #                max = self.config.WIDTH - Pong.Paddle.EDGE_BUFFER
    #                if not math.ceil(next_x - self.w / 2) > max and not math.ceil(next_x + self.w / 2) < Pong.Paddle.EDGE_BUFFER:
    #                self.x = next_x
    # move human/bottom/paddle2 to the left edge
    #mqtt_client.publish("motion/position", "0.0")
    
    #subscribe.callback(on_motion_presence_message, "motion/presence", hostname="localhost", userdata={"message_count": 0})
    #thread = threading.Thread(target=subscribe.callback, args=("motion/position", hostname="localhost", userdata={"message_count": 0}))
    #thread.start()     
    #subscribe.callback(on_motion_position_message, "motion/position", hostname="localhost", userdata={"message_count": 0})
    
    #logging.info("finished subscribing")
    #publish.single("motion/presence", "true", hostname="localhost", port=1883, client_id="integrationTest", protocol=mqtt.MQTTv5)
    #publish.single("motion/presence", "true", hostname="localhost", port=1883, client_id="integrationTest", ,protocol=mqtt.MQTTv5)
    #thread.join()
    #logging.info("just published")  
    
    # try: 
    #     msg=subscribe.simple("motion/position",hostname="mqtt-broker",port=1883,client_id="integrationTest1",protocol=mqtt.MQTTv5)
    #     #msg=subscribe.simple("motion/position",hostname="localhost",port=1883,client_id="integrationTest1",protocol=mqtt.MQTTv5)
    # except Exception as e:
    #     logging.info("subscribe e %s", e)
    # logging.info ("receive msg topic:", msg.topic, "payload:",  msg.payload)
        
    #msg = subscribe.simple("motion/position", hostname="mqtt-broker", port=1883, client_id="integrationTest")
    
    #logging.info("just subscribed")
    #logging.info("msg topic: %s msg payload: %s", msg.topic, msg.payload)
    #logging.info(msg.topic, msg.payload)  

 
 
#def simple(topics, qos=0, msg_count=1, retained=True, hostname="localhost",
#           port=1883, client_id="", keepalive=60, will=None, auth=None,
#           tls=None, protocol=paho.MQTTv311, transport="tcp",
#           clean_session=True, proxy_args=None):
 
# def on_motion_presence_message(client, userdata, message):
#     payloadContent = json.loads(message.payload)
#     logging.info("message topic: ", message.topic, " message payload: ", message.payload, " content: ", payloadContent)
#     client.disconnect()
#     # userdata["message_count"] += 1
#     # if userdata["message_count"] >= 5:
#     #     #it's possible to stop the program by disconnecting
#     #     client.disconnect()

# def on_motion_position_message(client, userdata, message):
#     logging.info("message topic: ", message.topic, " message payload: ", message.payload)
#     payloadContent = json.loads(message.payload)
#     logging.info("message topic: ", message.topic, " message payload: ", message.payload, " content: ", payloadContent)
#     if (payloadContent == 0.0):
#         client.disconnect()
#     # userdata["message_count"] += 1
#     # if userdata["message_count"] >= 5:
#     #     #it's possible to stop the program by disconnecting
#     #     client.disconnect()

def test_game_engine(mqtt_client, mqtt_data):
    logging.info("in test game engine")
    logging.info (mqtt_data)
    
    ##############  Start the game-engine loop  #################################
    #line 170 of main in game_driver waits for subscriber.motion_presence
    logging.info("publish motion/presence true")  
    mqtt_client.publish("motion/presence", "true")
    
    while (not ("game/state" in mqtt_data.keys())): #wait for mqtt broker update
        time.sleep (0.5)
    temp = mqtt_data["game/state"]
    logging.info(f"game/state: {temp}")    
    #game_state(0 - wait for human presence, 1 - ready, 2 - running, 3 - game over )
    #mqtt_client.publish("game/state", payload=json.dumps({"state": state}))
    assert (mqtt_data["game/state"] != 0)

    ########### Setting paddle1 which is controlled by human (bottom player)  from Depth camera input ########
    #self.bottom_agent.act = MotionPlayer(subscriber) see player.py
    #action_l, motion_l, prob_l = self.bottom_agent.act() #action_1 will be 3 when bottom_agent is MotionPlayer
                #return (3 absolute), 0.5, 1
    #    if topic == "paddle1/action": self.paddle1_action = int(payload["action"])
    #mqtt_client.publish ("paddle1/position", payload=json.dumps({"position": 90}))
    #publish topic motion/position a value between 0.0 to 1.0, paddle1/position changes from 1 to 192
    #paddle1 position is calculated in Pong(config = config, level = level) step method see pong.py
    #       Config.ACTIONS = ["LEFT", "RIGHT", "NONE", "ABSOLUTE"]
    #       Config.ACTIONS[action_l = 3] is "ABSOLUTE"
    #       self.bottom.handle_action(bottom_action, motion_position)
    #         Paddle
    #           def MotionMove(self, motion_position):
    #               #print(f'depthMove with value = {depth}')
    #               desiredPos = motion_position * self.config.WIDTH #((depth-500)/2000) * Pong.HEIGHT
    #               distance = desiredPos - self.x
    #               vel = (self.speed * (distance/self.config.WIDTH) * 25)
    #               s  elf.velocity[0] += vel
    #           def update(self):
    #                """
    #                Run game tick housekeeping logic
    #                """
    #                # First blindly increment position by velocity
    #                next_x = self.x + self.velocity[0]
    #                next_y = self.y + self.velocity[1]  # Y should never actually change, but it feels right to include it
    #                self.velocity = [0, 0]  # We don't actually want velocity to persist from tick to tick, so deplete it all
    #                # Then back up position if we cross the screen border
    #                max = self.config.WIDTH - Pong.Paddle.EDGE_BUFFER
    #                if not math.ceil(next_x - self.w / 2) > max and not math.ceil(next_x + self.w / 2) < Pong.Paddle.EDGE_BUFFER:
    #                self.x = next_x
    #move paddle position to the left edge
    logging.info("publish motion/position 0.0")
    mqtt_client.publish("motion/position", "0.0")           # motion/position value ranges from 0.0 to 1.0 which will change the paddle1/position
    while (not ("paddle1/position" in mqtt_data.keys())):   #wait for mqtt broker update
        time.sleep (0.5)
    temp = mqtt_data["paddle1/position"]
    logging.info(f"paddle1/position: {temp}")

    #move paddle position to the right edge
    logging.info("publish motion/position 1.0")
    mqtt_client.publish("motion/position", "1.0")  
    temp = mqtt_data["paddle1/position"]
    logging.info(f"paddle1/position: {temp}")

    ################################## Setting score #############################################
    #reset player scores
    mqtt_client.publish("player1/score", payload=json.dumps({"score": 0}))     #player1 is the bottom player 
    mqtt_client.publish("player2/score", payload=json.dumps({"score": 0}))     #player2 is the top player  
    # 
    #       in GameDriver run  
    #                   :              
    #            state, reward, done = pong_environment.step(self.config.ACTIONS[action_l], self.config.ACTIONS[action_r], frames=1, motion_position=motion_l)
    #            reward_l, reward_r = reward
    #            if reward_r < 0: score_l -= reward_r
    #            if reward_r > 0: score_r += reward_r  
    #                   :

    ################################## Resetting game ############################################
    #forcing the game to restart by setting the player1 score to 3 -
    # player1/score gets the score from Pong score_bottom which is passed to score_left of GameSubscriber -- this is the human score
    # paddle1/position is controlling the bottom paddle
    # class GameDriver
    #     def run (self, level, pong_environment):
    #            if i == self.config.AI_FRAME_INTERVAL - 1:
    #                self.subscriber.emit_state(pong_environment.get_packet_info(), request_action=True)
    #            else:
    #               self.subscriber.emit_state(pong_environment.get_packet_info(), request_action=False)
    # class Pong
    #     def get_packet_info(self):
    #         """
    #         Return all info necessary for regular update messages
    #         :return: Tuple representing ((puck_x, puck_y), paddle1_y, paddle2_y, paddle1_score, paddle2_score, game_frame))
    #         """
    #         return (self.ball.x, self.ball.y), self.bottom.x, self.top.x, self.score_bottom, self.score_top,  self.frames
    # class GameSubscriber:
    #     """
    #     This emits game state when in the run loop
    #     """
    #     def emit_state(self, state, request_action=False):
    #         (puck_x, puck_y), bottom_x, top_x, score_left, score_right, frame = state
    #         self.client.publish("puck/position", payload=json.dumps({"x": puck_x, "y": puck_y}))
    #         self.client.publish("paddle1/position", payload=json.dumps({"position": bottom_x}))
    #         self.client.publish("paddle2/position", payload=json.dumps({"position": top_x}))
    #         self.client.publish("player1/score", payload=json.dumps({"score": score_left}))
    #         self.client.publish("player2/score", payload=json.dumps({"score": score_right}))
      
    logging.info("force game to end by setting motion/presence = false game/level = 3, player2/score = 3")
    
    # set the motion/presence to false, will force the game to wait when the level is higher than 3
    mqtt_client.publish("motion/presence", "false")
    
    # game level is incremented in the main loop and published for the gameboard to display,
    # publishing the game/level does not change the game level in the game driver
    # if level < 3: # if the game hasn't started yet and the next level would be level 1
    #     print("proceed to next level")
    #     level = level + 1
    mqtt_client.publish("game/level", payload=json.dumps({"level": 3}))
    
    # since the score is controlled inside pong.py, it cannot be changed when the game is playing
    # player1/score is published for displayed, it does not change the game behavior
    mqtt_client.publish("player1/score", payload=json.dumps({"score": 3}))
    
 
#def simple(topics, qos=0, msg_count=1, retained=True, hostname="localhost",
#           port=1883, client_id="", keepalive=60, will=None, auth=None,
#           tls=None, protocol=paho.MQTTv311, transport="tcp",
#           clean_session=True, proxy_args=None):
 
# def on_motion_presence_message(client, userdata, message):
#     payloadContent = json.loads(message.payload)
#     logging.info("message topic: ", message.topic, " message payload: ", message.payload, " content: ", payloadContent)
#     client.disconnect()
#     # userdata["message_count"] += 1
#     # if userdata["message_count"] >= 5:
#     #     #it's possible to stop the program by disconnecting
#     #     client.disconnect()

# def on_motion_position_message(client, userdata, message):
#     logging.info("message topic: ", message.topic, " message payload: ", message.payload)
#     payloadContent = json.loads(message.payload)
#     logging.info("message topic: ", message.topic, " message payload: ", message.payload, " content: ", payloadContent)
#     if (payloadContent == 0.0):
#         client.disconnect()
#     # userdata["message_count"] += 1
#     # if userdata["message_count"] >= 5:
#     #     #it's possible to stop the program by disconnecting
#     #     client.disconnect()


def on_connect(client, userdata, flags, rc, propertiess=None):
    logging.info("Connected with result code " + str(rc))
    if (str(rc) == "Success"):
        userdata["connect_status"] = "connected"
    if 
    client.subscribe("test/topic")
    client.subscribe("quit")
    client.subscribe("motion/position")
    client.subscribe("motion/presence")
    client.subscribe("game/state")
    client.subscribe("paddle1/position")
    
def on_message(client, userdata, msg):
    logging.info(msg.topic + " " + str(msg.payload))
    payloadContent = json.loads(msg.payload)
    userdata[msg.topic] = payloadContent
    
    
def setup_mqtt_client(data):
    # Create an MQTT client instance
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="integration_test", userdata=data)
    logging.info("successfully create client")

    #request for connection
    client.connect_async(hostname, port=1883, keepalive=60)
    logging.info("successfully connect")

    # Assign the callback functions
    client.on_connect = on_connect
    client.on_message = on_message
    #client.on_connect = lambda client, data, flags, rc : on_connect(client, data, flags, rc)
    #client.on_message = lambda client, userdata, msg : on_message(client, userdata, msg) 
   
    # Start the loop
    client.loop_start()
    
    #wait for connection before returning
    while (mqtt_data["connect_status"] == "not connected"):
        time.sleep(2.0)

    return client

def main():
    #logging.info("YEP2")
    global mqtt_data
    #logging.info("YEP3")
    logging.info("integration test main routine")
    
    #create mqtt client
    mqtt_client = setup_mqtt_client(mqtt_data)
    #logging.info("YEP4")
    
    logging.info("successfully setup mqtt")
    
    #test code go in here
      
    test_game_engine(mqtt_client, mqtt_data)
    
    #end of test

    while (mqtt_data["quit"] == 0):
        # mqtt_client.publish ("motion/position", 0.31)
        # mqtt_client.publish ("motion/presence", "false")
        # logging.info(mqtt_data)
        time.sleep(2.0)

    mqtt_client.disconnect()
    logging.info("exit main")
        

if __name__ == "__main__":
    #logging.info("YEP")
    main()    
