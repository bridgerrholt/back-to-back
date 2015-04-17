/*
	The character the user controls.
*/

Player = function(x, y) {
	this.side = 1;									// the alliance it's on

	this.x = x;										// current x position in the world
	this.y = y;										// current y position in the world

	this.xReal = x;									// current x position on the screen
	this.yReal = y;									// current y position on the screen

	this.amount = 1;								// amount of shooters you're controlling

	this.shootTimerMax = 5;							// delay (in updates) per shot
	this.shootTimer = this.shootTimerMax;			// delay (in updates) per shot
	this.bulletSpeed = 10;							// speed of fired bullets
	this.bulletRadius = 1;							// starting radius of fired bullets
	this.bulletRadiusMax = 3;						// maximum radius of fired bullets
	this.bulletRadiusRate = 0.05;					// increase in radius of fired bullets per update

	this.color = {									// all the color information
		base: "#fff",
		eye: "#f00"
	};


	var rMin = 30;
	var rMax = 60;

	this.rMin = rMin;								// minimum radius
	this.r = this.rMin;								// current radius
	this.rMax = rMax;								// maximum radius


	this.eyeRadiusMin = 4;							// minimum eye radius
	this.eyeRadius = this.eyeRadiusMin;				// current eye radius
	this.eyeRadiusMax = 8;							// maximum eye radius

	this.eyeDisMin =								// minimum eye distance
		rMin-this.eyeRadiusMin-4;
	this.eyeDis = this.eyeDisMin;					// current eye distance
	this.eyeDisMax =								// maximum eye distance
		rMax-this.eyeRadiusMax-5;

	this.eyeDir = 0;								// current eye direction (in degrees)
	this.eyeDirSpeed = 5;							// amount of possible degrees changed per update

};

Player.prototype.update = function() {
	this.xReal = this.x-g_g.camera.x;
	this.yReal = this.y-g_g.camera.y;

	if (pointDis(this.xReal, this.yReal, g_g.mouse.x, g_g.mouse.y) > this.r) {
		this.eyePosition();
	}

	this.shoot();
};

Player.prototype.eyePosition = function() {
	var newDir = pointDir(this.xReal, this.yReal, g_g.mouse.x, g_g.mouse.y);

	if (Math.abs(newDir-this.eyeDir) <= this.eyeDirSpeed ||
		Math.abs(newDir-this.eyeDir+360) <= this.eyeDirSpeed)
			this.eyeDir = newDir;

	else if ((this.eyeDir-newDir + 360) % 360 > 180)
		this.eyeDir += this.eyeDirSpeed;
	else
		this.eyeDir -= this.eyeDirSpeed;

	if (this.eyeDir < 0)
		this.eyeDir += 360;
	if (this.eyeDir >= 360)
		this.eyeDir -= 360;
}

Player.prototype.shoot = function() {

	if (g_g.mouse.buttons.ld && !g_g.mouse.buttons.lu) {
		if (this.shootTimer === 0) {
			var pos = disDir(this.x, this.y, this.r+2, this.eyeDir);
			g_g.bullets.push(new Bullet(this.side, pos.x, pos.y, this.eyeDir,
				this.bulletRadius, this.bulletRadiusMax, this.bulletRadiusRate, this.bulletSpeed))
			this.shootTimer = this.shootTimerMax;
		} else {
			this.shootTimer--;
		}
	}

}

Player.prototype.draw = function() {
	var xReal = this.x-g_g.camera.x;
	var yReal = this.y-g_g.camera.y;

	g_g.ctx.fillStyle = this.color.base;
	g_g.ctx.strokeStyle = this.color.base;

	g_g.ctx.beginPath();
	g_g.ctx.arc(xReal, yReal,
		this.r, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();


	g_g.ctx.fillStyle = this.color.eye;
	g_g.ctx.strokeStyle = this.color.eye;

	var pos = disDir(this.xReal, this.yReal, this.eyeDis, this.eyeDir);

	g_g.ctx.beginPath();
	g_g.ctx.arc(pos.x, pos.y,
		this.eyeRadius, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();
};