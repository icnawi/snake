'use strict';

import * as Components from './Components.js';

export class Draw {
	constructor(ctx, snake) {
		this.ctx = ctx;
		this.snake = snake;
		this.done = false;
		this.isReplay = false;
		this.run = null;
	}

	preGame() {
		this.translateTitleScreen('PRESS "ENTER" TO PLAY', 25, 2.5);
	}

	gameOver() {
		this.clearCanvas();
		this.translateTitleScreen(`GAME OVER!`, 25, 5);
		this.displayGameTip();

		this.setStageFacade('rgba(68,68,68, .2)');
		this.displayFinalScore();
	}

	newGame() {
		this.clearCanvas();
		this.snake.stage.config.fps = 100;
		this.done = false;
		this.snake.stage.difficulty = this.snake.stage.config.fps;
		this.snake.restartGame();
	}

	translateTitleScreen(title, x, y) {
		this.ctx.save();
		this.ctx.translate(x, this.snake.stage.height / y);
		this.ctx.strokeStyle = 'rgb(68, 68, 68)';
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(0, 0, this.snake.stage.width / 1.25, this.snake.stage.width / 5);
		this.ctx.fillStyle = 'rgb(68,68,68)';
		this.ctx.font = '14px sans-serif';
		this.ctx.fillText(title, this.snake.stage.width / title.length, this.snake.stage.height / 8);
		this.ctx.restore();
	}

	clearCanvas() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	displayFinalScore() {
		this.ctx.save();
		this.ctx.strokeStyle = 'rgb(68, 68, 68)';
		this.ctx.translate(0, this.snake.stage.height / 2);
		this.ctx.fillStyle = 'rgb(68,68,68)';
		this.ctx.font = 'bold 14px sans-serif';
		this.ctx.fillText(
			`HIGH SCORE: ${this.snake.stage.score}`,
			this.snake.stage.width / 3.5,
			this.snake.stage.height / 2.5
		);
		this.ctx.restore();
	}

	displayGameTip() {
		this.ctx.save();
		this.ctx.strokeStyle = 'rgb(68, 68, 68)';
		this.ctx.translate(0, this.snake.stage.height / 5);
		this.ctx.fillStyle = 'rgb(68,68,68)';
		this.ctx.font = '12px sans-serif';
		this.ctx.fillText(`Press "SPACE" to replay`, this.snake.stage.width / 4, this.snake.stage.height / 2);
		this.ctx.restore();
	}
	// draw stage
	setStageFacade(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.snake.stage.width, this.snake.stage.height);
		//TODO: add borders, its colors etc.
	}

	implementFood(x, y) {
		let tail;
		if (x === this.snake.stage.food.x && y === this.snake.stage.food.y) {
			tail = {
				x,
				y
			};
			this.snake.stage.score += 1;

			this.snake.initFood();
		} else {
			tail = this.snake.stage.blocks.pop();
			tail.x = x;
			tail.y = y;
		}
		this.snake.stage.blocks.unshift(tail);
	}

	drawSnake() {
		for (let k of this.snake.stage.blocks) {
			let cell = k;
			this.drawCell(cell.x, cell.y);
		}
	}

	drawStage() {
		//position
		let dx = this.snake.stage.blocks[0].x;
		let dy = this.snake.stage.blocks[0].y;

		let keyPress = this.snake.stage.keyEvent.getKey();
		if (keyPress) {
			this.snake.stage.direction = keyPress;
		}

		this.setStageFacade('white');

		switch (this.snake.stage.direction) {
			case 'right':
				dx += 1;
				break;
			case 'left':
				dx -= 1;
				break;
			case 'up':
				dy -= 1;
				break;
			case 'down':
				dy += 1;
				break;
		}

		if (this.isCollided(dx, dy)) {
			this.done = true;
			this.isReplay = true;
			clearTimeout(this.run)
			this.gameOver();

			return;

		}

		this.implementFood(dx, dy);
		this.drawSnake();
		this.drawCell(this.snake.stage.food.x, this.snake.stage.food.y);

		this.ctx.fillText(`SCORE: ${this.snake.stage.score}`, 5, this.snake.stage.height - 5);
	}

	// Draw Cell
	drawCell(x, y) {
		this.ctx.fillStyle = 'rgb(68, 68, 68)';
		this.ctx.beginPath();
		this.ctx.arc(x * this.snake.stage.config.cw + 6, y * this.snake.stage.config.cw + 6, 4, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}

	// Check Collision with walls
	isCollided(ax, ay) {
		// Collision with walls
		let widthLine = this.snake.stage.width / this.snake.stage.config.cw;
		let heightLine = this.snake.stage.height / this.snake.stage.config.cw;

		// Self collision
		let selfCollision = false;

		for (let i = 1; i < this.snake.stage.blocks.length; i++) {
			var x = this.snake.stage.blocks[i].x;
			var y = this.snake.stage.blocks[i].y;
			if (x == ax && x > 3 && y == ay) selfCollision = true;
		}

		if (~[-1, widthLine].indexOf(ax) || ~[-1, heightLine].indexOf(ay) || selfCollision) {
			return true;
		}
		return false;
	}
}

export class Snake {
	constructor(elem, cfg) {
		let canvas = document.getElementById(elem);
		let ctx = canvas.getContext('2d');

		let snake = new Components.Snake(canvas, cfg);

		this.keysPressed = [];
		this.game = new Draw(ctx, snake);

		//Display Game Menu 
		this.game.preGame();

		//Listen to keydown
		$(document).on('keydown', e => this.handleGameControls(e))
	}

	updateSnakeMovement(key) {
		if (this.game.snake.stage.direction != 'right' && key === 37) this.game.snake.stage.direction = 'left';
		else if (this.game.snake.stage.direction != 'left' && key === 39) this.game.snake.stage.direction = 'right';
		else if (this.game.snake.stage.direction != 'down' && key === 38) this.game.snake.stage.direction = 'up';
		else if (this.game.snake.stage.direction != 'up' && key === 40) this.game.snake.stage.direction = 'down';
	}

	keyIsAlreadyPressed(which) {
		return $.inArray(which, this.keysPressed) !== -1
	}

	handleGameControls(e) {
	
		switch (e.which) {
			case 13:
				// firing Enter key once
				if (this.keyIsAlreadyPressed(e.which)) return;

				if (!this.game.isReplay) {
					this.keysPressed.push(e.which);
					this.keysPressed = $.unique(this.keysPressed)
					this.runGame(this.game);
				}
				break;

			case 32:
				// prevent space pressed during game
				this.keysPressed.push(e.which);
				this.keysPressed = $.unique(this.keysPressed);

				if (this.game.done) {
					this.keysPressed.splice(1)
					this.game.newGame();
					this.runGame(this.game);

					if (this.keyIsAlreadyPressed(e.which)) return;
				} else {
					//blocking spacebar from occasional press
					if (this.keyIsAlreadyPressed(e.which)) return;
				}
				break;

			default:
				this.updateSnakeMovement(e.which);
		}
	}

	runGame(g) {
		g.run = setTimeout(function tick() {
			if (!g.done) {
				setTimeout(
					tick,
					g.snake.stage.increaseDifficulty()
				)

				g.drawStage();
			} else clearTimeout(tick);
		}, g.snake.stage.difficulty)
	}
}