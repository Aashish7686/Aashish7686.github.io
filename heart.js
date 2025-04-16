// Get the canvas and its context
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Parametric equations for the heart shape
function x(t) {
    return 16 * Math.pow(Math.sin(t), 3);
}

function y(t) {
    return 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
}

// Constants for the heart shape
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 15;  // Smaller scale for a smaller heart
const maxT = Math.PI * 2; // One full rotation
const numPoints = 1000;  // Number of points for the heart shape

// Animation parameters
let currentT = 0;  // Parameter to animate the heart shape
const animationDuration = 5;  // Set to 5 seconds for completing the animation
let drawingComplete = false; // Flag to know when drawing is complete

// Function to draw the grid background
function drawGrid() {
    ctx.strokeStyle = 'green';  // Green grid lines
    ctx.lineWidth = 0.5;

    // Draw horizontal grid lines
    for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw vertical grid lines
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
}

// Function to draw the heart shape with two criss-cross lines (initial drawing)
function drawHeart() {
    ctx.beginPath();
    // First red line (original heart shape)
    for (let i = 0; i <= currentT; i += (maxT / numPoints)) {
        const xCoord = scale * x(i) + centerX;
        const yCoord = -scale * y(i) + centerY;  // Invert Y for proper orientation

        // Apply a slight randomness to make the lines appear sketchy
        const randomness = Math.sin(i * 10) * 2; // Wavy effect for drawing
        const xRandom = xCoord + randomness;
        const yRandom = yCoord + randomness;

        if (i === 0) {
            ctx.moveTo(xRandom, yRandom);
        } else {
            ctx.lineTo(xRandom, yRandom);
        }
    }

    // First red heart outline (RGB red color)
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';  // Make the lines appear more natural
    ctx.stroke();
    
    // Second red line (for criss-cross effect)
    ctx.beginPath();
    for (let i = 0; i <= currentT; i += (maxT / numPoints)) {
        const xCoord = scale * x(i) + centerX;
        const yCoord = -scale * y(i) + centerY;

        // Apply slight randomness to create a criss-cross effect
        const randomness = Math.sin(i * 10 + Math.PI) * 2;  // Slight offset for criss-cross
        const xRandom = xCoord + randomness;
        const yRandom = yCoord + randomness;

        if (i === 0) {
            ctx.moveTo(xRandom, yRandom);
        } else {
            ctx.lineTo(xRandom, yRandom);
        }
    }

    // Second red criss-cross line (RGB red color)
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to keep both lines wiggling continuously
function drawWigglingLines() {
    ctx.beginPath();
    // First red line (original heart shape with constant wiggle)
    for (let i = 0; i <= maxT; i += (maxT / numPoints)) {
        const xCoord = scale * x(i) + centerX;
        const yCoord = -scale * y(i) + centerY;

        // Apply a continuous randomness to make the first line wiggle
        const randomness = Math.sin(i * 10 + Date.now() * 0.005) * 2; // Wiggling effect
        const xRandom = xCoord + randomness;
        const yRandom = yCoord + randomness;

        if (i === 0) {
            ctx.moveTo(xRandom, yRandom);
        } else {
            ctx.lineTo(xRandom, yRandom);
        }
    }

    // First red heart outline (wiggling line)
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    // Second red criss-cross line (with continuous wiggle)
    for (let i = 0; i <= maxT; i += (maxT / numPoints)) {
        const xCoord = scale * x(i) + centerX;
        const yCoord = -scale * y(i) + centerY;

        // Apply a continuous randomness to make the second line wiggle (criss-cross)
        const randomness = Math.sin(i * 10 + Math.PI + Date.now() * 0.005) * 2; // Wiggling effect
        const xRandom = xCoord + randomness;
        const yRandom = yCoord + randomness;

        if (i === 0) {
            ctx.moveTo(xRandom, yRandom);
        } else {
            ctx.lineTo(xRandom, yRandom);
        }
    }

    // Second red criss-cross line (wiggling line)
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Animation loop to update canvas
function animate() {
    // Clear the canvas before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid as the background
    drawGrid();

    // If the drawing isn't complete, draw the heart with the two red lines
    if (!drawingComplete) {
        // Draw the heart shape outline (two criss-cross lines)
        drawHeart();

        // Update time for heart animation
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / (animationDuration * 1000), 1); // Ensure progress does not exceed 1

        // Speed up line drawing and forming of the heart
        currentT = maxT * progress;

        // If drawing is complete, stop drawing and leave the heart on screen
        if (currentT >= maxT) {
            drawingComplete = true;
        }
    } else {
        // After drawing is complete, keep both lines wiggling continuously
        drawWigglingLines();
    }

    // Request the next frame to create an infinite loop
    requestAnimationFrame(animate);
}

// Start the animation
const startTime = Date.now();
animate();
