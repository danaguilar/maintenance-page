window.onload = function(){

}

var start = function() {
	FRAMERATE = 60;
	document.getElementById("maintenance").style.display = "none";
	var container = document.getElementsByClassName("game-container");
	var gameHeight = window.innerHeight;
	var gameWidth = window.innerWidth;
	document.getElementById("message").style.width = gameWidth + 'px';
	container[0].innerHTML = "<canvas id='gameCanvas' height = '" + gameHeight + "px' width = '" + gameWidth+ "px'></canvas>"
	var canvas = document.getElementById('gameCanvas');
	var ctx = canvas.getContext("2d");
	var circles = [];
	var count = 0;
	var nextLevelCount = 0;
	var score = 0;
	var clock = 60;
	var clockCount = 0;
	var clockDiv = document.getElementById("time");
	var speed = 1;
	var scoreDiv = document.getElementById("score");
	var addToScore = function(newScore){
		var oldScore = score;
		score += newScore;
		if(score > newScore * 10 && oldScore < newScore * 10){
			increaseDifficulty();
		}
	}
	var updateScore = function() {
		scoreDiv.innerHTML = score.toString();
	}
	var increaseDifficulty = function() {
		speed += 1;
	}
	var updateClock = function() {
		clockDiv.innerHTML = clock.toString();
	}

	var endGame = function(loop) {
		clearInterval(gameLoop);
		circles = [];
		document.getElementById("message").style.display = "none";
		document.getElementById("score-container").style.width = gameWidth + 'px';
		document.getElementById("score-container").style.display = "inline";
		document.getElementById("final-score").innerHTML = score.toString();


	}

	var gameLoop = setInterval(function(){
		count += 1
		clockCount += 1
		if(clockCount > 60){
			clock -= 1;
			clockCount = 0;
			updateClock();
			if(clock == 0){
				endGame(gameLoop);
			}
		}
		if(count > 5){
			count = 0;
			circles.push(new bubble(canvas, speed));
			if(circles.length > 100){
				circles.shift();
			}
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < circles.length; i++){
			circles[i].update();
			circles[i].draw(ctx);
		}
	},1000/FRAMERATE);

	canvas.addEventListener("click",function(e){
		e.preventDefault();
		var xpos = e.clientX
		var ypos = e.clientY
		var missed = true
		for(var i = 0; i < circles.length; i++){
			if(circles[i].isPointInside(xpos, ypos)){
				addToScore(speed*10);
				circles.splice(i, 1);
				nextLevelCount += 1;
				if(nextLevelCount > 10){
					increaseDifficulty();
					nextLevelCount = 0
				}
				break;
			}
		}
		updateScore();
	},false);
	updateScore();
	updateClock();
}

var bubble = function(canvas, speed){
	this.ctx = canvas.getContext("2d");
	this.seed = Math.random()*65535
	this.speed = Math.round((Math.random()*3) + speed);
	this.size = 25;
	this.x_pos = Math.round(Math.random()*canvas.width)
	this.y_pos = -this.size;
	this.bgcolor = '#'+ Math.floor(this.seed).toString(16) + 'FF';
	this.update = function(){
		this.y_pos += this.speed;
	}
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.x_pos,this.y_pos,this.size,0,2*Math.PI);
		ctx.fillStyle = this.bgcolor;
		ctx.fill();
	}

	this.isPointInside = function(x,y) {
		var x_diff = Math.abs(this.x_pos - x);
		var y_diff = Math.abs(this.y_pos - y);
		var squared = (x_diff*x_diff) + (y_diff*y_diff)
		var distance = Math.sqrt(squared);
		if(distance <= this.size){
			return true;
		}
		else{
			return false;
		}
	}
};
