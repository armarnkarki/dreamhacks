const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 560;
canvas.height = 620;

const tileSize = 40;

// Maze layout (1 = Wall, 0 = Path)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,1,1,1,0,1,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pac-Man properties
const pacman = {
    x: 1, // Starting column (1)
    y: 1, // Starting row (1)
    size: tileSize / 2,
    speed: 1,
    dx: 0, // Direction X
    dy: 0  // Direction Y
};

// Draw the maze
function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "blue"; 
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

// Draw Pac-Man
function drawPacman() {
    ctx.beginPath();
    ctx.arc(
        pacman.x * tileSize + tileSize / 2, 
        pacman.y * tileSize + tileSize / 2, 
        pacman.size, 0.2 * Math.PI, 1.8 * Math.PI
    );
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

// Move Pac-Man by one block
function movePacman() {
    let newX = pacman.x + pacman.dx;
    let newY = pacman.y + pacman.dy;

    // Check if the new position is within the maze bounds and not a wall
    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
        if (maze[newY][newX] !== 1) {
            pacman.x = newX;
            pacman.y = newY;
        }
    }
}

// Handle keydown events (move Pac-Man one block)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        pacman.dx = 0;
        pacman.dy = -1;
        movePacman(); // Move one block
    } else if (event.key === "ArrowDown") {
        pacman.dx = 0;
        pacman.dy = 1;
        movePacman(); // Move one block
    } else if (event.key === "ArrowLeft") {
        pacman.dx = -1;
        pacman.dy = 0;
        movePacman(); // Move one block
    } else if (event.key === "ArrowRight") {
        pacman.dx = 1;
        pacman.dy = 0;
        movePacman(); // Move one block
    }
});

// Update game frame
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacman();
    requestAnimationFrame(update);
}

update();
