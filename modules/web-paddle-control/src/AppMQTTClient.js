import {MQTTClient} from 'dw-state-machine';

export default class AppMQTTClient extends MQTTClient {
  constructor(broker_url, client_id, baseState) {
    super(broker_url, client_id, baseState);
    this.subscribeMap = {
    };
    this.publishMap = {
        'game_bottom_paddle_position': 'game/bottom_paddle_position',
        'game_top_paddle_position': 'game/top_paddle_position',
    };
  }
}