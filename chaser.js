// Load chaser image
import './java.js';
const chaserImage = new Image();
chaserImage.src = 'chaser.png';

// Chaser properties
const chaser = {
    x: 21 * tileSize, // Starting position
    y: 21 * tileSize, 
    dx: 0, 
    dy: 0
};

let nextChaserDx = 0, nextChaserDy = 0; // Store intended direction for chaser

// Event listeners for WASD keys
document.addEventListener("keydown", (event) => {
    if (event.key === "w") {
        nextChaserDx = 0; nextChaserDy = -1;
    } else if (event.key === "s") {
        nextChaserDx = 0; nextChaserDy = 1;
    } else if (event.key === "a") {
        nextChaserDx = -1; nextChaserDy = 0;
    } else if (event.key === "d") {
        nextChaserDx = 1; nextChaserDy = 0;
    }
});

function moveChaser() {
    let newX = chaser.x + nextChaserDx * speed;
    let newY = chaser.y + nextChaserDy * speed;

    // If the intended direction is valid, switch to it
    if (canMove(newX, newY)) {
        chaser.dx = nextChaserDx;
        chaser.dy = nextChaserDy;
    }

    // Continue moving in the last valid direction
    newX = chaser.x + chaser.dx * speed;
    newY = chaser.y + chaser.dy * speed;

    if (canMove(newX, newY)) {
        chaser.x = newX;
        chaser.y = newY;
    }
}

// Draw chaser
function drawChaser() {
    ctx.drawImage(chaserImage, chaser.x, chaser.y, tileSize, tileSize);
}

chaserImage.onload = imageLoaded;