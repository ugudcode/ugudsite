const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const cpucheck = document.getElementById("cpucheck");
const scoreboard = document.getElementById("scoreboard");

function updateScore(model) {
    scoreboard.innerHTML = `${model.scoreL} : ${model.scoreR}`;
}

function draw_game(model) {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    draw_ball(ctx, model.ball);
    draw_paddle(ctx, model.paddleL);
    draw_paddle(ctx, model.paddleR);
}

function draw_ball(ctx, ball) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    const x = ball.posx;
    const y = ball.posy;
    ctx.arc(x, y, BALL_RADIUS, 0, 2 * Math.PI); // Use the global BALL_RADIUS
    ctx.fill();
    ctx.closePath();
}

function draw_paddle(ctx, paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.posx, paddle.posy, paddle.width, paddle.height);
}