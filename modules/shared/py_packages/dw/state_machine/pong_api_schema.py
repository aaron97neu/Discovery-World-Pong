pong_api_schema = {
    'game/play': {
        "type": "object",
        "properties": {
            "ball": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "object",
                        "properties": {
                            "x": {"type": "number"},
                            "y": {"type": "number"}
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
                            "x": {"type": "number", "minimum": 0.0, "maximum": 1.0}
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
                            "x": {"type": "number", "minimum": 0.0, "maximum": 1.0}
                        },
                        "required": ["x"]
                    }
                },
                "required": ["position"]
            }
        },
        "required": ["ball", "paddle_top", "paddle_bottom"]
    },
    'game/stats': {
        "type": "object",
        "properties": {
            "player_top": {
                "type": "object",
                "properties": {
                    "score": {"type": "number"},
                    "count_down": {"type": "number"}
                },
                "required": ["score", "count_down"]
            },
            "player_bottom": {
                "type": "object",
                "properties": {
                    "score": {"type": "number"},
                    "count_down": {"type": "number"}
                },
                "required": ["score", "count_down"]
            }
        },
        "required": ["player_top", "player_bottom"]
    },
    'game/state': {
        "type": "object",
        "properties": {
            "transition": {
                "type": "string",
                "enum": ["start", "player_ready", "start_game", "player_exit", "intro_complete", "move_left_intro_complete", "level1_complete", "level2_complete", "level3_complete", "stop"]
            }
        },
        "required": ["transition"]
    },
    'paddle/top': {
        "type": "object",
        "properties": {
            "position": {
                "type": "object",
                "properties": {
                    "x": {"type": "number", "minimum": 0.0, "maximum": 1.0}
                },
                "required": ["x"]
            }
        },
        "required": ["position"]
    },
    'paddle/bottom': {
        "type": "object",
        "properties": {
            "position": {
                "type": "object",
                "properties": {
                    "x": {"type": "number", "minimum": 0.0, "maximum": 1.0}
                },
                "required": ["x"]
            }
        },
        "required": ["position"]
    }
}