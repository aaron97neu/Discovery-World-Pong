export const pongSchema = {
    'game/play': {
      type: 'object',
      properties: {
        ball: {
          type: 'object',
          properties: {
            position: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' }
              },
              required: ['x', 'y']
            }
          },
          required: ['position']
        },
        paddleTop: {
          type: 'object',
          properties: {
            position: {
              type: 'object',
              properties: {
                x: { type: 'number', minimum: 0.0, maximum: 1.0 }
              },
              required: ['x']
            }
          },
          required: ['position']
        },
        paddleBottom: {
          type: 'object',
          properties: {
            position: {
              type: 'object',
              properties: {
                x: { type: 'number', minimum: 0.0, maximum: 1.0 }
              },
              required: ['x']
            }
          },
          required: ['position']
        }
      },
      required: ['ball', 'paddleTop', 'paddleBottom']
    },
    'game/stats': {
      type: 'object',
      properties: {
        player1: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            count_down: { type: 'number' }
          },
          required: ['score', 'count_down']
        },
        player2: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            count_down: { type: 'number' }
          },
          required: ['score', 'count_down']
        }
      },
      required: ['player1', 'player2']
    },
    'game/state': {
      type: 'object',
      properties: {
        transition: {
          type: 'string',
          enum: ['start', 'player_ready', 'start_game', 'player_exit', 'intro_complete', 'move_left_intro_complete', 'level1_complete', 'level2_complete', 'level3_complete', 'stop']
        }
      },
      required: ['transition']
    },
    'paddle/top': {
      type: 'object',
      properties: {
        position: {
          type: 'object',
          properties: {
            x: { type: 'number', minimum: 0.0, maximum: 1.0 }
          },
          required: ['x']
        }
      },
      required: ['position']
    },
    'paddle/bottom': {
      type: 'object',
      properties: {
        position: {
          type: 'object',
          properties: {
            x: { type: 'number', minimum: 0.0, maximum: 1.0 }
          },
          required: ['x']
        }
      },
      required: ['position']
    }
  };