# MQTT Overview

## What Is It?

MQTT is the most commonly used messaging protocol for the Internet of Things (IoT). MQTT stands for MQ Telemetry Transport. The protocol is a set of rules that defines how IoT devices can publish and subscribe to data over the Internet. MQTT is used for messaging and data exchange between IoT and industrial IoT (IIoT) devices, such as embedded devices, sensors, industrial PLCs, etc. The protocol is event driven and connects devices using the publish /subscribe (Pub/Sub) pattern. The sender (Publisher) and the receiver (Subscriber) communicate via Topics and are decoupled from each other. The connection between them is handled by the MQTT broker. The MQTT broker filters all incoming messages and distributes them correctly to the Subscribers.

MQTT is used extensively in IoT, Industrial IoT (IIoT), and M2M applications.

Here are a few examples:

`Smart homes:` MQTT is used to connect various devices in a smart home, including smart thermostats, light bulbs, security cameras, and other appliances. This allows users to control their home devices remotely using a mobile app.

`Industrial automation:` MQTT is used to connect machines and sensors in factories and other industrial settings. This allows for real-time monitoring and control of processes, which can improve efficiency and reduce downtime.

`Agriculture:` MQTT is used in precision agriculture to monitor soil moisture levels, weather conditions, and crop growth. This helps farmers optimize irrigation and other crop management practices.

`Healthcare:` MQTT is used to connect medical devices and sensors, such as glucose meters and heart rate monitors, to healthcare providers. This allows for remote monitoring of patients, which can improve patient outcomes and reduce healthcare costs.

`Transportation:` MQTT is used in connected cars and other transportation systems to enable real-time tracking and monitoring of vehicles. This can improve safety and help optimize traffic flow.

## Basic Messaging

Data is stored in messages called 'topics' which are strings that messages publish or subscribe to. The structure of these topics is hierarchical similar to a file system. 

![alt text](assets/message_structure.png)

abc/outlet1/alert1, abc/outlet2/alert2 would be different topics. One thing to note is there is no defined method of structuring mqtt topics, as such we have created a loose structure to follow as seen below.

![alt text](assets/mqtt_messaging_diagram.png)

`publisher` – a client (device) that posts information on a self-chosen topic.

`MQTT broker` – a party that receives packets from publishers, checks for settings, and then forwards them to subscribers. Learn more about all the steps that the broker has to complete.

`subscriber` – a client (device) that is interested in the information on a certain topic.

### MQTT Broker

The MQTT broker is a hub for communication between clients. It obtains messages from publishers and distributes them to clients based on the topics to which they are subscribed. This allows us to keep the workload balanced and maintain the linear growth of the connection count if the number of clients increases. 

There are many available mqtt brokers, this project implements Mosquitto MQTT Broker which is the most popular one.

### MQTT Client

A MQTT client is any device from a server to a microcontroller that has access to a MQTT library. There are command line interfaces depending on the libraries downloaded, or desktop GUI or web applications that are available. To in

## Resources

Here are some resources for more reading, documentation, and tutorials:

https://www.hivemq.com/mqtt/ - reading
https://mqtt.org/getting-started/ - reading & tutorials
https://cedalo.com/blog/mqtt-subscribe-publish-mosquitto-pub-sub-example/#MQTT_publish-subscribe_model_explained - Mosquitto publish & subscribing tutorial

https://mqttx.app/ - desktop GUI client allows publishing and subscribing to topics.
