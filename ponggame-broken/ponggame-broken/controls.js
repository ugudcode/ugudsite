window.addEventListener("keydown", keyDown);
function keyDown(event) {
    const key = event.code;
    // console.log(`KEYDOWN: ${key}`);
    canvas.classList.add("floating");

    switch (key) {
        case "ArrowUp":
            model.paddleR.vely = -PADDLE_VELOCITY;
            break;
        case "ArrowDown":
            model.paddleR.vely = PADDLE_VELOCITY;
            break;
        case "KeyW":
            model.paddleL.vely = -PADDLE_VELOCITY;
            break;
        case "KeyS":
            model.paddleL.vely = PADDLE_VELOCITY;
            break;
        case "Space":
            pauseGame();
            break;
        case "End":
            model.resetGame();
            onTick();
            break;
    }
}

window.addEventListener("keyup", keyUp);
function keyUp(event) {
    const key = event.code;
    // console.log(`KEYUP: ${key}`);
    canvas.classList.remove("floating");

    switch (key) {
        case "ArrowUp":
        case "ArrowDown":
            model.paddleR.vely = 0;
            break;
        case "KeyW":
        case "KeyS":
            model.paddleL.vely = 0;
            break;
    }
}

function pauseGame() {
    // If the game is over or just starting, pausing should do nothing.
    if (model.state === STATE.GAMEOVER || model.state === STATE.STARTUP) {
        return;
    }

    // If the game is running, stop the loop and pause the game.
    if (model.state === STATE.PLAYING) {
        clearTimeout(model.intervalID); // Stop the game loop.
        model.togglePause(); // This sets state to PAUSED and saves velocity.
        draw_game(model); // Manually draw the paused screen once.
    } else if (model.state === STATE.PAUSED) {
        model.togglePause(); // This sets state to PLAYING and restores velocity.
        onTick(); // Restart the game loop.
    }
}

function resetGame() {
    // 1. Stop any active game loop
    clearTimeout(model.intervalID);
    model.resetGame();
    updateScore(model);
    startGamePaused();
}

function set_cpu(event) {
    model.is_cpu = event.target.checked;
}