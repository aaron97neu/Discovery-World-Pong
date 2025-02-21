const pongAPISchema = {
  "type": "object",
  "properties": {
    "game/play": {
      "type": "object",
      "properties": {
        "ball": {
          "type": "object",
          "properties": {
            "position": {
              "type": "object",
              "properties": {
                "x": { "type": "number" },
                "y": { "type": "number" }
              },
              "required": ["x", "y"]
            }
          },
          "required": ["position"]
        },
        "paddle_top": {
          "type": "object",
          "properties": {
            "position": {
              "type": "object",
              "properties": {
                "x": {
                  "type": "number",
                  "minimum": 0.0,
                  "maximum": 1.0
                }
              },
              "required": ["x"]
            }
          },
          "required": ["position"]
        },
        "paddle_bottom": {
          "type": "object",
          "properties": {
            "position": {
              "type": "object",
              "properties": {
                "x": {
                  "type": "number",
                  "minimum": 0.0,
                  "maximum": 1.0
                }
              },
              "required": ["x"]
            }
          },
          "required": ["position"]
        }
      },
      "required": ["ball", "paddle_top", "paddle_bottom"]
    },
    "game/stats": {
      "type": "object",
      "properties": {
        "player_top": {
          "type": "object",
          "properties": {
            "score": { "type": "number" },
          },
          "required": ["score"]
        },
        "player_bottom": {
          "type": "object",
          "properties": {
            "score": { "type": "number" },
          },
          "required": ["score"]
        },
        "level": { "type": "number" }
      },
      "required": ["player_top", "player_bottom", "level"]
    },
    "game/state": {
      "type": "object",
      "properties": {
        "transition": {
          "type": "string",
          "enum": [
            "start", "player_ready", "start_game", "player_exit",
            "intro_complete", "move_left_intro_complete",
            "level1_complete", "level2_complete", "level3_complete", "stop"
          ]
        }
      },
      "required": ["transition"]
    },
    "paddle/top/position": {
      "type": "object",
      "properties": {
        "position": {
          "type": "object",
          "properties": {
            "x": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0
            }
          },
          "required": ["x"]
        }
      },
      "required": ["position"]
    },
    "paddle/top/state": {
      "type": "object",
      "properties": {
        "state": {
          "type": "string",
          "enum": ["not_ready", "ready", "start", "reset", "stop"]
        }
      },
      "required": ["state"]
    },
    "paddle/top/state_transition": {
      "type": "object",
      "properties": {
        "transition": {
          "type": "string",
          "enum": [
            "reset"
          ]
        }
      },
      "required": ["transition"]
    },
    "paddle/bottom/postion": {
      "type": "object",
      "properties": {
        "position": {
          "type": "object",
          "properties": {
            "x": {
              "type": "number",
              "minimum": 0.0,
              "maximum": 1.0
            }
          },
          "required": ["x"]
        }
      },
      "required": ["position"]
    }
  },
  "paddle/bottom/state": {
    "type": "object",
    "properties": {
      "state": {
        "type": "string",
        "enum": ["not_ready", "ready", "start", "reset", "stop"]
      }
    },
    "required": ["state"]
  },
  "paddle/bottom/state_transition": {
    "type": "object",
    "properties": {
      "transition": {
        "type": "string",
        "enum": [
          "reset"
        ]
      }
    },
    "required": ["transition"]
  },

  "required": [
    "game/play", 
    "game/stats", 
    "game/state", 
    "paddle/top/position", 
    "paddle/top/state", 
    "paddle/bottom/position",
    "paddle/bottom/state"]
};
