import {
    TILE_SIZE,
    MUSHROOM_SPEED,
    GRAVITY,
} from "./config.js";
import { applyAcceleration, applyMovement } from "../core/motion.js";
import animate from "../core/animate.js";
import { isMapSolidElement } from "./map.js";

export default class Mushroom {
    constructor() {
        // ANIMATIONS
        this.animations = {
            idle: [{ x: 144, y: 8 }],
        }

        this.frameDuration = 60;

        // LOAD SPRITE
        this.loadImage()

        this.mushrooms = [];
    }

    loadImage() {
        this.image = new Image();
        this.image.src = './assets/main-sprites.png';

        this.isReady = false;

        this.image.onload = () => {
            this.isReady = true;
        }
    }

    update(dt) {
        this.applyHorizontalPhysics(dt);
        this.applyVerticalPhysics(dt);
    }

    applyHorizontalPhysics(dt) {

        this.mushrooms.forEach(mushroom => {

            let proposedX = applyMovement(
                mushroom.x,
                MUSHROOM_SPEED * mushroom.direction,
                dt
            );

            const headRow = Math.floor(
                mushroom.y / TILE_SIZE
            );
            const footRow = Math.floor(
                (mushroom.y + mushroom.height - 1) / TILE_SIZE
            );
            const leftCol = Math.floor(
                proposedX / TILE_SIZE
            );
            const rightCol = Math.floor(
                (proposedX + mushroom.width) / TILE_SIZE
            )

            // Buscamos obstaculo en la derecha
            if (mushroom.direction === 1) {
                if (
                    isMapSolidElement(headRow, rightCol) ||
                    isMapSolidElement(footRow, rightCol)
                ) {
                    proposedX = (rightCol * TILE_SIZE) - mushroom.width;
                    mushroom.direction = -1;
                    mushroom.facingLeft = !mushroom.facingLeft;
                }

            } // Buscamos obstaculo en la izquierda
            else if (mushroom.direction === -1) {
                if (
                    isMapSolidElement(headRow, leftCol) ||
                    isMapSolidElement(footRow, leftCol)
                ) {
                    proposedX = (leftCol  * TILE_SIZE) + mushroom.width;
                    mushroom.direction = 1;
                    mushroom.facingLeft = !mushroom.facingLeft;
                }
            }

            mushroom.x = proposedX;
        });
    }

    applyVerticalPhysics(dt) {
        this.mushrooms.forEach(mushroom => {

            if (mushroom.vy < 0) {
                const proposedY = applyMovement(mushroom.y, mushroom.vy, dt);
                if (proposedY <= (mushroom.initialY - mushroom.height)) {
                    mushroom.y = mushroom.initialY - mushroom.height;
                    mushroom.vy = 0;
                    mushroom.vx = 80;
                    mushroom.direction = 1;
                } else {
                    mushroom.y = proposedY;
                }

            } else
            {
                let proposedVy = applyAcceleration(mushroom.vy, GRAVITY, dt);
                let proposedY = applyMovement(mushroom.y, proposedVy, dt);

                const footRow = Math.floor(
                    (proposedY + mushroom.height) / TILE_SIZE
                );
                const leftCol = Math.floor(
                    mushroom.x / TILE_SIZE
                );
                const rightCol = Math.floor(
                    (mushroom.x + mushroom.width - 1) / TILE_SIZE
                )


                // Buscamos suelo
                if (proposedVy > 0) {
                    if (
                        isMapSolidElement(footRow, leftCol) ||
                        isMapSolidElement(footRow, rightCol)
                    ) {
                        proposedVy = 0;
                        proposedY = (footRow * TILE_SIZE) - mushroom.height;
                    }
                }


                mushroom.vy = proposedVy;
                mushroom.y = proposedY;
            }
        })
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setSound(sound) {
        this.sound = sound;
    }

    spawn(x, y) {
        this.mushrooms.push({
            x,
            y: y - 5,
            width: TILE_SIZE,
            height: TILE_SIZE,
            initialY: y,
            vx: 0,
            vy: -16,
            direction: 0,
        });
        this.sound.marioHitsFromBelow('mushroom');
    }

    remove(index) {
        this.mushrooms.splice(index, 1);
    }

    render(ctx) {
        if (!this.isReady) return;

        this.mushrooms.forEach(mushroom => {
            animate(
                {
                    ...mushroom,
                    x: mushroom.x - this.camera.x,
                },
                this.image,
                this.animations.idle,
                this.frameDuration,
                ctx
            );
        })
    }
}