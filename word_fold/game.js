const boards = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["K", "E", "O", "W", "R"],
            ["A", "N", "L", "P", "I"],
            ["E", "S", "F", "A", "T"],
            ["L", "E", "U", "A", "R"],
            ["G", "A", "G", "A", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["C", "A", "N", "A", "N"],
            ["H", "R", "Y", "A", "A"],
            ["E", "R", "R", "Y", "B"],
            ["P", "E", "A", "A", "P"],
            ["F", "I", "G", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
    {
        cells: [
            ["W", "O", "N", "K", "N"],
            ["M", "A", "E", "X", "R"],
            ["I", "E", "S", "F", "E"],
            ["N", "D", "I", "B", "A"],
            ["D", "I", "W", "Y", "L"]],
        words: ["IDEA", "MIND", "KNOW", "REAL", "WISE"]
    },
    {
        cells: [
            ["M", "A", "V", "N", "S"],
            ["R", "S", "E", "E", "U"],
            ["A", "R", "T", "H", "E"],
            ["M", "O", "J", "U", "R"],
            ["O", "N", "P", "I", "T"]],
        words: ["MARS", "VENUS", "EARTH", "MOON", "JUPITER"]
    },
]

function make_cell_list() {
    let cells = [...document.getElementById("cell-holder").children];
    let cell_board = [];
    for (let i = 0; i < 25; i += 5) {
        cell_board.push(cells.slice(i, i + 5))
    }
    return cell_board;
}

function setup_game(starting_cells) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = starting_cells[y][x];
        }
    }
}

const CELLS = make_cell_list();
const WORDS_DISPLAY = document.getElementById("words");
let selected_x = -1;
let selected_y = -1;
let current_board;
const END_GAME_SCREEN = document.getElementById('end-game-screen');
const END_GAME_MESSAGE = document.getElementById('end-game-message');
 
/**
 * Initializes the game with a welcome animation on first load.
 */
function initialize_game() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (!welcomeScreen) {
        console.error("Welcome screen element not found! Starting game immediately.");
        new_game();
        return;
    }
    // Wait a moment, then start the slide up animation and load the game board.
    setTimeout(() => {
        welcomeScreen.classList.add('slide-up');
        // Call new_game() here so the board is ready as the welcome screen moves away.
        new_game();
    }, 500); // 0.5 second delay before sliding
    // After the slide animation is complete (1s), just hide the element.
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
    }, 1500); // 0.5s delay + 1s slide = 1.5s total
}

function new_game() {
    let rand = Math.floor(Math.random() * boards.length);
    // Create a copy of the board, especially the words list, so we don't
    // modify the original `boards` array for subsequent games.
    current_board = { ...boards[rand], words: [...boards[rand].words] };
    setup_game(current_board.cells)
    WORDS_DISPLAY.innerHTML = "Words to spell: " + current_board.words.join(", ")
    document.getElementById("cell-holder").style.pointerEvents = "auto";
}

/**
 * Checks if there are any possible moves left on the board.
 * A move is possible if there are at least two adjacent (non-diagonal) cells with letters.
 * @returns {boolean} True if moves are possible, false otherwise.
 */
function are_moves_possible() {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            if (CELLS[y][x].innerHTML.length > 0) {
                // Check right neighbor
                if (x < 4 && CELLS[y][x + 1].innerHTML.length > 0) {
                    return true;
                }
                // Check bottom neighbor
                if (y < 4 && CELLS[y + 1][x].innerHTML.length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function show_end_screen(message) {
    if (END_GAME_MESSAGE) END_GAME_MESSAGE.textContent = message;
    if (END_GAME_SCREEN) END_GAME_SCREEN.classList.add('visible');

    // After a delay, hide the end screen and reset the board for a smooth transition.
    setTimeout(() => {
        // Start sliding the end screen up.
        if (END_GAME_SCREEN) {
            END_GAME_SCREEN.classList.remove('visible'); // Trigger slide-up animation
        }
        // At the same time, reset the board in the background so it's ready
        // to be revealed as the screen slides away.
        new_game();
    }, 2000); // Wait 2 seconds for the player to read the message.
}

/**
 * Creates a confetti explosion originating from a specific HTML element.
 * @param {HTMLElement} element The element to originate the confetti from.
 */
function trigger_confetti(element) {
    // Silently exit if the confetti library isn't loaded for some reason.
    if (typeof confetti !== 'function') {
        return;
    }

    const rect = element.getBoundingClientRect();
    const origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
    };

    confetti({
        particleCount: 100,
        spread: 70,
        origin: origin
    });
}
/**
 * Checks all cells to see if they form a word from the word list.
 * If a word is found, it's removed from the list and the cell is cleared.
 * Also checks for win/loss conditions.
 */
function check_words() {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell = CELLS[y][x];
            const cell_content = cell.innerHTML;
            const word_index = current_board.words.indexOf(cell_content);

            if (word_index > -1) {
                // Trigger confetti effect from the center of the cell
                trigger_confetti(cell);

                // Remove the word from the list
                current_board.words.splice(word_index, 1);

                // Update the display
                WORDS_DISPLAY.innerHTML = "Words to spell: " + current_board.words.join(", ");

                // Clear the cell that contained the word
                cell.innerHTML = "";
            }
        }
    }

    // Check for win condition
    if (current_board.words.length === 0) {
        WORDS_DISPLAY.innerHTML = "You win! Congratulations!";
        document.getElementById("cell-holder").style.pointerEvents = "none";
        show_end_screen("You Win!");
        return;
    }

    // Check for lose condition (no more moves possible AND words are left)
    if (!are_moves_possible() && current_board.words.length > 0) {
        WORDS_DISPLAY.innerHTML = "No more moves possible. You lose!";
        document.getElementById("cell-holder").style.pointerEvents = "none";
        show_end_screen("You Lose!");
        return;
    }
}



function move(x, y) {
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = ""
    select(x, y);
    check_words();
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;
}

function select(x, y) {
    if (CELLS[y][x].innerHTML.length > 0) {
        if (selected_x >= 0 && selected_y >= 0)
            CELLS[selected_y][selected_x].classList.remove("selected");
        CELLS[y][x].classList.add("selected");
        selected_y = y;
        selected_x = x;
    }
}

function is_close(a, b) {
    return Math.abs(a - b) <= 1
}

function can_move(x, y) {
    let can_move = is_close(selected_x, x) && selected_y == y || is_close(selected_y, y) && selected_x == x;

    return selected_x >= 0 && selected_y >= 0 && can_move && CELLS[y][x].innerHTML.length > 0
}

function on_click(x, y) {
    if (selected_x == x && selected_y == y) {
        unselect(x, y)
    }
    else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
}

initialize_game();