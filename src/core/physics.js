export default class Physics {
    constructor() {
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }

    continue() {
        this.paused = false;
    }
}