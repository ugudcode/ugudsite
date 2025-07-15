
//turn to decide who goes first and who goes next
let turn = 0;
// Is the AI enabled?
let cpu = false;
//grabs the container
let container = document.getElementById("game-container");
//grabs the containers children
let cell = container.children;
//gives the cells two possible states: locked or unlocked
let cellState = {LOCKED: 0, UNLOCKED: 1};
//header
let header = document.getElementById("title");




function reset() {
    // Reset turn counter
    turn = 0;
    for (let i = 0; i < cell.length; i++) {
        cell[i].cellState = cellState.UNLOCKED;
        cell[i].innerHTML = "";
        cell[i].classList.remove('x-cell', 'o-cell'); // Clear player classes
    }
}

function onmouseclick(number) {
    let chosen = cell[number];
    header.innerHTML = "AI Turn";
    // If cell is locked or it's the AI's turn, do nothing.
    if (chosen.cellState === cellState.LOCKED || (cpu && turn % 2 === 1)) {
        return;
    }

    // Place mark based on whose turn it is.
    // In CPU mode, the human is always 'O'.
    // In 2P mode, turns alternate.
    if (turn % 2 === 0) {
        if (!cpu) {
            header.innerHTML = "Player 1 Turn";
        }
        chosen.innerHTML = "O";
        chosen.classList.add('o-cell');
    } else {
        if (!cpu) {
            header.innerHTML = "Player 2 Turn";
        }
        chosen.innerHTML = "X";
        chosen.classList.add('x-cell');
    }
    chosen.cellState = cellState.LOCKED;
    turn++;

    const gameEnded = checkforwin();

    // If playing against CPU and the game is not over, trigger AI move.
    // The AI is 'X', so it moves on odd turns.
    if (cpu && !gameEnded && turn % 2 === 1) {
        setTimeout(cpuMove, 500);
    }
}



function cpuMove() {
    header.innerHTML = "Player 1 Turn";
    // Guard against race conditions or unexpected calls
    if (turn >= 9 || turn % 2 !== 1) {
        return;
    }

    // Find all available (unlocked) cells
    let availableCells = [];
    for (let i = 0; i < cell.length; i++) {
        if (cell[i].cellState === cellState.UNLOCKED) {
            availableCells.push(i);
        }
    }

    if (availableCells.length === 0) return;

    // Select a random cell from the available ones
    const randomChoiceIndex = Math.floor(Math.random() * availableCells.length);
    const chosenCellIndex = availableCells[randomChoiceIndex];

    // Make the AI's move
    cell[chosenCellIndex].innerHTML = "X"; // AI is 'X'
    cell[chosenCellIndex].classList.add('x-cell');
    cell[chosenCellIndex].cellState = cellState.LOCKED;
    turn++;
    checkforwin();
}

function togglecpu() {
    cpu = !cpu;
    reset(); // Restart the game when toggling AI
}

function checkforwin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (cell[a].innerHTML && cell[a].innerHTML === cell[b].innerHTML && cell[a].innerHTML === cell[c].innerHTML) {
            header.innerHTML = cell[a].innerHTML + " wins!";
            for (let j = 0; j < cell.length; j++) {
                cell[j].cellState = cellState.LOCKED;
            }
            return true; // Game over
        }
    }

    if (turn === 9) {
        header.innerHTML = "It's a draw!";
        return true; // Game over
    }

    return false; // Game not over
}

reset();