'use strict';

import * as Components from './Components.js';

export class Draw {
	constructor(ctx, snake) {
		this.ctx = ctx;
		this.snake = snake;
		this.done = false;
		this.run = null;
		// this.stop = null;
	}

	preGame() {
		this.showTitleScreen('PRESS "ENTER" TO PLAY');
	}

	gameOver() {
		this.clearCanvas();
		this.showTitleScreen(`GAME OVER!`);
		this.displayGameTip();

		this.setStageFacade('rgba(68,68,68, .2)');
		this.displayFinalScore();
	}

	newGame() {
		this.clearCanvas();
		this.snake.stage.config.fps = 100;
		this.snake.restartGame();
	}

	showTitleScreen(title) {
		this.ctx.save();
		this.ctx.translate(130, this.snake.stage.height / 2.5);
		this.ctx.strokeStyle = 'rgb(68, 68, 68)';
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(0, 0, this.snake.stage.width / 2, 50);
		this.ctx.fillStyle = 'rgb(68,68,68)';
		this.ctx.font = '16px sans-serif';
		this.ctx.fillText(title, 25, this.snake.stage.height - 470);
		this.ctx.restore();
	}

	clearCanvas() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	displayFinalScore() {
		this.ctx.save();
		this.ctx.strokeStyle = 'rgb(68, 68, 68)';
		this.ctx.translate(30, this.snake.stage.height / 2);
		this.ctx.fillStyle = 'rgb(68,68,68)';
		this.ctx.font = '16px sans-serif';
		this.ctx.fillText(
			`HIGH SCORE: ${this.snake.stage.score}`,
			this.snake.stage.width / 3.25,
			this.snake.stage.height / 2.2
		);
		this.ctx.restore();
	}

	displayGameTip() {
		this.ctx.save();
		this.ctx.strokeStyle = 'rgb(68, 68, 68)';
		this.ctx.translate(30, this.snake.stage.height / 2);
		this.ctx.fillStyle = 'rgb(68,68,68)';
		this.ctx.font = '12px sans-serif';
		this.ctx.fillText(`Press "Space" to replay`, this.snake.stage.width / 3.25, this.snake.stage.height - 470);
		this.ctx.restore();
	}
	// draw stage
	setStageFacade(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.snake.stage.width, this.snake.stage.height);
		//TODO: add borders, its colors etc.
	}

	traceSnakePosition() {}

	checkDirectionControls() {
		let keyPress = this.snake.stage.keyEvent.getKey();
		if (keyPress) {
			this.snake.stage.direction = keyPress;
		}
	}

	implementFood(x, y) {
		let tail;
		if (x === this.snake.stage.food.x && y === this.snake.stage.food.y) {
			tail = {
				x,
				y
			};
			this.snake.stage.score += 10;

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
		let nx = this.snake.stage.blocks[0].x;
		let ny = this.snake.stage.blocks[0].y;

		this.checkDirectionControls();
		this.setStageFacade('white');

		switch (this.snake.stage.direction) {
			case 'right':
				nx++;
				break;
			case 'left':
				nx--;
				break;
			case 'up':
				ny--;
				break;
			case 'down':
				ny++;
				break;
		}

		if (this.isCollided(nx, ny)) {
			this.done = true;
			clearInterval(this.run);
			this.gameOver();

			return;
		}

		this.implementFood(nx, ny);
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
		let widthLine = this.snake.stage.width / this.snake.stage.config.cw;
		let heightLine = this.snake.stage.height / this.snake.stage.config.cw;

		let selfCollision = false;

		for (let i = 1; i < this.snake.stage.blocks.length; i++) {
			var x = this.snake.stage.blocks[i].x;
			var y = this.snake.stage.blocks[i].y;
			if (x == ax && x > 3 && y == ay) selfCollision = true;
		}

		if (~[ -1, widthLine ].indexOf(ax) || ~[ -1, heightLine ].indexOf(ay) || selfCollision) {
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
		let gameDraw = new Draw(ctx, snake);

		// Game Interval
		gameDraw.preGame();

		document.addEventListener('keypress', (e) => {
			switch (e.keyCode) {
				case 13:
					e.preventDefault();
					this.runGame(gameDraw, gameDraw.done);
					break;

				case 32:
					e.preventDefault()
					gameDraw.newGame();
					this.runGame(gameDraw);
					break;
			}
		});
	}

	runGame(game, over) {
		game.run = setInterval(() => {
			if (!over) game.drawStage();
		}, game.snake.stage.config.fps - game.snake.stage.score > 30 ? game.snake.stage.config.fps - game.snake.stage.score : 30);
	}
}
