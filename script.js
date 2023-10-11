document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('grid');
    const gameResultDiv = document.getElementById('game-result');
    const gridSize = 8;
    const mineCount = 10;
    let revealedCells = 0;

    // Generate mines in random positions
    const mines = new Array(gridSize).fill(false).map(() => new Array(gridSize).fill(false));
    for (let i = 0; i < mineCount; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * gridSize);
            col = Math.floor(Math.random() * gridSize);
        } while (mines[row][col]);
        mines[row][col] = true;
    }

    // Create grid cells
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            grid.appendChild(cell);

            cell.addEventListener('click', function() {
                if (!mines[row][col]) {
                    const mineCount = countAdjacentMines(row, col);
                    cell.textContent = mineCount > 0 ? mineCount : '';
                    cell.classList.add('revealed');
                    revealedCells++;

                    if (revealedCells === gridSize * gridSize - mineCount) {
                        gameResultDiv.textContent = 'You won!';
                    }
                } else {
                    cell.textContent = '💣';
                    cell.classList.add('mine');
                    gameResultDiv.textContent = 'Game Over!';
                    revealAllMines();
                }

                cell.removeEventListener('click', arguments.callee);
            });
        }
    }

    // Function to count adjacent mines
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && mines[newRow][newCol]) {
                    count++;
                }
            }
        }
        return count;
    }

    // Function to reveal all mines when the game is ov
    function revealAllMines() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = cell.parentElement.rowIndex;
            const col = cell.cellIndex;
            if (mines[row][col]) {
                cell.textContent = '💣';
                cell.classList.add('mine');
            }
        });
    }
});


