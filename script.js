document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid-container');
    const result = document.getElementById('result');
    const flagsLeft = document.getElementById('flagsLeft');
    const width = 10;
    const bombAmount = 10;
    let squares = [];
    let isGameOver = false;
    let flags = 0;

    // Create Board
    function createBoard() {
        // Place bombs randomly
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

        // Create each cell
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(gameArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // Normal click
            square.addEventListener('click', function (e) {
                click(square);
            });

            // Right-click to flag
            square.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                addFlag(square);
            });
        }

        // Add numbers to squares
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                // Check all neighboring squares
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;

                squares[i].setAttribute('data', total);
            }
        }
    }

    createBoard();

    // Click on square actions
    function click(square) {
        let currentId = square.id;
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                checkForWin();
                return;
            }
            square.classList.add('checked');
            checkForWin();
        }
    }

    // Add Flag
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombAmount - flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombAmount - flags;
            }
        }
    }

    // Check for win
    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (squares[i].classList.contains('checked') && !squares[i].classList.contains('bomb')) {
                matches++;
            }
        }
        if (matches === width * width) {
            result.innerHTML = 'YOU WIN!';
            isGameOver = true;
        }
    }

    // Game Over
    function gameOver() {
        result.innerHTML = 'YOU LOSE!';
        isGameOver = true;

        // Show all bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.add('checked');
            }
        });
    }
});
