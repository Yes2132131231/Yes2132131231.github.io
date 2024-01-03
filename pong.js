document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('pong');
    const ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 600;

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
    let ballscore = leftscore + rightscore;
    let Rallyscore = 0;

    let ballAccelerationX = 0.0085;
    let ballAccelerationY = 0.0085;

    function updateScoreDisplay() {
        let leftScoreElement = document.getElementById('leftscore');
        let rightScoreElement = document.getElementById('rightscore');
        let ballScoreElement = document.getElementById('ballscore');

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

        ballscore = leftscore + rightscore;
        if (!ballScoreElement) {
            ballScoreElement = document.createElement('div');
            ballScoreElement.id = 'ballscore';
            document.body.appendChild(ballScoreElement);
        }
        ballScoreElement.textContent = `Alone Score: ${ballscore}`;
    }

    function updateRallyscore() {
        let RallyscoreElement = document.getElementById('Rallyscore');

        if (!RallyscoreElement) {
            RallyscoreElement = document.createElement('div');
            RallyscoreElement.id = 'Rallyscore';
            document.body.appendChild(RallyscoreElement);
        }

        RallyscoreElement.textContent = `Rally Score: ${Rallyscore}`;
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

    function checkCollisionAndScore() {
        if (
            (ballX - 10 < leftPaddle.x + leftPaddle.width && ballY > leftPaddle.y && ballY < leftPaddle.y + leftPaddle.height) ||
            (ballX + 10 > rightPaddle.x && ballY > rightPaddle.y && ballY < rightPaddle.y + rightPaddle.height)
        ) {
            ballSpeedX = -ballSpeedX;
            Rallyscore++;
            updateRallyscore();
        }
    }

    function update() {
        movePaddle(leftPaddle);
        movePaddle(rightPaddle);

        ballSpeedX += (ballSpeedX > 0) ? ballAccelerationX : -ballAccelerationX;
        ballSpeedY += (ballSpeedY > 0) ? ballAccelerationY : -ballAccelerationY;

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        checkCollisionAndScore();

        if (ballY - 10 < 0 || ballY + 10 > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX < 0 || ballX > canvas.width) {
            if (ballX < 0) {
                rightscore++;
            }

            if (ballX > canvas.width) {
                leftscore++;
            }

            updateScoreDisplay();
            updateRallyscore();

            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 4;
            ballSpeedY = 4;

            Rallyscore = 0;
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
    updateRallyscore();
    gameLoop();
});
