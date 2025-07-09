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
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
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

new_game();


function new_game() {
    let rand = Math.floor(Math.random() * boards.length);
    current_board = boards[rand];
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
        setTimeout(() => alert("You win!"), 10);
        document.getElementById("cell-holder").style.pointerEvents = "none";
        setTimeout(() => new_game(), 3000);
        return;
    }

    // Check for lose condition (no more moves possible AND words are left)
    if (!are_moves_possible() && current_board.words.length > 0) {
        WORDS_DISPLAY.innerHTML = "No more moves possible. You lose!";
        setTimeout(() => alert("You lose! No more moves possible."), 10);
        document.getElementById("cell-holder").style.pointerEvents = "none";
        setTimeout(() => new_game(), 3000);
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