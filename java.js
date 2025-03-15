const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 690; 
canvas.height = 690; 

const tileSize = 30;
const speed = 2.5;
const turnLeeway = 6; // Allows slight misalignment for smoother turning

// Maze layout (1 = Wall, 0 = Path)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];


// Pac-Man properties
const pacman = {
    x: 1 * tileSize, 
    y: 1 * tileSize, 
    dx: 0, 
    dy: 0
};

// Function to check if next move is valid
function canMove(newX, newY) {
    let leftTile = Math.floor(newX / tileSize);
    let rightTile = Math.floor((newX + tileSize - 1) / tileSize);
    let topTile = Math.floor(newY / tileSize);
    let bottomTile = Math.floor((newY + tileSize - 1) / tileSize);

    return (
        maze[topTile][leftTile] !== 1 &&
        maze[topTile][rightTile] !== 1 &&
        maze[bottomTile][leftTile] !== 1 &&
        maze[bottomTile][rightTile] !== 1
    );
}

let nextDx = 0, nextDy = 0; // Store intended direction

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        nextDx = 0; nextDy = -1;
    } else if (event.key === "ArrowDown") {
        nextDx = 0; nextDy = 1;
    } else if (event.key === "ArrowLeft") {
        nextDx = -1; nextDy = 0;
    } else if (event.key === "ArrowRight") {
        nextDx = 1; nextDy = 0;
    }
});

function movePacman() {
    let newX = pacman.x + nextDx * speed;
    let newY = pacman.y + nextDy * speed;

    // If the intended direction is valid, switch to it
    if (canMove(newX, newY)) {
        pacman.dx = nextDx;
        pacman.dy = nextDy;
    }

    // Continue moving in the last valid direction
    newX = pacman.x + pacman.dx * speed;
    newY = pacman.y + pacman.dy * speed;

    if (canMove(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
    }
}

// Check if Pac-Man is close enough to a corner to allow a turn
function isNearCorner(x, y, dx, dy) {
    let gridX = Math.round(x / tileSize) * tileSize;
    let gridY = Math.round(y / tileSize) * tileSize;

    return (
        Math.abs(x - gridX) < turnLeeway ||
        Math.abs(y - gridY) < turnLeeway
    );
}

// Snap Pac-Man to the grid to allow smooth turns
function snapToGrid() {
    pacman.x = Math.round(pacman.x / tileSize) * tileSize;
    pacman.y = Math.round(pacman.y / tileSize) * tileSize;
}

// Draw the maze
function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            ctx.fillStyle = maze[row][col] === 1 ? "blue" : "black";
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

// Draw Pac-Man
function drawPacman() {
    ctx.beginPath();
    ctx.arc(
        pacman.x + tileSize / 2, 
        pacman.y + tileSize / 2, 
        tileSize / 2.5, 0.2 * Math.PI, 1.8 * Math.PI
    );
    ctx.lineTo(pacman.x + tileSize / 2, pacman.y + tileSize / 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

// Update game frame
function update() {
    movePacman();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacman();
    requestAnimationFrame(update);
}

update();