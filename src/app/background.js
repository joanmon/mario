import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config.js";

export default class Background {
    render(ctx) {
        ctx.fillStyle = '#a5ddfb';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}