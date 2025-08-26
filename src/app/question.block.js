import { MAP, TILE_SIZE, GRAVITY } from "./config.js";
import {applyAcceleration, applyMovement} from "../core/motion.js";
import animate from "../core/animate.js";

export default class QuestionBlock {
    constructor() {
        // ANIMATIONS
        this.animations = {
            question: [{ x: 168, y: 40 }, { x: 168, y: 64 }],
            used: [{ x: 192, y: 40 }],
        }

        this.frameDuration = 200;

        // LOAD SPRITE
        this.loadImage()

        // INIT BLOCKS
        this.blocks = [];
        this.initBlocks();
    }
    loadImage() {
        this.image = new Image();
        this.image.src = './assets/main-sprites.png';

        this.isReady = false;

        this.image.onload = () => {
            this.isReady = true;
        }
    }

    initBlocks() {
        for (let row = 0; row < MAP.length; row++) {
            for (let column = 0; column < MAP[row].length; column++) {
                if (MAP[row][column] === 4 ) {
                    this.blocks.push({
                        x: column * TILE_SIZE,
                        y: row * TILE_SIZE,
                        initialY: row * TILE_SIZE,
                        vx: 0,
                        vy: 0,
                        height: TILE_SIZE,
                        width: TILE_SIZE,
                        animation: 'question',
                        facingLeft: false,
                    })
                }
            }
        }
    }

    update(dt) {
        this.applyVerticalPhysics(dt);
    }

    applyVerticalPhysics(dt) {
        this.blocks.forEach((block) => {
            let vy = applyAcceleration(block.vy, GRAVITY, dt);
            const proposedY = applyMovement(block.y, vy, dt);
            if (proposedY >= block.initialY) {
                block.y = block.initialY;
                block.vy = 0
            } else {
                block.y = proposedY;
                block.vy = vy
            }
        })
    }

    headBump(index) {
        this.blocks[index].vy = -150;
        this.blocks[index].animation = 'used';
    }

    setCamera(camera) {
        this.camera = camera;
    }

    render(ctx) {
        if (!this.isReady) return;

        this.blocks.forEach(block => {
            animate(
                {
                    ...block,
                    x: block.x - this.camera.x,
                },
                this.image,
                this.animations[block.animation],
                this.frameDuration,
                ctx
            );
        })
    }
}