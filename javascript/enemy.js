/*
	Basic enemies that spawn.
*/

Enemy = function(x, y) {
	this.side = 2;									// the alliance it's on

	this.x = x;										// current x position in the world
	this.y = y;										// current y position in the world

	this.xReal = x;									// current x position on the screen
	this.yReal = y;									// current y position on the screen

	this.speed = 5*g_g.speed;						// speed in pixels per tick

	this.dead = false;								// whether dead or not
	this.hpMax = 200;								// maximum amount of hp
	this.hp = this.hpMax;							// current amount of hp
	this.hpRegTimerMax = 10;						// maximum regeneration timer for hp
	this.hpRegTimer = this.hpRegTimerMax;			// current regeneration timer for hp
	this.hpRegAmount = 10;							// hp regenerated whenever hpRegTimer reaches 0

	this.shootFlag = false;							// whether it shoots or not
	this.shootTimerMax = 5;							// delay (in updates) per shot
	this.shootTimer = this.shootTimerMax;			// delay (in updates) per shot
	this.bulletSpeed = 10;							// speed of fired bullets
	this.bulletRadius = 1;							// starting radius of fired bullets
	this.bulletRadiusMax = 3;						// maximum radius of fired bullets
	this.bulletRadiusRate = 0.05;					// increase in radius of fired bullets per update
	this.bulletDamage = 5;							// damage of fired bullets

	this.color = {									// all the color information
		base: "#f00",
		eye: "#00f"
	};


	var rMin = 13;
	var rMax = 26;

	this.rMin = rMin;								// minimum radius
	this.r = this.rMin;								// current radius
	this.rMax = rMax;								// maximum radius


	this.eyeRadiusMin = 2;							// minimum eye radius
	this.eyeRadius = this.eyeRadiusMin;				// current eye radius
	this.eyeRadiusMax = 4;							// maximum eye radius

	this.eyeDisMin =								// minimum eye distance
		rMin-this.eyeRadiusMin-4;
	this.eyeDis = this.eyeDisMin;					// current eye distance
	this.eyeDisMax =								// maximum eye distance
		rMax-this.eyeRadiusMax-5;

	this.eyeDir = 0;								// current eye direction (in degrees)
	this.eyeDirSpeed = 4;							// amount of possible degrees changed per update

};

Enemy.prototype.update = function() {
	if (!this.dead) {
		this.xReal = this.x-g_g.camera.x;
		this.yReal = this.y-g_g.camera.y;

		if (pointDis(this.xReal, this.yReal, g_g.player.x, g_g.player.y) > this.r) {
			this.eyePosition();
		}

		if (pointDis(this.xReal, this.yReal, g_g.player.x, g_g.player.y) > this.r+g_g.player.r) {
			this.move();
		}


		//this.shoot();

		//this.regenerate();
	}
};

Enemy.prototype.move = function() {
	var pos = disDir(this.x, this.y, this.speed,
		pointDir(this.x, this.y, g_g.player.x, g_g.player.y));

	this.x = pos.x;
	this.y = pos.y;
};

Enemy.prototype.eyePosition = function() {
	var newDir = pointDir(this.xReal, this.yReal, g_g.player.x-g_g.camera.x, g_g.player.y-g_g.camera.y);

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
};

Enemy.prototype.shoot = function() {

	if (g_g.mouse.buttons.ld && !g_g.mouse.buttons.lu) {
		if (this.shootTimer === 0) {
			var pos = disDir(this.x, this.y, this.r+2, this.eyeDir);
			g_g.bullets.push(new Bullet(this.side, pos.x, pos.y, this.eyeDir,
				this.bulletRadius, this.bulletRadiusMax, this.bulletRadiusRate,
				this.bulletSpeed, this.bulletDamage));
			this.shootTimer = this.shootTimerMax;
		} else {
			this.shootTimer--;
		}
	}

};

Enemy.prototype.damage = function(damage) {
	this.hp -= damage;
	if (this.hp <= 0) {
		this.dead = true;
	}
}

Enemy.prototype.checkCollisionBullet = function(x, y, r) {
	if (pointDis(this.x, this.y, x, y) <= this.r+r)
		return true;
};

Enemy.prototype.regenerate = function() {
	if (this.hp < this.hpMax) {
		if (this.hpRegTimer == 0) {
			this.hpRegTimer = this.hpRegTimerMax

			this.hp += this.hpRegAmount;

			if (this.hp > this.hpMax)
				this.hp = this.hpMax
		}
	} else {
		this.hpRegTimer -= 1;
	}
};

Enemy.prototype.draw = function() {
	var xReal = this.x-g_g.camera.x;
	var yReal = this.y-g_g.camera.y;

	g_g.ctx.fillStyle = this.color.base;
	g_g.ctx.strokeStyle = this.color.base;

	g_g.ctx.fillRect(xReal-this.r, yReal-this.r, this.r*2, this.r*2);
	g_g.ctx.strokeRect(xReal-this.r, yReal-this.r, this.r*2, this.r*2);


	g_g.ctx.fillStyle = this.color.eye;
	g_g.ctx.strokeStyle = this.color.eye;

	var pos = disDir(this.xReal, this.yReal, this.eyeDis, this.eyeDir);

	g_g.ctx.beginPath();
	g_g.ctx.arc(pos.x, pos.y,
		this.eyeRadius, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();
};