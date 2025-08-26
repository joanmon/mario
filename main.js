import {CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE} from "./src/app/config.js";
import Background from "./src/app/background.js";
import Ground from "./src/app/ground.js";
import Mario from "./src/app/mario.js";
import render from "./src/core/render.js";
import Camera from "./src/app/camera.js";
import Mice from "./src/app/mice.js";
import Collider from "./src/app/collider.js";
import QuestionBlock from "./src/app/question.block.js";
import Mushroom from "./src/app/mushroom.js";
import Physics from "./src/core/physics.js";
import Sound from "./src/app/sound.js";

const canvas = document.getElementById('app');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const background = new Background();
const ground = new Ground();
const mario = new Mario(TILE_SIZE, TILE_SIZE);
const mice = new Mice();
const questionBlock = new QuestionBlock();
const camera = new Camera();
const collider = new Collider();
const mushroom = new Mushroom();
const physics = new Physics();
const sound = new Sound();

var started = false;
document.addEventListener('keydown', () => {
    if (!started) {
        started = true;
        sound.start();
    }
});

// DEPS
camera.setMario(mario);
mario.setCamera(camera);
mario.setPhysics(physics);
mario.setSound(sound);
mice.setCamera(camera);
mice.setSound(sound);
ground.setCamera(camera);
questionBlock.setCamera(camera);
mushroom.setCamera(camera);
mushroom.setSound(sound);
collider.setMario(mario);
collider.setMice(mice);
collider.setQuestionBlock(questionBlock);
collider.setMushroom(mushroom);


const gameItems = [
    collider,
    background,
    ground,
    mushroom,
    questionBlock,
    mice,
    mario,
    camera
];

let lastTime = performance.now();

function gameLoop(now) {

    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    render(gameItems, deltaTime, ctx, physics.paused);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
