import {
    TILE_SIZE,
    MARIO_ACCELERATION,
    MARIO_MAX_VELOCITY,
    MARIO_FRICTION,
    GRAVITY,
    MAP,
    MARIO_JUMP_FORCE
} from "./config.js";
import { applyAcceleration, applyDeceleration, applyMovement } from "../core/motion.js";
import animate from "../core/animate.js";
import { isMapSolidElement } from "./map.js";

export default class Mario {
    constructor() {
        this.initMario();

        this.animations = {
            small: {
                idle: [{x: 0, y: 39}],
                run: [
                    {x: 16, y: 39},
                    {x: 32, y: 39},
                    {x: 48, y: 39},
                ],
                jump: [{x: 80, y: 39}],
                dead: [{ x: 96, y: 39 }],
                growing: [{ x: 0, y: 40 }]
            },
            big: {
                idle: [{ x: 0, y: 175}],
                run: [
                    { x: 32, y: 175 },
                    { x: 48, y: 175 },
                    { x: 64, y: 175 },
                ],
                jump: [{ x: 96, y: 175 }],
                growing: [
                    {x: 48, y: 7},
                    {x: 0, y: 175},
                ],
            }
        }

        this.frameDuration = 35;

        this.image = new Image();
        this.image.src = './assets/main-sprites.png';

        this.isReady = false;

        this.image.onload = () => {
            this.isReady = true;
        }

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    initMario() {
        for (let row = 0; row < MAP.length; row++) {
            for (let column = 0; column < MAP[row].length; column++) {
                if (MAP[row][column] === 2 ) {
                    this.state = {
                        x: column * TILE_SIZE,
                        y: row * TILE_SIZE,
                        direction: 0,
                        vx: 0,
                        vy: 0,
                        height: TILE_SIZE + 1,
                        width: TILE_SIZE,
                        isOnGround: false,
                        animation: 'idle',
                        facingLeft: false,
                        size: 'small',
                        lastAnimation: 'idle',
                        immunity: false,
                    }
                    return;
                }
            }
        }
    }

    onKeyDown(event) {
        if (this.state.animation === 'dead') return;

        if (event.key === 'ArrowLeft') {
            this.state.direction = -1;
        } else if (event.key === 'ArrowRight') {
            this.state.direction = 1;
        } else if (
            event.key === 'ArrowUp' &&
            this.state.isOnGround
        ) {
            this.state.vy = -MARIO_JUMP_FORCE;
            this.state.isOnGround = false;
            this.sound.marioJumps();
        }
    }

    onKeyUp(event) {
        if (this.state.animation === 'dead') return;

        if (
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight'
        ) {
            this.state.direction = 0;
        }
    }

    update(dt) {
        this.applyHorizontalPhysics(dt);
        this.applyVerticalPhysics(dt);
        this.computeAnimation();
    }

    applyHorizontalPhysics(dt) {

        let proposedVx = this.state.direction !== 0 ?
            applyAcceleration(
                this.state.vx,
                MARIO_ACCELERATION,
                dt,
                this.state.direction,
                MARIO_MAX_VELOCITY
            ) :
            applyDeceleration(
                this.state.vx,
                MARIO_FRICTION,
                dt
            );

        let proposedX = applyMovement(
            this.state.x,
            this.state.vx,
            dt
        );

        const headRow = Math.floor(
            this.state.y / TILE_SIZE
        );
        const footRow = Math.floor(
            (this.state.y + this.state.height - 1) / TILE_SIZE
        );
        const leftCol = Math.floor(
            proposedX / TILE_SIZE
        );
        const rightCol = Math.floor(
            (proposedX + this.state.width) / TILE_SIZE
        )

        // Buscamos obstaculo en la derecha
        if (proposedVx > 0) {
            if (
                isMapSolidElement(headRow, rightCol)||
                isMapSolidElement(footRow, rightCol)
            ) {
                proposedVx = 0;
                proposedX = (rightCol * TILE_SIZE) - this.state.width;
            }

        } // Buscamos obstaculo en la izquierda
        else if (proposedVx < 0) {
            if (
                isMapSolidElement(headRow, leftCol) ||
                isMapSolidElement(footRow, leftCol)
            ) {
                proposedVx = 0;
                proposedX = (leftCol  * TILE_SIZE) + this.state.width;
            }
        }


        this.state.vx = proposedVx;
        this.state.x = proposedX;
    }

    applyVerticalPhysics(dt) {
        let proposedVy = applyAcceleration(this.state.vy, GRAVITY, dt);
        let proposedY = applyMovement(this.state.y, proposedVy, dt);

        const headRow = Math.floor(
            proposedY / TILE_SIZE
        );
        const footRow = Math.floor(
            (proposedY + this.state.height) / TILE_SIZE
        );
        const leftCol = Math.floor(
            this.state.x / TILE_SIZE
        );
        const rightCol = Math.floor(
            (this.state.x + this.state.width - 1) / TILE_SIZE
        )


        // Buscamos suelo
        if (proposedVy > 0) {
            if (
                isMapSolidElement(footRow, leftCol)||
                isMapSolidElement(footRow, rightCol)
            ) {
                proposedVy = 0;
                proposedY = (footRow * TILE_SIZE) - this.state.height;
                this.state.isOnGround = true;
            }

        } // Buscamos techo
        else {
            if (
                isMapSolidElement(headRow, leftCol) ||
                isMapSolidElement(headRow, rightCol)
            ) {
                proposedVy = 0;
                proposedY = (headRow * TILE_SIZE) + this.state.height;
            }
        }


        this.state.vy = proposedVy;
        this.state.y = proposedY;
    }

    computeAnimation() {
        if (this.state.animation === 'growing') {
            this.state.animation = 'growing';
        } else if (this.state.animation === 'dead') {
            this.state.animation = 'dead';
        } else if (!this.state.isOnGround) {
            this.state.animation = 'jump';
        } else if (Math.abs(this.state.vx) > 0) {
            this.state.animation = 'run';
        } else {
            this.state.animation = 'idle';
        }

        if (this.state.vx > 0) {
            this.state.facingLeft = false;
        } else if (this.state.vx < 0) {
            this.state.facingLeft = true;
        }
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setPhysics(physics) {
        this.physics = physics;
    }

    setSound(sound) {
        this.sound = sound;
    }

    dead() {
        if (this.state.immunity) return;
        if (this.state.size === 'big') {
            this.sound.marioSmallAgain();
            this.state.size = 'small';
            this.state.y = this.state.y + TILE_SIZE / 2;
            this.state.height = TILE_SIZE + 1;
            this.state.immunity = true;

            setTimeout(() => {
                this.state.immunity = false;
            }, 1000)
        } else {
            this.state.animation = 'dead';
            this.state.direction = 0;
            this.state.vy = -MARIO_JUMP_FORCE;

            this.sound.killMario();
        }
    }

    rebound() {
        this.state.vy = -MARIO_JUMP_FORCE;
    }

    grow() {
        this.sound.marioEatsMushroom();
        this.physics.pause();
        this.state.size = 'big';
        this.state.lastAnimation = this.state.animation;
        this.state.animation = 'growing';
        this.state.y = this.state.y - (TILE_SIZE / 2);
        this.state.height = TILE_SIZE + (TILE_SIZE / 2) + 1;
        this.frameDuration = 200;

        setTimeout(() => {
            this.state.animation = this.state.lastAnimation;
            this.frameDuration = 70;
            this.physics.continue();
        }, 600)
    }

    render(ctx) {
        if (!this.isReady) return;

        const newState = {
            ...this.state,
            x: this.state.x - this.camera.x,
        };

        animate(
            newState,
            this.image,
            this.animations[this.state.size][this.state.animation],
            this.frameDuration,
            ctx,
            this.state.immunity ? 70 : 0
        );
    }
}