const grid = document.getElementById("sudoku-grid");
const message = document.getElementById("message");
let originalPuzzle = [];

const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

//Create Sudoku grid
function createGrid(data) {
    grid.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric";
            input.maxLength = 1;
            input.className = "cell";
            input.dataset.row = row;
            input.dataset.col = col;
            if (data[row][col] !== 0) {
                input.value = data[row][col];
                input.classList.add("given");
                input.readOnly = true;
            }
            input.addEventListener("input", () => {
                input.value = input.value.replace(/[^1-9]/g, "");
                input.classList.remove("invalid");
            });

            grid.appendChild(input);
        }
    }
}

function getBoard() {
    const board = [];
    for (let row = 0; row < 9; row++) {
        const currentRow = [];
        for (let col = 0; col < 9; col++) {
            const cell = grid.children[row * 9 + col];
            currentRow.push(Number(cell.value) || 0);
        }
        board.push(currentRow);
    }
    return board;
}

//Check whether a number is valid
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
        if (board[x][col] === num) {
            return false;
        }
    }
    const startRow = 3 * Math.floor(row / 3);
    const startCol = 3 * Math.floor(col / 3);
        
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) {
                return false;
            }
        }
    }
    return true;
}

// Backtracking algorithm to solve the Sudoku puzzle
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            
            if (board[row][col] === 0) {
                
                for (let num = 1; num <= 9; num++) {
                    
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Validate the current board state
function validateBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = board[row][col];
            if (num === 0){
                continue;
            } 
            board[row][col] = 0;
            
            const valid = isValid(board, row, col, num);
            board[row][col] = num;
            if (!valid) {
                return false;
            }
        }
    }
    return true;
}

// Display solved board
function displayBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = grid.children[row * 9 + col];
            cell.value = board[row][col];
            cell.classList.remove("invalid");
        }
    }
}

//Solve Button
document.getElementById("solve").addEventListener("click", () => {
    const board = getBoard();
    if (!validateBoard(board)) {
        message.textContent = "Invalid Puzzle! Check duplicate numbers.";
        return;
    }

    const solution = board.map(row => [...row]);

    if (solveSudoku(solution)) {
        displayBoard(solution);
        message.textContent = "Sudoku solved successfully!";
    } else {
        message.textContent = "No solution exists for this puzzle.";
    }
});

// Validate Button
document.getElementById("validate").addEventListener("click", () => {
    
    const board = getBoard();
    
    if (!validateBoard(board)) {
        message.textContent = "Invalid Sudoku entries!";
        return;
    }
    message.textContent = "No conflicting numbers found!";
    
});

// Reset Button
document.getElementById("reset").addEventListener("click", () => {
    createGrid(originalPuzzle);
    message.textContent = "Puzzle reset successfully";
});

// Clear Button
document.getElementById("clear").addEventListener("click", () => {
    createGrid(Array.from({length: 9}, () => Array(9).fill(0)));
    message.textContent = "Grid Cleared.";
});

// Initialize the grid with the original puzzle
originalPuzzle = puzzle.map(row => [...row]);
createGrid(originalPuzzle);