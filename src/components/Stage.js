"use strict";

import * as KeyBoard from '../KeyBoard.js'

export class Stage {
    constructor(canvas, config) {
        // Settings
        this.keyEvent = new KeyBoard.ControllerEvents();
        this.width = canvas.width;
        this.height = canvas.height;
        this.blocks = [];
        this.food = {};
        this.score = 0;
        this.direction = 'right'; // randomize
        this.config = {
            cw: 10,
            size: 5,
            fps: 1000
        };
        this.difficulty = 0;

        // config
        if (typeof config == 'object') {
            for (let key in config) this.config[key] = config[key];
        }
    }

    increaseDifficulty() {
        for (let i = 1; i <= this.config.fps; i += 1) {
            this.difficulty = i - this.score > 50 ? i - this.score : 50
        }
        return this.difficulty
    }
}