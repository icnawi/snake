/**
 * Snake Game
 * @author Yevgeniy Karakulin
*/

'use strict';
import * as Game from './src/Game.js';

window.onload = () => {
    let snake = new Game.Snake('frame', {fps: 100, size: 4});
}
