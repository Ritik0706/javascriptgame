window.addEventListener("load", function () {
    var game_width = 640;
    var game_height = 260;
    var gameLive = true;
    var level = 1;
    var life = 5;
    var color = "white";

    var enemies = [
        {
            x: 100,
            y: 100,
            speedY: 2,
            w: 40,
            h: 40
        },
        {
            x: 200,
            y: 0,
            speedY: 2,
            w: 40,
            h: 40
        },
        {
            x: 330,
            y: 100,
            speedY: 3,
            w: 40,
            h: 40
        },
        {
            x: 450,
            y: 100,
            speedY: -3,
            w: 40,
            h: 40
        },
    ];

    var player = {
        x: 10,
        y: 160,
        speedX: 2,
        isMovingLeft: false,
        isMovingRight: false,
        isMoving: false,
        w: 40,
        h: 40
    };

    var goal = {
        x: 580,
        y: 160,
        w: 50,
        h: 36
    };

    var sprites = {};
    var canvasClicked = false;

    var movePlayer = function () {
        player.isMoving = true;
        canvasClicked = true;
    }

    var stopPlayer = function () {
        player.isMoving = false;
        canvasClicked = true;
    }

    var canvas = this.document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", movePlayer);
    canvas.addEventListener("mouseup", stopPlayer);
    canvas.addEventListener("touchstart", movePlayer);
    canvas.addEventListener("touchend", stopPlayer);

    var gamestate = true; // Add this variable to manage the game state

    document.addEventListener("keydown", function (event) {
        if (gamestate && !isPopupOpen()) {
            if (event.key === "ArrowLeft") {
                player.isMovingLeft = true;
                player.isMovingRight = false;
            } else if (event.key === "ArrowRight") {
                player.isMovingRight = true;
                player.isMovingLeft = false;
            }
        }
    });

    document.addEventListener("keyup", function (event) {
        if (gamestate && !isPopupOpen()) {
            if (event.key === "ArrowLeft") {
                player.isMovingLeft = false;
            } else if (event.key === "ArrowRight") {
                player.isMovingRight = false;
            }
        }
    });

    // POP UP Close Btn
    var winnerCloseButton = document.getElementById('winnerClose');
    var gameOverCloseButton = document.getElementById('gameOverClose');
    var winnerPopup = document.getElementById('winnerPopup');
    var gameOverPopup = document.getElementById('gameOverPopup');

    winnerCloseButton.addEventListener('click', function () {
        winnerPopup.style.display = 'none';
        gamestate = true; // Start the game again
    });

    gameOverCloseButton.addEventListener('click', function () {
        gameOverPopup.style.display = 'none';
        gamestate = true; // Start the game again
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (winnerPopup.style.display === 'block') {
                winnerPopup.style.display = 'none';
                gamestate = true; // Start the game again
            } else if (gameOverPopup.style.display === 'block') {
                gameOverPopup.style.display = 'none';
                gamestate = true; // Start the game again
            }
        }
    });

    // Function to check if any popup is open
    function isPopupOpen() {
        return winnerPopup.style.display === 'block' || gameOverPopup.style.display === 'block';
    }

    // Function to show winner
    function showWinner() {
        winnerText.textContent = `You wins!...`;
        winnerPopup.style.display = 'block';
        gamestate = false; // Stop the game
    }

    // Function to handle game over
    function gameOver() {
        gameOverPopup.style.display = 'block';
        gamestate = false; // Stop the game
    }

    var update = function () {
        if (gamestate && !isPopupOpen()) {
            if (!canvasClicked) {
                player.isMoving = false;
            }

            if (player.isMovingLeft) {
                player.x -= player.speedX;
            }
            if (player.isMovingRight) {
                player.x += player.speedX;
            }

            if (checkCollision(player, goal)) {
                showWinner();
                level += 1;
                life += 1;
                player.speedX += 1;
                player.x = 10;
                player.y = 160;
                player.isMoving = false;

                for (var a = 0; a < enemies.length; a++) {
                    if (enemies[a].speedY > 1) {
                        enemies[a].speedY += 1;
                    } else {
                        enemies[a].speedY -= 1;
                    }
                }
            }

            if (player.isMoving) {
                player.x = player.x + player.speedX;
            }

            var i = 0;
            var n = enemies.length;

            enemies.forEach(function (element, index) {
                if (checkCollision(player, element)) {
                    if (life == 0) {
                        gameOver();

                        for (var a = 0; a < enemies.length; a++) {
                            if (enemies[a].speedY > 1) {
                                enemies[a].speedY -= (level - 1);
                            } else {
                                enemies[a].speedY += (level - 1);
                            }
                        }

                        level = 1;
                        life = 6;
                        player.speedX = 2;
                    }

                    if (life > 0) {
                        life -= 1;
                    }

                    player.x = 10;
                    player.y = 160;
                    player.isMoving = false;
                }

                element.y += element.speedY;

                if (element.y <= 10) {
                    element.y = 10;
                    element.speedY *= -1;
                } else if (element.y >= game_height - 50) {
                    element.y = game_height - 50;
                    element.speedY *= -1;
                }
            });
        }
    };

    var draw = function () {
        ctx.clearRect(0, 0, game_width, game_height);

        ctx.font = "12px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Level : " + level, 10, 15);
        ctx.fillText("Life : " + life, 10, 35);
        ctx.fillText("Speed : " + player.speedX, 10, 55);

        ctx.fillStyle = color;
        ctx.fillRect(player.x, player.y, player.w, player.h);

        ctx.fillStyle = "red";
        enemies.forEach(function (element, index) {
            ctx.fillRect(element.x, element.y, element.w, element.h);
        });

        ctx.fillStyle = "green";
        ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
    }

    var step = function () {
        update();
        draw();

        if (gameLive) {
            window.requestAnimationFrame(step);
        }
    };

    var checkCollision = function (rect1, rect2) {
        var closeOnWidth = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
        var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
        return closeOnWidth && closeOnHeight;
    }

    step();
});
