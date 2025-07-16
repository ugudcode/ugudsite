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
        this.isCharging = false;
        this.charge = 0;
    }

    move(is_cpu, ball) {
        // --- AI Charging Logic ---
        // Decide whether the AI should start charging its paddle.
        if (is_cpu) {
            const isBallComing = (this.side === SIDE.LEFT && ball.velx < 0) || (this.side === SIDE.RIGHT && ball.velx > 0);
            // Charge if the ball is on the other side of the board and coming towards the AI.
            this.isCharging = isBallComing && (Math.abs(ball.posx - this.posx) > BOARD_WIDTH / 2.5);
        }


        if (is_cpu) {
            // --- CPU Logic ---
            // Make the CPU's movement less perfect and more human-like.

            // 1. Introduce a margin of error. The CPU will try to align with a point
            //    slightly off-center from the ball's actual position.
            const errorMargin = (this.height / 3) * (Math.random() - 0.5); // -0.5 to 0.5 range
            const targetY = ball.posy + errorMargin;

            // 2. Add reaction delay. The CPU's speed is a fraction of the distance
            //    to the target, making it seem like it's "catching up".
            const paddleCenter = this.posy + this.height / 2;
            const distance = targetY - paddleCenter;
            
            this.vely = distance * 0.08; // The multiplier (0.08) controls how fast the CPU reacts.
        }
        this.posy = Math.min(BOARD_HEIGHT - this.height, Math.max(0, this.posy + this.vely));
    }

    bounce(ball) {
        let bounce_dir = Math.sign(BOARD_WIDTH / 2 - this.posx);
        if (ball.posy >= this.posy && ball.posy <= this.posy + this.height && // Ball is vertically aligned with paddle
            (ball.posx + BALL_RADIUS >= this.posx && ball.posx - BALL_RADIUS <= this.posx + this.width) && // Ball is horizontally colliding
            ball.velx * bounce_dir < 0 // Ball is moving towards the paddle
        ) {
            // Calculate boost based on current charge. If charge is 0, boost is 1 (no effect).
            const boost = 1 + (this.charge / 100) * (CHARGE_BOOST_MULTIPLIER - 1);

            let newVelX = PADDLE_FORCE * Math.abs(ball.velx) * boost;

            // Cap the speed to prevent it from getting too fast and apply direction
            ball.velx = bounce_dir * Math.min(newVelX, MAX_BALL_SPEED);

            // BUG FIX: Reset charge after it has been used for a hit.
            this.charge = 0;
            return SIDE.NONE;
        }

        return SIDE.NONE;
    }
}
