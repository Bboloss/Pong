window.onload = function() {

    class Paddle {
        constructor(positionX, canvas, upButtonId, downButtonId) {
            this.positionX = positionX;
            this.positionY = canvas.height / 2 - 20;
            this.velocity = 3;
            this.width = 5;
            this.height = 40;
            this.canvas = canvas;
            this.movingUp = false;
            this.movingDown = false;

            // Ajouter des écouteurs d'événements pour les boutons
            const upButton = document.getElementById(upButtonId);
            const downButton = document.getElementById(downButtonId);

            upButton.addEventListener('touchstart', () => this.movingUp = true);
            upButton.addEventListener('touchend', () => this.movingUp = false);
            downButton.addEventListener('touchstart', () => this.movingDown = true);
            downButton.addEventListener('touchend', () => this.movingDown = false);
            
        }

        move() {
            if (this.movingUp && this.positionY > 0) {
                this.positionY -= this.velocity;
            }
            if (this.movingDown && this.positionY < this.canvas.height - this.height) {
                this.positionY += this.velocity;
            }
        }

        draw() {
            ctx.fillStyle = "white";
            ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
        }

        isMoving() {
            return this.movingUp || this.movingDown;
        }
    }

    class Ball {
        constructor(direction, velocity, canvas) {
            this.direction = direction;
            this.velocity = velocity;
            this.positionX = canvas.width / 2;
            this.positionY = canvas.height / 2;
            this.canvas = canvas;
            this.size = 5;
            this.lastPaddleTouch = 1;
        }

        move(paddle1, paddle2) {
            const radians = this.direction * Math.PI / 180; // Convertir l'angle en radians
            this.positionX += this.velocity * Math.cos(radians);
            this.positionY += this.velocity * Math.sin(radians);

            // Rebondir sur les bords horizontaux
            if (this.positionY <= 0 || this.positionY >= this.canvas.height - this.size) {
                this.direction = 360 - this.direction; // Inverser la direction verticale
            }

            // Rebondir sur les raquettes
            if (this.positionX <= paddle1.positionX + paddle1.width &&
                this.positionY >= paddle1.positionY &&
                this.positionY <= paddle1.positionY + paddle1.height) {
                    if (this.lastPaddleTouch === 2) {
                        this.lastPaddleTouch = 1;
                        if (paddle1.isMoving()) {
                            if (this.velocity < 5) {
                                       this.velocity ++;
                                   }
                        }else {
                            this.velocity = 3;
                        }
                        this.direction = 180 - this.direction;
                    }
                    if (this.positionY < paddle1.positionY + paddle1.height /3) {
                        this.direction -= 5;
                    }else if (this.positionY > paddle1.positionY + (paddle1.height /3)*2) {
                        this.direction += 5;
                    }
                    
                } else if (this.positionX >= paddle2.positionX - this.size &&
                       this.positionY >= paddle2.positionY &&
                       this.positionY <= paddle2.positionY + paddle2.height) {
                           if (this.lastPaddleTouch === 1) {
                               this.lastPaddleTouch = 2;
                               if (paddle2.isMoving()) {
                                   if (this.velocity < 5) {
                                       this.velocity ++;
                                   }
                               }else {
                                   this.velocity = 3;
                               }
                               this.direction = 180 - this.direction;
                           }
                           if (this.positionY < paddle2.positionY + paddle2.height /3) {
                               this.direction += 5;
                           }else if (this.positionY > paddle2.positionY + (paddle2.height /3)*2) {
                               this.direction -= 5;
                           }
                       }

            // Vérifier si la balle sort des limites du canvas
            if (this.positionX < 0) {
                score2++;
                this.reset();
            } else if (this.positionX > this.canvas.width) {
                score1++;
                this.reset();
            }
        }

        reset() {
            this.positionX = this.canvas.width / 2;
            this.positionY = this.canvas.height / 2;
            this.velocity = 0;
            setTimeout(() => {
                if (score1 < score2) {
                    this.direction = 0;
                    this.lastPaddleTouch = 1;
                }else {
                    this.direction = 180;
                    this.lastPaddleTouch = 2;
                }
                this.velocity = 3;
            },1000)
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.positionX, this.positionY, this.size, 0, Math.PI * 2, true);
            ctx.fillStyle = "white";
            ctx.fill();
        }
    }

    function drawAll() {
        if (play) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            paddle1.move();
            paddle2.move();
            paddle1.draw();
            paddle2.draw();
            ball.move(paddle1, paddle2);
            ball.draw();

            // Afficher les scores
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(`Score: ${score1}`, 20, 30);
            ctx.fillText(`Score: ${score2}`, canvas.width - 90, 30);
            
            //arreter le jeu à 1a pts, mais en jouant la balle gagnante
            if (score1 >= 11 || score2 >= 11 ) {
                if (Math.abs(score1 - score2) > 1) {
                    setTimeout(() => {
                        play = false;
                        endScreen();
                    },1000);
                }
            }

            requestAnimationFrame(drawAll);
        }
    }

    function decompt(canvas, ctx) {
        let i = 3;
        const intervalId = setInterval(() => {
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.font = "50px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(String(i), canvas.width / 2 - 12.5, canvas.height / 2 + 10);
            ctx.closePath();

            if (i === 0) {
                clearInterval(intervalId);
                drawAll();
            }
            i--;
        }, 500);
    }
    
    function endScreen() {
        replay.textContent = "Replay";
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`Score:  ${score1}`,40, canvas.height /2 + 10);
        ctx.fillText(`à ${score2}`,canvas.width /2 +30, canvas.height /2 + 10);
    }
    
    let canvas = document.getElementById("grid2");
    let ctx = canvas.getContext("2d");
    let play = false;
    let score1 = 0;
    let score2 = 0;
    
    const paddle1 = new Paddle(5, canvas, 'control1up', 'control1down');
    const paddle2 = new Paddle(canvas.width - 10, canvas, 'control2up', 'control2down');
    const ball = new Ball(0, 3, canvas);
    
    let replay = document.getElementById("replay");
    replay.textContent = "Play";
    
    replay.addEventListener("click", () => {
        if (play !== true) {
            score1 = 0;
            score2 = 0;
            play = true;
            replay.textContent = "Stop";
            paddle1.positionX = 5;
            paddle1.positionY = canvas.height /2 -20;
            paddle2.positionX = canvas.width -10;
            paddle2.positionY = canvas.height /2 -20;
            decompt(canvas, ctx);
        }else {
            play = false;
            endScreen();
        }
    });
}

