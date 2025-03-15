const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 690; 
canvas.height = 690; 

const tileSize = 30;
const speed = 1;
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


// Images
const moonImage = new Image();
moonImage.src = 'moon.png';
const starImage = new Image();
starImage.src = 'star.png';

// Check when images are loaded
let imagesLoaded = 0;
const totalImages = 2; // 2 images: moon and star

function imageLoaded() {
    imagesLoaded++;
    console.log("Image Loaded", imagesLoaded); // Debugging line
    if (imagesLoaded === totalImages) {
        update(); // Start game once all images are loaded
    }
}

// Function to check for collision between Pac-Man and an item
function checkCollision(item) {
    return pacman.x === item.x && pacman.y === item.y;
}

moonImage.onload = imageLoaded;
starImage.onload = imageLoaded;

let score = 0;

// // Function to display the score
// function displayScore() {
//     ctx.fillStyle = "white";
//     ctx.font = "20px Arial";
//     ctx.fillText("Score: " + score, 10, 20);
// }

const pacmanStart = { x: 1, y: 1 };
// Function to generate random coordinates for the items
function getRandomPosition() {
    let x, y;
    do {
        x = Math.floor(Math.random() * maze[0].length);
        y = Math.floor(Math.random() * maze.length);
    } while (maze[y][x] === 1 || (x === pacmanStart.x && y === pacmanStart.y));  // Avoid wall and Pac-Man's starting position
    return { x, y };
}

// Randomly generate positions for two moons and one star
const moonPositions = [getRandomPosition(), getRandomPosition()];
const starPosition = getRandomPosition();

// Draw items (moons and star)
function drawItems() {
    // Draw two moons
    moonPositions.forEach(position => {
        ctx.drawImage(moonImage, position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    });

    // Draw one star if it's still in the maze
    if (starPosition.x !== -1 && starPosition.y !== -1) {
        ctx.drawImage(starImage, starPosition.x * tileSize, starPosition.y * tileSize, tileSize, tileSize);
    }
}



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

function checkCollision(item) {
    return (
        pacman.x < item.x * tileSize + tileSize &&
        pacman.x + tileSize > item.x * tileSize &&
        pacman.y < item.y * tileSize + tileSize &&
        pacman.y + tileSize > item.y * tileSize
    );
}

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

    // Check for collisions with moons
    for (let i = 0; i < moonPositions.length; i++) {
        if (checkCollision(moonPositions[i])) {
            score += 10; // Increase score for collecting a moon
            moonPositions.splice(i, 1); // Remove the moon from the array
            i--; // Adjust index after removal
        }
    }

    // Check for collision with the star
    if (checkCollision(starPosition)) {
        score += 50; // Increase score for collecting the star
        starPosition.x = -1; // Remove the star from the maze
        starPosition.y = -1; // Remove the star from the maze
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
    drawItems(); // Draw the items
    // displayScore(); // Display the score
    requestAnimationFrame(update);
}

update();