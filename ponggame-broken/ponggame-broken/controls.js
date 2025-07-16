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
        case "ShiftLeft":
            model.paddleL.isCharging = true;
            break;
        case "ShiftRight":
            model.paddleR.isCharging = true;
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
        case "ShiftLeft":
            model.paddleL.isCharging = false;
            break;
        case "ShiftRight":
            model.paddleR.isCharging = false;
            break;
    }
}

function pauseGame() {
    // Toggle pause only works if the game is actively playing or already paused.
    if (model.state === STATE.PLAYING) {
        clearTimeout(model.intervalID); // Stop the game loop
        model.togglePause();
        draw_game(model); // Draw the "PAUSED" overlay
    } else if (model.state === STATE.PAUSED) {
        model.togglePause();
        onTick(); // Restart the game loop
    } else {
        // If the game is over or hasn't started, pressing space should start a new game.
        resetGame(true); // reset and start immediately
    }
}

function resetGame(startImmediately = false) {
    clearTimeout(model.intervalID);
    model.resetGame(); // Resets model state to PAUSED
    updateScore(model);
    draw_game(model); // Draw the initial screen
    if (startImmediately) {
        model.togglePause(); // Set to PLAYING
        onTick();
        return;
    }
}

function set_cpu(event) {
    model.is_cpu = event.target.checked;
    // When toggling the CPU, we are no longer in simulation mode.
    model.is_simulation = false;
}

function startSimulation() {
    resetGame(true); // Reset and start the game immediately
    model.is_simulation = true;
    model.is_cpu = true; // Both paddles will use CPU logic.
}