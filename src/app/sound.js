export default class Sound {
    constructor() {
        this.sounds = {
            background:  new Audio('/assets/sounds/background.mp3'),
            jump:        new Audio('/assets/sounds/jump.mp3'),
            hit:         new Audio('/assets/sounds/hit.mp3'),
            rockdestroy: new Audio('/assets/sounds/rock-destroy.mp3'),
            mushroom:    new Audio('/assets/sounds/mushroom.mp3'),
            powerup:     new Audio('/assets/sounds/power-up.mp3'),
            hurt:        new Audio('/assets/sounds/hurt.mp3'),
            gameover:    new Audio('/assets/sounds/gameover.mp3'),
            coin:        new Audio('/assets/sounds/coin.mp3'),
        };

        // Configuración música de fondo
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.2;
        this.sounds.background.load();
        this.sounds.background.play().catch(() => {
            // En algunos navegadores puede requerir interacción del usuario
            console.warn('Background music could not autoplay.')
        })
    }

    start() {
        this.sounds.background.play().catch(() => {
            // En algunos navegadores puede requerir interacción del usuario
            console.warn('Background music could not autoplay.')
        })
    }

    marioJumps() {
        this.sounds.jump.volume = 0.2;
        this.sounds.jump.play();
    }

    marioHitsFromBelow(type) {
        if (type === 'used' ) {
            this.sounds.hit.volume = 0.2;
            this.sounds.hit.play();
        } else if (type === 'rock' && getState().mario.type === 'big' ) {
            this.sounds.rockdestroy.volume = 0.2;
            this.sounds.rockdestroy.play();
        } else if (type === 'mushroom') {
            this.sounds.mushroom.volume = 0.2;
            this.sounds.mushroom.play();
        } else if (type === 'coin') {
            this.sounds.coin.volume = 0.2;
            this.sounds.coin.play();
        }
    }

    marioEatsMushroom() {
        this.sounds.powerup.volume = 0.2;
        this.sounds.powerup.play();
    }

    marioKillsMouse() {
        this.sounds.hit.volume = 0.2;
        this.sounds.hit.play();
    }

    marioSmallAgain() {
        this.sounds.hurt.volume = 0.2;
        this.sounds.hurt.play();
    }

    killMario() {
        this.sounds.gameover.volume = 0.2;
        this.sounds.gameover.play();

        this.sounds.background.pause();
    }
}