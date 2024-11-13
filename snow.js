let snowflakes = [];
let limit = 3000; //number of snowflakes

function setup() {
	background(237,237,237);
	noStroke();
	let x, y, s, c, h,b;
	for(let i = 0; i < limit; i++){
		x = random(0, width);
		y = random(0, height);
		s = random(1,2); //speed
		c = color(255,255,255,random(20, 220));
		h = random(1,3); //stroke
		snowflakes.push(new Flake(x, y, x, y, s/10, s, h, h, c));
	}
}

function draw() {
	background(0);
	for(let i = 0; i < snowflakes.length; i++){
		snowflakes[i].move();
		snowflakes[i].bounce();
		snowflakes[i].render();
	}
}

class Flake {
	constructor(x, y, iX, iY, sX, sY, w, h, c){
		this.xCoord = x;
		this.yCoord = y;
		this.xInitial = iX;
		this.yInitial = iY;
		this.xSpeed = sX;
		this.ySpeed = sY;
		this.ballW = w;
		this.ballH = h;
		this.c = c;
	}
	
	move(){
		this.xCoord += this.xSpeed;
		this.yCoord += this.ySpeed;
	}
	
	render(){
		fill(this.c);
		ellipse(this.xCoord, this.yCoord, this.ballW, this.ballH);
	}

	bounce(){
		if((this.xCoord > (this.xInitial + (this.ballW/2))) || (this.xCoord < (this.xInitial - (this.ballW/2)))){
			 this.reverseX();
	  }
		if(this.yCoord > height){
			this.yCoord = 0;
		}
	}
	
	reverseX(){
		this.xSpeed *= -1;
	}
}
