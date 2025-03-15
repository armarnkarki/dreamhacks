const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 690; 
canvas.height = 690; 

const tileSize = 30;

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
moonImage.src = 'moon.jpg';
const starImage = new Image();
starImage.src = 'star.jpg';

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

            // Check for collisions with moons
            for (let i = moonPositions.length - 1; i >= 0; i--) {
                if (checkCollision(moonPositions[i])) {
                    moonPositions.splice(i, 1); // Remove the moon from the array
                }
            }

            // Check for collision with the star
            if (checkCollision(starPosition)) {
                starPosition.x = -1; // Move the star out of the maze
                starPosition.y = -1;
            }
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
    drawItems(); // Draw the items
    requestAnimationFrame(update);
}

update();
