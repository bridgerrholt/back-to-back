/*
	The character the user controls.
*/

Player = function(x, y) {
	this.side = 1;									// the alliance it's on

	this.x = x;										// current x position in the world
	this.y = y;										// current y position in the world

	this.xReal = x;									// current x position on the screen
	this.yReal = y;									// current y position on the screen

	this.comrades = 1;								// amount of shooters you're controlling

	this.dead = false;								// whether dead or not
	this.hpMax = 200;								// maximum amount of hp
	this.hp = this.hpMax;							// current amount of hp
	this.hpRegTimerMax = 10;						// maximum regeneration timer for hp
	this.hpRegTimer = this.hpRegTimerMax;			// current regeneration timer for hp
	this.hpRegAmount = 10;							// hp regenerated whenever hpRegTimer reaches 0

	this.shootTimerMax = 20;						// delay (in updates) per shot
	this.shootTimer = 0;							// delay (in updates) per shot
	this.bulletSpeed = 7;							// speed of fired bullets
	this.bulletRadius = 1;							// starting radius of fired bullets
	this.bulletRadiusMax = 3;						// maximum radius of fired bullets
	this.bulletRadiusRate = 0.05;					// increase in radius of fired bullets per update
	this.bulletDamage = 5;							// damage of fired bullets

	this.color = {									// all the color information
		base: "#fff",
		eye: "#f00",
		eyeReload: "#000"
	};


	this.level = 0;									// current level
	this.size = 0;									// current size, sets back to 0 at a point
	this.sizeMax = 30;								// maximum size, when size sets back

	var rMin = 15;
	var rMax = 30;

	this.rMin = rMin;								// minimum radius
	this.r = this.rMin;								// current radius
	this.rMax = rMax;								// maximum radius


	this.eyeRadiusMin = 3;							// minimum eye radius
	this.eyeRadius = this.eyeRadiusMin;				// current eye radius
	this.eyeRadiusMax = 6;							// maximum eye radius

	this.eyeDisMin =								// minimum eye distance
		rMin-this.eyeRadiusMin-4;
	this.eyeDis = this.eyeDisMin;					// current eye distance
	this.eyeDisMax =								// maximum eye distance
		rMax-this.eyeRadiusMax-5;

	this.eyeDir = 0;								// current eye direction (in degrees)
	this.eyeDirSpeed = 4;							// amount of possible degrees changed per update

};

Player.prototype.update = function() {
	if (!this.dead) {
		this.xReal = this.x-g_g.camera.x;
		this.yReal = this.y-g_g.camera.y;

		if (pointDis(this.xReal, this.yReal, g_g.mouse.x, g_g.mouse.y) > this.r) {
			this.eyePosition();
		}

		this.shoot();

		this.regenerate();

		return false;
	} else {
		return true;
	}
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
};

Player.prototype.shoot = function() {
	if (this.shootTimer === 0) {
		if (g_g.mouse.buttons.ld && !g_g.mouse.buttons.lu) {
			var pos = disDir(this.x, this.y, this.r, this.eyeDir);
			g_g.bullets.push(new Bullet(this.side, this, pos.x, pos.y, this.eyeDir,
				this.bulletRadius, this.bulletRadiusMax, this.bulletRadiusRate,
				this.bulletSpeed, this.bulletDamage));
			this.shootTimer = this.shootTimerMax;
		}
	} else {
		this.shootTimer--;
	}
};

Player.prototype.notifyKill = function(target) {
	if (this.size === this.sizeMax)
		this.size = 0;
	else
		this.size += 1;

	this.r = this.size*(this.rMax-this.rMin)/this.sizeMax + this.rMin;
	this.eyeRadius = this.size*(this.eyeRadiusMax-this.eyeRadiusMin)/this.sizeMax + this.eyeRadiusMin;
	this.eyeDis = this.size*(this.eyeDisMax-this.eyeDisMin)/this.sizeMax + this.eyeDisMin;

};

Player.prototype.damage = function(damage, attacker) {
	this.hp -= damage;
	if (this.hp <= 0) {
		this.dead = true;
		attacker.notifyKill(this);
	}
};

Player.prototype.checkCollisionBullet = function(x, y, r) {
	if (pointDis(this.x, this.y, x, y) <= this.r+r)
		return true;

	return false;
};

Player.prototype.regenerate = function() {
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

Player.prototype.draw = function() {
	this.drawComrade();
};

Player.prototype.drawComrade = function() {
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