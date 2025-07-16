const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");
const p1ScoreElem = document.getElementById("p1-score");
const p2ScoreElem = document.getElementById("p2-score");
const p1ChargeBar = document.getElementById('p1-charge-bar');
const p2ChargeBar = document.getElementById('p2-charge-bar');

function updateScore(model) {
    if (p1ScoreElem) p1ScoreElem.textContent = model.scoreL;
    if (p2ScoreElem) p2ScoreElem.textContent = model.scoreR;
}

function draw_game(model) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

    // Update charge bars
    p1ChargeBar.style.width = `${model.paddleL.charge}%`;
    p2ChargeBar.style.width = `${model.paddleR.charge}%`;

    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);

    if (model.state === STATE.PAUSED) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)"; /* White, slightly transparent overlay */
        ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        ctx.fillStyle = "#1e1e1e"; // Ink black text
        ctx.font = "50px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", BOARD_WIDTH / 2, BOARD_HEIGHT / 2);

        // Add a helpful message on the initial pause screen
        if (model.scoreL === 0 && model.scoreR === 0) {
            ctx.font = "20px sans-serif";
            ctx.fillText("Press Space to Start", BOARD_WIDTH / 2, BOARD_HEIGHT / 2 + 50);
        }
    }
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "#1e1e1e"; // Ink black ball
    ctx.beginPath();
    const x = ball.posx;
    const y = ball.posy;
    ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI); // Use the global BALL_RADIUS
    ctx.fill();
    ctx.closePath();
}

function draw_paddle(ctx, paddle) {
    // BUG FIX: Provide visual feedback for charging by changing color
    // Glows gold when charge is building
    ctx.fillStyle = paddle.charge > 0 ? '#FFD700' : paddle.color;
    ctx.fillRect(paddle.posx, paddle.posy, paddle.width, paddle.height);
}