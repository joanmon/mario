import {
    TILE_SIZE,
    MAP,
    MOUSE_VELOCITY, GRAVITY, CANVAS_WIDTH
} from "./config.js";
import { applyAcceleration, applyMovement } from "../core/motion.js";
import animate from "../core/animate.js";
import { isMapSolidElement } from "./map.js";

export default class Mice {
    constructor() {
        // ANIMATIONS
        this.animations = {
            idle: [{ x: 32, y: 64 }],
            walk: [
                { x: 48, y: 64 },
                { x: 32, y: 64 },
            ],
            dead: [{ x: 64, y: 64 }],
        }

        this.frameDuration = 60;

        // CARGAR SPRITE
        this.loadImage()

        // INIT MICE
        this.mice = [];
        this.initMice();
    }

    loadImage() {
        this.image = new Image();
        this.image.src = './assets/main-sprites.png';

        this.isReady = false;

        this.image.onload = () => {
            this.isReady = true;
        }
    }

    initMice() {
        for (let row = 0; row < MAP.length; row++) {
            for (let column = 0; column < MAP[row].length; column++) {
                if (MAP[row][column] === 3 ) {
                    this.mice.push({
                        x: column * TILE_SIZE,
                        y: row * TILE_SIZE,
                        direction: 0,
                        vx: 0,
                        vy: 0,
                        height: TILE_SIZE,
                        width: TILE_SIZE,
                        animation: 'idle',
                        facingLeft: false,
                    })
                }
            }
        }
    }

    update(dt) {
        this.applyHorizontalPhysics(dt);
        this.applyVerticalPhysics(dt);
        this.computeAnimation();
        this.activate();
    }

    activate() {
        const camInitX = this.camera.x;
        const camFinalX = camInitX + CANVAS_WIDTH;

        this.mice.forEach(mouse => {
            if (
                mouse.x > camInitX &&
                mouse.x < camFinalX &&
                mouse.animation === 'idle'
            ) {
                mouse.direction  = -1;
            }
        })
    }

    applyHorizontalPhysics(dt) {

        this.mice.forEach(mouse => {

            let proposedX = applyMovement(
                mouse.x,
                MOUSE_VELOCITY * mouse.direction,
                dt
            );

            const headRow = Math.floor(
                mouse.y / TILE_SIZE
            );
            const footRow = Math.floor(
                (mouse.y + mouse.height - 1) / TILE_SIZE
            );
            const leftCol = Math.floor(
                proposedX / TILE_SIZE
            );
            const rightCol = Math.floor(
                (proposedX + mouse.width) / TILE_SIZE
            )

            // Buscamos obstaculo en la derecha
            if (mouse.direction === 1) {
                if (
                    isMapSolidElement(headRow, rightCol) ||
                    isMapSolidElement(footRow, rightCol)
                ) {
                    proposedX = (rightCol * TILE_SIZE) - mouse.width;
                    mouse.direction = -1;
                    mouse.facingLeft = !mouse.facingLeft;
                }

            } // Buscamos obstaculo en la izquierda
            else if (mouse.direction === -1) {
                if (
                    isMapSolidElement(headRow, leftCol) ||
                    isMapSolidElement(footRow, leftCol)
                ) {
                    proposedX = (leftCol  * TILE_SIZE) + mouse.width;
                    mouse.direction = 1;
                    mouse.facingLeft = !mouse.facingLeft;
                }
            }

            mouse.x = proposedX;
        });
    }

    applyVerticalPhysics(dt) {
        this.mice.forEach(mouse => {
            let proposedVy = applyAcceleration(mouse.vy, GRAVITY, dt);
            let proposedY = applyMovement(mouse.y, proposedVy, dt);

            const headRow = Math.floor(
                proposedY / TILE_SIZE
            );
            const footRow = Math.floor(
                (proposedY + mouse.height) / TILE_SIZE
            );
            const leftCol = Math.floor(
                mouse.x / TILE_SIZE
            );
            const rightCol = Math.floor(
                (mouse.x + mouse.width - 1) / TILE_SIZE
            )


            // Buscamos suelo
            if (proposedVy > 0) {
                if (
                    isMapSolidElement(footRow, leftCol) ||
                    isMapSolidElement(footRow, rightCol)
                ) {
                    proposedVy = 0;
                    proposedY = (footRow * TILE_SIZE) - mouse.height;
                }

            } // Buscamos techo
            else {
                if (
                    isMapSolidElement(headRow, leftCol) ||
                    isMapSolidElement(headRow, rightCol)
                ) {
                    proposedVy = 0;
                    proposedY = (headRow * TILE_SIZE) + mouse.height;
                }
            }


            mouse.vy = proposedVy;
            mouse.y = proposedY;
        })
    }

    computeAnimation() {
        this.mice.forEach(mouse => {
            if (mouse.direction !== 0 ) {
                mouse.animation = 'walk';
            }
        })
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setSound(sound) {
        this.sound = sound;
    }

    killMouse(index) {
        this.mice[index].direction = 0;
        this.mice[index].animation = 'dead';
        this.sound.marioKillsMouse();
    }

    render(ctx) {
        if (!this.isReady) return;

        this.mice.forEach(mouse => {
            animate(
                {
                    ...mouse,
                    x: mouse.x - this.camera.x,
                },
                this.image,
                this.animations[mouse.animation],
                this.frameDuration,
                ctx
            );
        })
    }
}