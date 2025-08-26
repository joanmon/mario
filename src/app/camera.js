import {CANVAS_WIDTH} from "./config.js";

export default class Camera {
    constructor() {
        this.x = 0
    }

    setMario(mario) {
        this.mario = mario;
    }

    update() {
        const newX = this.mario.state.x - CANVAS_WIDTH  / 3;
        if (newX < 0) return;

        this.x = newX;
    }
}