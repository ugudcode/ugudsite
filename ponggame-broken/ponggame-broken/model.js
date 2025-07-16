const STATE = { PLAYING: 1, GAMEOVER: 2, PAUSED: 3};

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;
const PADDLE_WIDTH = 25;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12.5;
const PADDLE_VELOCITY = 5;
const CPU_PADDLE_SPEED = 4; // Slower speed for the CPU to make it beatable
const PADDLE_FORCE = 1.02; // 102% of speed before
const MAX_BALL_SPEED = 100;
const MAX_CHARGE = 100;
const CHARGE_RATE = 1;
const CHARGE_BOOST_MULTIPLIER = 1.8;

class Model {
    ball;
    paddleL;
    paddleR;
    scoreL = 0;
    scoreR = 0;
    is_simulation = false;
    is_cpu = false;
    state = STATE.PAUSED; // Game starts in a paused state.
    intervalID = -1;
    pausedVelocity = [0, 0];

    constructor() {
        this.resetGame();
    }

    resetGame() {
        this.state = STATE.PAUSED;
        clearTimeout(this.intervalID);
        this.scoreL = 0;
        this.scoreR = 0;

        // Always create new paddles and ball on reset to ensure they are in the correct starting positions.
        this.paddleL = new Paddle(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.LEFT, "#FF7F50"); // Coral
        this.paddleR = new Paddle(BOARD_WIDTH - PADDLE_WIDTH, 0, PADDLE_WIDTH, PADDLE_HEIGHT, SIDE.RIGHT, "#6495ED"); // Cornflower Blue
        
        this.resetBall();
    }
    
    resetBall() {
        // Give the ball a random starting direction and a reasonable speed
        const initialSpeed = 5;
        const velx = (Math.random() < 0.5 ? 1 : -1) * initialSpeed;
        const vely = (Math.random() < 0.5 ? 1 : -1) * initialSpeed;
        this.ball = new Ball(BOARD_WIDTH / 2, BOARD_HEIGHT / 2, velx, vely);
    }

    togglePause() {
        // If we are starting up, transition to PLAYING. The ball already has velocity.
        if (this.state === STATE.PLAYING) {
            this.state = STATE.PAUSED;
            // Save the ball's velocity before setting it to zero
            this.pausedVelocity = [this.ball.velx, this.ball.vely];
            this.ball.velx = 0;
            this.ball.vely = 0;
        } else if (this.state === STATE.PAUSED) {
            this.state = STATE.PLAYING;
            // Restore the ball's velocity from the saved state
            [this.ball.velx, this.ball.vely] = this.pausedVelocity;
        }
    }
}
