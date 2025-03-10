# AI

## AI Method - Deep Reinforcement Learning (DRL)

"We sought to build a DRL model to drive an AI agent for Atari Pong as an accessible and visually interesting demonstration of how DRL can be applied" (Neuwirth and Riley).
refer to original research paper for PONG DRL project by MSOE: https://arxiv.org/pdf/2112.01451

The AI model was trained with three different levels of reinforcement: 5000, 15000, 22850 iterations.
These points of data also correspond with the difficulty level of the game.

## Code Structure

![alt text](assets/ai_paddle_control_code_diagram.png)

`ai_driver.py` contains the class `AIDriver`, where the AI model is applied from using the `PGAgent` class, and publishing the results of the model prediction to mqtt topics available for neural network visualizer to subscribe to the data.

## AI_Subscriber

please refer to [docs/mqtt](../../mqtt) for how mqtt subscribing and publishing works according to the mqtt v3.1 specification. 

## Policy Gradient Agent (PGAgent)

The policy gradient (PG) algorithm is a on-policy reinforcement learning method for environments with a discrete or continuous action space.
The policy gradient algorithm works by updating policy parameters via stochastic gradient ascent on policy performance over # of episodes.
A stochastic policy like this one, the control of the paddle is selected based on the encountered state and a probability distribution, vs. a deterministic policy where the same control is used for the same input state/

The PGAgent class applies this algorithm to the data set from each model level using tensorflow libraries. This class was partially adapted from https://github.com/keon/policy-gradient/blob/master/pg.py. see [docs/guides/tensorflow.md] for more ML resources.

## How to retrain AI Model Results

The current trained model is basic which has lead to complaints of gameplay being trivial. Retraining the AI model is out of scope of current project deliverables, however, there is some available code describing how to start retraining. 
see [here](https://github.com/Rockwell-Automation-Inc/Discovery-World-Pong/blob/archive/non-containerized/DiscoveryWorldPongAIExhibit/reinforcement_selfplay.py).
This code was removed during the containerizion process, but could be
reintroduced with some effort.

*note: the .h5 files are the AI training results