document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('pong');
    const ctx = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 4;

    const playingArea = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        color: 'black',
    };

    const paddleWidth = 8;
    const paddleHeight = 60;
    const paddleSpeed = 7;

    const leftPaddle = {
        x: 10,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        color: 'white',
        dy: 0,
    };

    const rightPaddle = {
        x: canvas.width - 10 - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        color: 'white',
        dy: 0,
    };

    let leftscore = 0;
    let rightscore = 0;

    function updateScoreDisplay() {
        let leftScoreElement = document.getElementById('leftscore');
        let rightScoreElement = document.getElementById('rightscore');

        if (!leftScoreElement) {
            leftScoreElement = document.createElement('div');
            leftScoreElement.id = 'leftscore';
            document.body.appendChild(leftScoreElement);
        }

        if (!rightScoreElement) {
            rightScoreElement = document.createElement('div');
            rightScoreElement.id = 'rightscore';
            document.body.appendChild(rightScoreElement);
        }

        leftScoreElement.textContent = `Left Score: ${leftscore}`;
        rightScoreElement.textContent = `Right Score: ${rightscore}`;
    }

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'w':
                leftPaddle.dy = -paddleSpeed;
                break;
            case 's':
                leftPaddle.dy = paddleSpeed;
                break;
            case 'ArrowUp':
                rightPaddle.dy = -paddleSpeed;
                break;
            case 'ArrowDown':
                rightPaddle.dy = paddleSpeed;
                break;
        }
    });

    document.addEventListener('keyup', function (event) {
        switch (event.key) {
            case 'w':
            case 's':
                leftPaddle.dy = 0;
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                rightPaddle.dy = 0;
                break;
        }
    });

    function drawPlayingArea() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = playingArea.color;
        ctx.fillRect(playingArea.x, playingArea.y, playingArea.width, playingArea.height);
    }

    function drawPaddle(paddle) {
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function movePaddle(paddle) {
        paddle.y += paddle.dy;
        paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y));
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    function update() {
        movePaddle(leftPaddle);
        movePaddle(rightPaddle);

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX < 0 || ballX > canvas.width) {
            if (ballX < 0) {
                rightscore++;
            }
        
            if (ballX > canvas.width) {
                leftscore++;
            }
        
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
        
            updateScoreDisplay();
        }
        

        if (ballY < 0 || ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        if (
            (ballX < paddleWidth && ballY > leftPaddle.y && ballY < leftPaddle.y + paddleHeight) ||
            (ballX > canvas.width - paddleWidth && ballY > rightPaddle.y && ballY < rightPaddle.y + paddleHeight)
        ) {
            ballSpeedX = -ballSpeedX;
        }
    }

    function draw() {
        drawPlayingArea();
        drawPaddle(leftPaddle);
        drawPaddle(rightPaddle);
        drawBall();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    updateScoreDisplay();
    gameLoop();
});
