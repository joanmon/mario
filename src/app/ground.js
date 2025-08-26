import { MAP, TILE_SIZE } from "./config.js";

export default class Ground {
    constructor() {
        this.image = new Image();
        this.image.src = './assets/tileset.png';

        this.isReady = false;

        this.image.onload = () => {
            this.isReady = true;
        }
    }

    setCamera(camera) {
        this.camera = camera;
    }

    render(ctx) {
        if (!this.isReady) return;

        for (let row = 0; row < MAP.length; row++) {
            for (let column = 0; column < MAP[row].length; column++) {
                if (MAP[row][column] === 1 ) {
                    ctx.drawImage(
                        this.image,
                        32,
                        272,
                        TILE_SIZE,
                        TILE_SIZE,
                        (column * TILE_SIZE) - this.camera.x,
                        row * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE,
                    );
                }
            }
        }
    }
}