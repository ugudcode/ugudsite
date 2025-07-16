let model = new Model();

function onTick() {
    switch (model.state) {
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
    // In simulation mode, both paddles are CPUs. Otherwise, check the CPU toggle for the right paddle.
    model.paddleL.move(model.is_simulation, model.ball);
    model.paddleR.move(model.is_cpu, model.ball);

    // Handle paddle charging
    if (model.paddleL.isCharging) {
        model.paddleL.charge = Math.min(MAX_CHARGE, model.paddleL.charge + CHARGE_RATE);
    }
    // Right paddle charges if it's a CPU (in regular or sim mode) or a human player holding the charge key.
    if (model.is_cpu || model.paddleR.isCharging) {
        model.paddleR.charge = Math.min(MAX_CHARGE, model.paddleR.charge + CHARGE_RATE);
    }

    // If not a human player, explicitly set isCharging for paddleR based on its own AI logic.
    if (model.is_cpu) {
        model.paddleR.isCharging = model.paddleR.isCharging;
    }


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

// Initial draw of the game board. It will be in its default PAUSED state.
draw_game(model);
