const SIDE = { NONE: 0, LEFT: 1, RIGHT: 2 };

class Paddle {
    posx;
    posy;
    width;
    height;
    color;
    constructor(posx, posy, width, height, side, color) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.color = color;
        this.side = side;
        this.vely = 0;
    }

    move(is_cpu, ball) {
        if (is_cpu) {
            const paddleCenter = this.posy + this.height / 2;
            const deadZone = 10; // A larger dead zone makes the CPU less "twitchy"

            if (ball.posy < paddleCenter - deadZone) {
                // Ball is above the paddle, move up
                this.vely = -CPU_PADDLE_SPEED;
            } else if (ball.posy > paddleCenter + deadZone) {
                // Ball is below the paddle, move down
                this.vely = CPU_PADDLE_SPEED;
            } else {
                // Ball is aligned with the paddle, stop moving
                this.vely = 0;
            }
        }
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
    }

    bounce(ball) {
        let bounce_dir = Math.sign(BOARD_WIDTH / 2 - this.posx);
        if (ball.posy >= this.posy && ball.posy <= this.posy + this.height && // Ball is vertically aligned with paddle
            (ball.posx + BALL_RADIUS >= this.posx && ball.posx - BALL_RADIUS <= this.posx + this.width) && // Ball is horizontally colliding
            ball.velx * bounce_dir < 0 // Ball is moving towards the paddle
        ) {
            let newVelX = PADDLE_FORCE * Math.abs(ball.velx);
            // Cap the speed to prevent it from getting too fast
            ball.velx = bounce_dir * Math.min(newVelX, MAX_BALL_SPEED);
            return SIDE.NONE;
        }

        return SIDE.NONE;
    }
}
