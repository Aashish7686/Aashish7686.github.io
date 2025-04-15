const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ball Object
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    radius: 10,
    dx: 2,
    dy: -2
};

// Paddle Object
const paddle = {
    width: 75,
    height: 10,
    x: (canvas.width - 75) / 2
};

// Key Event Variables
let rightPressed = false;
let leftPressed = false;

// Bricks Variables (now filling the upper part of the canvas)
const brickRowCount = 1; // Only 1 row for the upper wall of bricks
const brickColumnCount = Math.floor(canvas.width / (75 + 10)); // Filling width with bricks
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 0; // No offset from the top of the canvas
const brickOffsetLeft = 0;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Score and Highscore Variables
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

// Event Listeners for Key Press
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Variables for stars
let stars = [];
const starCount = 100;

function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1, // Star size between 1 and 3
            speed: Math.random() * 0.5 + 0.2 // Speed of the star
        });
    }
}

function drawStars() {
    ctx.fillStyle = "white"; // Color for stars
    ctx.font = "16px Arial"; // Font for the stars emoji
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.fillText("⭐", star.x, star.y); // Drawing the star emoji
    }

    // Move stars
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y += star.speed;
        // Reset star to top if it goes off the canvas
        if (star.y > canvas.height) {
            star.y = -star.size;
            star.x = Math.random() * canvas.width;
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff4500";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ffcc00";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ball.x > brick.x && ball.x < brick.x + brickWidth &&
                    ball.y > brick.y && ball.y < brick.y + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    score += 10;
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('highScore', highScore); // Store high score
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
    ctx.fillText("High Score: " + highScore, canvas.width - 150, 20);
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            document.location.reload();
        }
    }

    if (ball.y + ball.dy > canvas.height - ball.radius) {
        document.location.reload();
    }
}

function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += 7;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }
}

function increaseBallSpeed() {
    if (score % 50 === 0 && score > 0) {
        ball.dx *= 1.05;
        ball.dy *= 1.05;
    }
}

function drawBackground() {
    const spaceImage = new Image();
    spaceImage.src = "https://wallpapercave.com/wp/wp11342903.jpg"; // Space background image
    ctx.drawImage(spaceImage, 0, 0, canvas.width, canvas.height);

    drawStars(); // Draw the stars
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawBackground(); // Draw the space background
    drawBricks();
    drawBall();
    drawPaddle();
    moveBall();
    movePaddle();
    collisionDetection();
    drawScore();
    increaseBallSpeed();

    requestAnimationFrame(draw); // Redraw the game every frame
}

createStars(); // Initialize stars when the game starts
draw(); // Start the game loop
