let boardWidth = 1920;
let boardHeight = 1080;
let backgroundImg = new Image();
let countdownTime = 3;
let countdownInterval;
backgroundImg.src = "/Users/joelei/Desktop/game 02/background_01.png";
let inputLocked = false;

document.addEventListener("keydown", handleKeyDown);

let GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing",
    GAME_OVER: "gameOver",
    COUNTDOWN: "countdown"
};
let currentState = GAME_STATE.MENU;

let playButton = {
    x: boardWidth / 2 - 300 / 2,
    y: boardHeight / 2 + 350 / 2,
    width: 300,
    height: 150
};

let logo = {
    x: boardWidth / 2 - 1500 / 2,
    y: boardHeight / 4,
    width: 1500,
    height: 300
};

let flappyBirdTextImg = new Image();
flappyBirdTextImg.src = "/Users/joelei/Desktop/game 02/flappyBirdLogo01.png";

let gameOverImg = new Image();
gameOverImg.src = "/Users/joelei/Desktop/game 02/flappy-gameover.png";

let bird = {
    x: 160,
    y: boardHeight / 2,
    width: 315/1.5,
    height: 255/1.5
}

let velocityY = -18;
let velocityX = -8;
let gravity = 1.05;
let birdY = boardHeight / 2;
let pipeWidth = 180;
let pipeGap = 500;
let pipeArray = [];
let pipeIntervalId;
let score = 0;

function placePipes() {
    createPipes();
}

function createPipes() {
    let maxTopPipeHeight = boardHeight - pipeGap - 50;
    let topPipeHeight = Math.floor(Math.random() * maxTopPipeHeight);
    let bottomPipeHeight = boardHeight - topPipeHeight - pipeGap;

    let topPipe = {
        x: boardWidth,
        y: 0,
        width: pipeWidth,
        height: topPipeHeight,
        img: topPipeImg,
        passed: false
    };

    let bottomPipe = {
        x: boardWidth,
        y: topPipeHeight + pipeGap,
        width: pipeWidth,
        height: bottomPipeHeight,
        img: bottomPipeImg,
        passed: false
    };
    pipeArray.push(topPipe, bottomPipe);
}

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "/Users/joelei/Desktop/game 02/dog01.gif";

    topPipeImg = new Image();
    topPipeImg.src = "/Users/joelei/Desktop/game 02/toppipe_01.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "/Users/joelei/Desktop/game 02/bottompipe_01.png";

    playButtonImg = new Image();
    playButtonImg.src = "/Users/joelei/Desktop/game 02/flappyBirdPlayButton.png";

    requestAnimationFrame(update);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    if (currentState === GAME_STATE.MENU) {
        renderMenu();
    } else if (currentState === GAME_STATE.PLAYING) {
        renderGame();
    } else if (currentState === GAME_STATE.GAME_OVER) {
        renderGameOver();
    } else if (currentState === GAME_STATE.COUNTDOWN) {
            renderCountdown();
        }
        
}

function renderMenu() {
    if (backgroundImg.complete) {
        context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);
    }

    if (playButtonImg.complete) {
        context.drawImage(playButtonImg, playButton.x, playButton.y, playButton.width, playButton.height);
    }

    if (flappyBirdTextImg.complete) {
        let scaledWidth = logo.width;
        let scaledHeight = (flappyBirdTextImg.height / flappyBirdTextImg.width) * scaledWidth;
        context.drawImage(flappyBirdTextImg, logo.x, logo.y, scaledWidth, scaledHeight);
    }
}

function renderCountdown() {
    context.drawImage(backgroundImg, 0, 0, boardWidth, boardHeight);

    context.fillStyle = "white";
    context.font = "120px sans-serif";
    context.textAlign = "center";
    context.fillText(countdownTime, boardWidth / 2, boardHeight / 2);
}

function renderGame() {
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        currentState = GAME_STATE.GAME_OVER;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            currentState = GAME_STATE.GAME_OVER;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "135px sans-serif";
    context.textAlign = "left";
    context.fillText(score, 30, 270);
}

function renderGameOver() {
    if (gameOverImg.complete) {
        let imgWidth = 600;
        let imgHeight = 120;
        let x = (boardWidth - imgWidth) / 2;
        let y = boardHeight / 3;

        context.drawImage(gameOverImg, x, y, imgWidth, imgHeight);

        // show score
        let scoreText = `Your score: ${Math.floor(score)}`;
        context.fillStyle = "white";
        context.font = "120px sans-serif";
        context.textAlign = "center";
        context.fillText(scoreText, boardWidth / 2, y + imgHeight + 100);

        // share score
        let shareText = "Follow us on X @flipster_io | Share your score | Get cool swag";
        context.font = "50px sans-serif";
        context.fillStyle = "#FFD700"; // 金黄色，吸引注意
        context.fillText(shareText, boardWidth / 2, y + imgHeight + 210);

        inputLocked = true;
        setTimeout(() => {
            inputLocked = false;
        }, 1000);
    }
}

function handleKeyDown(e) {
    if (inputLocked) return;

    if (e.code === "Space") {
        if (currentState === GAME_STATE.MENU) {
            startCountdown(); // 👈 new
        } else if (currentState === GAME_STATE.GAME_OVER) {
            resetGame();
            currentState = GAME_STATE.MENU;
        } else if (currentState === GAME_STATE.PLAYING) {
            velocityY = -18;
        }
    }    
}

function startGame() {
    currentState = GAME_STATE.PLAYING;
    bird.y = birdY;
    velocityY = 0;
    pipeArray = [];
    score = 0;

    if (pipeIntervalId) {
        clearInterval(pipeIntervalId);
    }

    pipeIntervalId = setInterval(placePipes, 1500);
}

function startCountdown() {
    currentState = GAME_STATE.COUNTDOWN;
    countdownTime = 3;

    countdownInterval = setInterval(() => {
        countdownTime--;
        if (countdownTime === 0) {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);
}

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
