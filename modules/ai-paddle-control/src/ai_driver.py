import sys
import time
import logging
from model import PGAgent
# from model import PGAgent
# from shared.config import Config
from ai_subscriber import AISubscriber
import numpy as np
import cv2
# import threading
# from shared.config import Config
# from shared.utils import Timer
from dw.state_machine import Topics
from dw import Config
# from dw.utils import utils

# from queue import Queue

logging.basicConfig(level=logging.INFO)

class AIDriver:
    # #MODEL = 'validation/canstop_randomstart_6850.h5'#'../../validation/newhit_10k.h5'
    # MODEL_1 = f'./validation/canstop_randomstart_3k.h5'
    # MODEL_2 = f'./validation/canstop_randomstart_6850.h5'
    # MODEL_3 = f'./validation/canstop_randomstart_10k.h5'

    # The locations of the three models used. 1 for each level.
    MODEL_1 = "./validation/smoothreward_s6_f5_d3_5000.h5"
    MODEL_2 = "./validation/smoothreward_s6_f5_d3_15000.h5"
    MODEL_3 = "./validation/smoothreward_s6_f5_d3_22850.h5"
    level = 1
    def publish_inference(self):
        #Timer.start('inf')
        # Check if the level has changed. If so, we need to load a new model
        if (AIDriver.level != self.state.game_level):
            # # check if a kill/quit message has been sent via the queue
            # if not self.q.empty():
            #     dataQ = self.q.get()
            #     if dataQ == "endThreads":
            #         print('ai thread quitting')
            #         while not self.q.empty: # empty the rest of the q
            #             dataQ = self.q.get()
            #         self.q.put('noneActive') 
            #         # a message that goes back to the main program to tell it that the ai_driver has stopped
            #         sys.exit()
            #         print('the sys exit didnt work')

            temp = AIDriver.level
            AIDriver.level = self.state.game_level
            # print(f'level changed to {AIDriver.level}')
            if self.state.game_level == 0:
                self.agent = self.agent1
                #self.agent1.load(AIDriver.MODEL_1)
            elif self.state.game_level == 1 and temp != 0:
                self.agent = self.agent1
                #self.agent1.load(AIDriver.MODEL_1)
            elif self.state.game_level == 2:
                self.agent = self.agent2
                #self.agent1.load(AIDriver.MODEL_2)
            elif self.state.game_level == 3:
                self.agent = self.agent3
                #self.agent1.load(AIDriver.MODEL_3)
            else:
                self.agent = self.agent1
                #self.agent1.load(AIDriver.MODEL_2)
   
        # Get latest state diff
        diff_state = self.state.render_latest_diff()   
        
        # np.savetxt(f"files/diff{self.state.step}.txt", diff_state, fmt='%d')

        # with open("diff.txt", "a") as file:
        #     file.write(f"{diff_state}\n\n")

        # grayscale_image = utils.convert_to_grayscale_image(diff_state)

        # # Save or display the image using OpenCV
        # cv2.imwrite(f"screens/diff_frame{self.state.step}.png", grayscale_image)

        # current_frame_id = self.state.frame    

        # Compute the number of frames that have passed since the last frame
        #frame_diff = self.state.frame - self.last_acted_frame
        #self.last_acted_frame = self.state.frame
        #if frame_diff >= 0:
        #    # Throw away negative diffs because we're in a new round
        #    self.frame_diffs.append(frame_diff)

        # Infer on flattened state vector
        x = diff_state.ravel()     

        action, _, probs = self.agent.act(x, greedy=True)
        logging.info('****************************************** step: %s action: %s', self.state.step, action)        

        # Publish prediction
        # if self.paddle1:
        #     self.state.publish("paddle1/action", {"action": str(action)})
        #     self.state.publish("paddle1/frame", {"frame": current_frame_id})
        # elif self.paddle2:
        #     self.state.publish("paddle2/action", {"action": str(action)})
        #     self.state.publish("paddle2/frame", {"frame": current_frame_id})

        # model_activation = self.agent.get_activation_packet()
        # self.state.publish("ai/activation", model_activation)      

        paddle_adjustment_x = 192
        if self.paddle1:
            # data = {"position": {"x": 0.0}}
            new_paddle_x = self.state.top_paddle_x

            if action == 0:
                new_paddle_x -= self.config.PADDLE_WIDTH
            else:
                if action == 1:
                    new_paddle_x += self.config.PADDLE_WIDTH

            # if action == 1:
            #     new_paddle_x -= 1
            # else:
            #     if action == 0:
            #         new_paddle_x += 1 

            data = {"position": {"x": new_paddle_x / paddle_adjustment_x}}    
            self.state.publish(Topics.PADDLE_TOP_POSITION, data)      
        elif self.paddle2:
            data = {"position": {"x": new_paddle_x / paddle_adjustment_x}}    
            self.state.publish(Topics.PADDLE_BOTTOM_POSITION, data)    

        #if len(self.frame_diffs) > 10:
        #    print(
        #        f"Frame distribution: mean {np.mean(self.frame_diffs)}"
        #        f", stdev {np.std(self.frame_diffs)} counts {np.unique(self.frame_diffs, return_counts=True)}")
        #    self.frame_diffs = []
        #Timer.stop('inf')

    # def inference_loop(self):
    #     while True:
    #         current_frame_id = self.state.frame
    #         if self.last_acted_frame == current_frame_id:
    #             time.sleep(0.001)
    #         else:
    #             self.publish_inference()
    #             self.last_acted_frame = current_frame_id

    # def __init__(self, config=Config.instance(), paddle1=True, in_q = Queue()):
    def __init__(self, config=Config.instance(), paddle1=True):
       
        # self.q = in_q
        self.config = config
        self.paddle1 = paddle1
        self.paddle2 = not self.paddle1

        # We have all 3 agents already loaded instead of loading between levels. Saves a lot of time and prevents freezing
        self.agent1 = PGAgent(self.config.CUSTOM_STATE_SIZE, self.config.CUSTOM_ACTION_SIZE)
        self.agent1.load(AIDriver.MODEL_1)
        self.agent = self.agent1
        self.agent2 = PGAgent(self.config.CUSTOM_STATE_SIZE, self.config.CUSTOM_ACTION_SIZE)
        self.agent2.load(AIDriver.MODEL_2)
        self.agent3 = PGAgent(self.config.CUSTOM_STATE_SIZE, self.config.CUSTOM_ACTION_SIZE)
        self.agent3.load(AIDriver.MODEL_3)
        self.state = AISubscriber(self.config, trigger_event=lambda: self.publish_inference())
        self.last_frame_id = self.state.frame
        self.last_tick = time.time()
        self.frame_diffs = []
        self.last_acted_frame = 0
        # self.inference_thread = threading.Thread(target=self.inference_loop)
        # self.inference_thread.start()
        self.state.start()
        data = {"state": "start"}    
        self.state.publish(Topics.PADDLE_TOP_STATE, data, retain=True)      


# def main(in_q):
def main():
    # main is separated out so that we can call it and pass in the queue from GUI
    config = Config.instance()
    # instance = AIDriver(config = config, in_q = in_q)
    instance = AIDriver(config = config)
    try:
        while True:
            pass
    except KeyboardInterrupt:
        print("Closing")

if __name__ == "__main__":
    # main("")
    main()

