let model = new Model();

function onTick() {
    switch (model.state) {
        case STATE.STARTUP:
            model.state = STATE.PLAYING;
            break;
        case STATE.PLAYING:
            model.state = play();
            break;
        case STATE.PAUSED:
            // Game is paused, do nothing to update game state.
            break;
        case STATE.GAMEOVER:
            // Game is over, do nothing to update game state.
            break;
    }
    draw_game(model);
    model.intervalID = setTimeout(onTick, 10);
}

function play() {
    model.paddleL.move(false, model.ball);
    model.paddleR.move(model.is_cpu, model.ball);
    model.ball.move();

    let scoreSide = model.ball.bounce([model.paddleL, model.paddleR]);
    if (scoreSide != SIDE.NONE) {
        if (scoreSide == SIDE.LEFT) model.scoreL++;
        if (scoreSide == SIDE.RIGHT) model.scoreR++;
        updateScore(model);
        model.resetBall();
        // Read the winning score from the input field
        const scoreInput = document.getElementById("scoreInput");
        let winningScore = parseInt(scoreInput.value, 10);
        // Default to 10 if the input is not a valid number or is less than 1
        if (isNaN(winningScore) || winningScore < 1) winningScore = 10;
        if (model.scoreL >= winningScore || model.scoreR >= winningScore) return STATE.GAMEOVER;
    }
    return STATE.PLAYING;
}

function startGamePaused() {
    // The model is constructed with a state of STARTUP and a ball with initial velocity.
    
    // 1. Manually transition to a paused state.
    model.state = STATE.PAUSED;

    // 2. Save the initial velocity that was set in resetBall() and zero it out.
    model.pausedVelocity = [model.ball.velx, model.ball.vely];
    model.ball.velx = 0;
    model.ball.vely = 0;

    // 3. Draw the initial screen. The game loop is not running yet.
    draw_game(model);
}

startGamePaused();
