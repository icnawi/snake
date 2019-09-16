"use strict";

import { Stage } from '../Components.js';

export class Snake {
	constructor(canvas, config) {
		// Game stage instantiation
		this.stage = new Stage(canvas, config);

		this.initSnake();
		this.initFood();
	}

	// Init Snake
	initSnake() {
		// Snake spawning
		for (let i = 0; i < this.stage.config.size; i++) {
			// Spawn body parts
			this.stage.blocks.push({x: i, y: 0});
		}
	}

	// Init Food  
	initFood() {

		// Place food on stage
		this.stage.food = {
			x: Math.round(Math.random() * (this.stage.width - this.stage.config.cw) / this.stage.config.cw),
			y: Math.round(Math.random() * (this.stage.height - this.stage.config.cw) / this.stage.config.cw)
		};
	}

	// Restart stage
	restartGame() {
		this.stage.blocks = [];
		this.stage.food = {};
		this.stage.score = 0;
		this.stage.direction = 'right';
		this.stage.keyEvent.pressKey = null;
		this.initSnake();
		this.initFood();
	}
}