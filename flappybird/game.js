window.addEventListener("keydown", keydown);

/**
 * Sets a browser cookie.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Gets a cookie value by name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value or null if not found.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions for clarity. These should match your <canvas> element's size.
canvas.width = 400; // A more standard width for this type of game
canvas.height = 600;

// Game constants for easy tuning
const COLUMN_WIDTH = 50;
const COLUMN_GAP = 150; // The vertical space for the bird to fly through
const COLUMN_SPEED = 2; // How fast columns move to the left
const SPAWN_INTERVAL = 2000; // Time in milliseconds between new column pairs

// Bird constants
const BIRD_RADIUS = 15;
const BIRD_START_X = canvas.width / 4;
const BIRD_START_Y = canvas.height / 2;
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8; // The upward velocity when the bird flaps

let columns = [];
let gameOver = false; // Game state flag
let score = 0;
let highScore = getCookie("flappyBirdHighScore") || 0;

/**
 * Represents the player's bird.
 */
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = BIRD_RADIUS;
        this.velocityY = 0; // The bird's vertical speed
    }

    // Apply gravity to the bird
    update() {
        this.velocityY += GRAVITY;
        this.y += this.velocityY;
        // The game should end if the bird hits the top or bottom, but we'll add that later.

    }

    // Make the bird "flap" upwards
    flap() {
        this.velocityY = FLAP_STRENGTH;
    }
}
/**
 * Represents a single column obstacle.
 */
class Column {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.passed = false; // To track if the bird has passed this column for scoring
    }
}

function keydown (event) {
    const key = event.key;
    if (key === " ") {
        if (gameOver) {
            // If the game is over, restart it
            resetGame();
        } else {
            // Otherwise, flap the bird
            bird.flap();
        }
    }
}

const bird = new Bird(BIRD_START_X, BIRD_START_Y);

/**
 * Resets the game to its initial state.
 */
function resetGame() {
    // Reset bird's position and velocity
    bird.x = BIRD_START_X;
    bird.y = BIRD_START_Y;
    bird.velocityY = 0;

    // Clear all columns
    columns = [];

    // Reset score
    score = 0;

    // Reset game state
    gameOver = false;
}

/**
 * Checks for collisions between the bird and the environment.
 * @returns {boolean} - True if a collision occurred, false otherwise.
 */
function checkCollisions() {
    // Top and bottom boundary collision
    if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
        return true;
    }

    // Column collision (Circle vs. Rectangle)
    for (const column of columns) {
        const closestX = Math.max(column.x, Math.min(bird.x, column.x + column.width));
        const closestY = Math.max(column.y, Math.min(bird.y, column.y + column.height));

        const distanceX = bird.x - closestX;
        const distanceY = bird.y - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
  
        if (distanceSquared < (bird.radius * bird.radius)) {
            return true;
        }
    }

    return false;
}

/**
 * Generates a pair of columns (top and bottom) with a gap in between.
 * The new columns are added to the global `columns` array.
 */
function generateColumnPair() {
    const minHeight = 50;
    const maxHeight = canvas.height - COLUMN_GAP - minHeight;

    // Calculate a random height for the top column
    const topColumnHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    // Calculate the position and height for the bottom column based on the top one
    const bottomColumnY = topColumnHeight + COLUMN_GAP;
    const bottomColumnHeight = canvas.height - bottomColumnY;

    // Add the top column, starting at the right edge of the canvas
    columns.push(new Column(canvas.width, 0, COLUMN_WIDTH, topColumnHeight));

    // Add the bottom column
    columns.push(new Column(canvas.width, bottomColumnY, COLUMN_WIDTH, bottomColumnHeight));
}
 
/**
 * Updates the state of all game objects.
 */
function update() {
    // Update bird's position based on gravity
    bird.update();

    // Move all columns to the left
    for (const column of columns) {
        column.x -= COLUMN_SPEED;

        // Check for passing a column to score. We only check the top column of a pair.
        if (column.y === 0 && !column.passed && bird.x > column.x + column.width) {
            score++;
            column.passed = true;
        }
    }

    // Remove columns that have moved off-screen to the left to save memory
    columns = columns.filter(column => column.x + column.width > 0);

    if (checkCollisions()) {
        gameOver = true;
        // Check for new high score and save it in a cookie
        if (score > highScore) {
            highScore = score;
            setCookie("flappyBirdHighScore", highScore, 365); // Save for a year
        }
    }
}



/**
 * Draws everything on the canvas.
 */
function draw() {
    // Clear the entire canvas for the new frame. The background is set in styles.css.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all the columns
    ctx.fillStyle = "green";
    for (const column of columns) {
        ctx.fillRect(column.x, column.y, column.width, column.height);
    }

    // Draw the bird
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke(); // Adds a nice black outline

    // Draw score during gameplay
    ctx.fillStyle = "white";
    ctx.font = "50px 'Courier New', Courier, monospace";
    ctx.textAlign = "center";
    if (!gameOver) {
        ctx.fillText(score, canvas.width / 2, 80);
    }

    // If game is over, draw the game over screen
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "50px 'Courier New', Courier, monospace";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 100);

        ctx.font = "30px 'Courier New', Courier, monospace";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 50);

        ctx.font = "20px 'Courier New', Courier, monospace";
        ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 120);
    }
}

/**
 * The main game loop, powered by requestAnimationFrame for smooth animation.
 */
function gameLoop() {
    if (!gameOver) {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// --- Game Start ---

// Use setInterval to generate a new pair of columns at a regular interval.
setInterval(generateColumnPair, SPAWN_INTERVAL);

// Start the game's animation and rendering loop.
gameLoop();
