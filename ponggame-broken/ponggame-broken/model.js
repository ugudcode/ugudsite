const STATE = { STARTUP: 0, PLAYING: 1, GAMEOVER: 2 };

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const PADDLE_WIDTH = 25;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12.5;
const PADDLE_VELOCITY = 5;
const CPU_PADDLE_SPEED = 4; // Slower speed for the CPU to make it beatable
const PADDLE_FORCE = 1.02; // 102% of speed before
const MAX_BALL_SPEED = 12;

class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    is_cpu = false;
    state = STATE.STARTUP;
    intervalID = -1;

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.state = STATE.STARTUP;
        clearTimeout(this.intervalID);
        this.scoreL = 0;
        this.scoreR = 0;
        this.paddleL = new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.LEFT, "red");
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WIDTH, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.RIGHT, "green");
        this.resetBall();
    }
    
    resetBall() {
        // Give the ball a random starting direction
        const velx = Math.random() < 0.5 ? 1 : -1;
        const vely = Math.random() < 0.5 ? 1 : -1;
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, velx, vely);
    }
}
