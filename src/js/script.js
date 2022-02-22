const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const restartButton = document.getElementById("restart");

		// take a sound from src/sound
		let sound = new Audio();
		sound.src = "sound/y2mate.com - EMOTIONAL DAMAGE SFX.mp3"

let cw = 480;
let ch = window.innerHeight - 10;

canvas.width = cw;
canvas.height = ch;

addEventListener("resize", () => {
	cw =480;
	ch = window.innerHeight - 10;
	canvas.width = cw;
	canvas.height = ch;
});

let backgroundImage = new Image()
let pipe = new Image()
let bird = new Image()

let birdComponents = {
	x: canvas.width / 3.5,
	y: 	canvas.height / 2,
	width: 100,
	height: 50,
	gravity: 0.25,
	velocity: 0,
	rotation: 0,
	gameOver: false,
	gameStart: false,
	immortal: false,
	score: 0,
	flap: function () {
		if (!birdComponents.gameOver && birdComponents.gameStart) {
			if (this.rotation > -5) {
				this.velocity = 0.5;
			} else {
				this.velocity = -0.5;
			}

			this.velocity -= 7.5;
		}
	},

	draw: function () {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(bird, -this.width / 2, -this.height / 2, this.width, this.height);
		ctx.restore();
	},
	update: function () {
		if (this.gameStart) {
			this.velocity += this.gravity;
			this.y += this.velocity;

			if (this.y + this.height / 2 >= ch + 3) {
				this.y = ch + 3 - this.height / 2;
				this.velocity = 0;

				// save the rotaion
				this.rotation = 0;
				this.velocity = 16;

				// game over
				if (!this.immortal) {
					this.gameStart = false;
					this.gameOver = true;
				}
			}

			if (this.y - this.height / 2 <= 0) {
				this.y = this.height / 2;
				this.velocity = 0;
			}

			this.rotation = this.velocity * 0.10;
		}
	}
};

// draw the background
backgroundImage.src = "img/background_1.png"
pipe.src = "img/pipe.png"
bird.src = "img/bird.png"

let opacity = 0;
let pipes = [];

let soundLooping = 1
function spawnPipe() {
	setInterval(() => {
		if (birdComponents.gameStart) {
			let pipeComponent = {
				x: canvas.width,
				y: 0,
				width: 50,
				height: Math.floor(Math.random() * ch / 2) + 50,
				velocity: -3,
				draw: function () {
					ctx.drawImage(pipe, this.x, this.y, this.width, this.height);
					ctx.drawImage(pipe, this.x, this.y + this.height + 300, this.width, ch - this.height - 100);
				},
				update: function () {
					this.x += this.velocity;

					if (this.x + this.width < 0) {
						setTimeout(() => {
							pipes.shift();
							birdComponents.score++;
						}, 0);
					}

					if (birdComponents.gameOver) {
						this.velocity = 0;
					}
				}
			};

			pipes.push(pipeComponent);
		}
	}, 1500);
}

function game() {
	ctx.drawImage(backgroundImage, 0, 0, cw, ch);
	// draw the bird
	birdComponents.draw();
	birdComponents.update();

		pipes.forEach((pipe) => {
			pipe.draw();
			pipe.update();

			// check for collision
			if (birdComponents.gameStart && !birdComponents.gameOver) {
				if(!birdComponents.immortal) {
					if (birdComponents.x + birdComponents.width / 2 > pipe.x && birdComponents.x - birdComponents.width / 2 < pipe.x + pipe.width) {
						if (birdComponents.y + birdComponents.height / 2 > pipe.y && birdComponents.y - birdComponents.height / 2 < pipe.y + pipe.height) {
							birdComponents.gameOver = true;
							if (birdComponents.rotation <= 0) {
								birdComponents.rotation = -5;
							}
						}
					}
				}
			}
		});

	ctx.fillStyle = `RGBA(165, 165, 238, ${opacity})`;
	ctx.fillRect(0, 0, cw, ch);

	if (birdComponents.gameOver && !birdComponents.gameStart) {
		restartButton.style.opacity = 1;
		scoreText.style.transition = "transform 1s";
		scoreText.style.transform = "translateY(200px) scale(1.5) translateX(-30%)";
		scoreText.style.color = "linear-gradient( #3d3d3d, #63b2)";
		restartButton.style.transform = "translateY(0px) translateX(0%)";

		if (soundLooping == 1) {
			soundLooping = 0;
			sound.play();
		}
		
		setTimeout(() => {
			scoreText.innerText = `Score: ${birdComponents.score}`;
			scoreText.style.color = "lightGray";
		}, 1000);

		if (opacity < 1) {
			opacity += 0.01;
		} else {
			ctx.font = "50px Arial";
			ctx.fillStyle = "BLACK";
			ctx.textAlign = "center";
			ctx.fillText("Game Over", cw / 2, ch / 2);
			opacity = 1;
		}
	} else {
		scoreText.innerText = birdComponents.score;
	}
}

canvas.addEventListener("click", () => { 
		birdComponents.gameStart = true;
		birdComponents.flap();
})

spawnPipe()
setInterval(game, 1000 / 60);

restartButton.addEventListener("click", () => {
	soundLooping = 1;
	restartButton.style.transition = "transform 1s";
	restartButton.style.transform = "translateY(350px)";
	restartButton.style.opacity = 0;

	scoreText.style.transition = "transform 0.5s";
	scoreText.style.transform = "translateY(50px)";
	scoreText.style.color = "rgb(90, 90, 165)";

	scoreText.innerText = "0";
	opacity = 0;

	birdComponents.gameOver = false;
	setTimeout(() => {
		birdComponents.gameStart = true;
	}, 1000);
	birdComponents.score = 0;
	birdComponents.y = ch / 2;
	birdComponents.velocity = 0;
	birdComponents.rotation = 0;

	pipes = [];
})