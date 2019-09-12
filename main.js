/**
 * Snake Game
 * @author Yevgeniy Karakulin
*/

'use strict';

import * as Game from './src/Game.js'

document.addEventListener('DOMContentLoaded', () => {
    let snake = new Game.Snake('frame', {fps: 100, size: 4});
})