'use strict';

export class ControllerEvents {
	constructor() {
		this.pressKey = 0;
		this.mapping = Keymap.Directions;
		document.onkeydown = e => {
			this.pressKey = e.which;
		}
	}
	getKey() {
		return this.mapping[this.pressKey];
	}
	// keyBoardEvent(e) {
	// 		this.pressKey = e.which;
	// }
}

export class Keymap {
	constructor() {}
}

Keymap.Directions = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
}