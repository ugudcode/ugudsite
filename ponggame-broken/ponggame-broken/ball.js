class Ball {
    posx;
    posy;
    velx;
    vely;
    inPlay;

    constructor(posx, posy, velx, vely) {
        this.posx = posx;
        this.posy = posy;
        this.velx = velx;
        this.vely = vely;
        this.inPlay = false;
    }


    move() {
        this.posx += this.velx;
        this.posy += this.vely;
        console.log(this.velx, this.vely)

    }

    bounce(things) {
        this.bounceWalls();
        for (let thing of things) {
            let side = thing.bounce(this);
            if (side != SIDE.NONE) return side;
        }
        // If ball goes past right wall, left player scores.
        if (this.posx - BALL_RADIUS > BOARD_WIDTH) return SIDE.LEFT;
        // If ball goes past left wall, right player scores.
        if (this.posx + BALL_RADIUS < 0) return SIDE.RIGHT;

        return SIDE.NONE;
    }

    bounceWalls() {
        if (this.posy - BALL_RADIUS < 0) {
            this.vely = Math.abs(this.vely);
        }
        if (this.posy + BALL_RADIUS > BOARD_HEIGHT) {
            this.vely = -Math.abs(this.vely);
        }
    }
}