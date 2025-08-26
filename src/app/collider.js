import { isColliding } from "../core/collision.js";
import { applyAcceleration, applyMovement } from "../core/motion.js";
import { GRAVITY } from "./config.js";

export default class Collider {

    setMario(mario) {
        this.mario = mario;
    }

    setMice(mice) {
        this.mice = mice;
    }

    setMushroom(mushroom) {
        this.mushroom = mushroom;
    }

    setQuestionBlock(questionBlock) {
        this.questionBlock = questionBlock;
    }

    update(dt) {
        this.checkIfMarioCollidesMouse()
        this.checkIfMarioCollidesQuestionBlock(dt);
        this.checkIfMarioCollidesMushroom();
    }

    checkIfMarioCollidesMouse() {
        this.mice.mice.forEach((mouse, index) => {
            if (this.mario.state.animation === 'dead') return;
            if (mouse.animation === 'dead') return;

            if (isColliding(mouse, this.mario.state)) {
                if (this.mario.state.vy > 0) {
                    this.mice.killMouse(index);
                    this.mario.rebound();
                } else {
                    this.mario.dead();
                }
            }
        });
    }

    checkIfMarioCollidesQuestionBlock(dt)
    {
        if (this.mario.state.animation === 'dead') return;

        if (this.mario.state.vy < 0) {
            let proposedVy = applyAcceleration(this.mario.state.vy, GRAVITY, dt);
            let proposedY = applyMovement(this.mario.state.y, proposedVy, dt);
            const proposedState = {
                ...this.mario.state,
                y: proposedY,
            }
            this.questionBlock.blocks.forEach((block, index) => {
                if (
                    isColliding(block, proposedState)
                    && this.mario.state.y > block.y + block.height
                    && block.animation === 'question'
                ) {
                    this.questionBlock.headBump(index);
                    this.mushroom.spawn(
                        this.questionBlock.blocks[index].x,
                        this.questionBlock.blocks[index].y
                    );
                }
            })
        }
    }

    checkIfMarioCollidesMushroom() {
        this.mushroom.mushrooms.forEach((mushroom, index) => {
            if (isColliding(mushroom,  this.mario.state)) {
                this.mushroom.remove(index);
                this.mario.grow();
            }
        })
    }
}