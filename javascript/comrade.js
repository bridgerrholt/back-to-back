/*
	One of the objects the player controls.
*/

Comrade = function(x, y, dis, dir, dirBase, parent, index) {
	this.side = 1;									// alliance it's on
	this.index = index;								// the index of this instance in the parent's comrades list

	this.parent = parent;							// owner of the instance (probably g_g.player)
	this.children = 0;								// amount of objects still alive created from this comrade (must be 0 for deletion)


	this.x = x;										// current x position in the world
	this.y = y;										// current y position in the world
	this.dis = dis;									// how far away from the position
	this.dirBase = dirBase;							// a basis for how to face according to the mouse (add to direction to mouse)
	this.dir = dir;									// the current direction from the position
	this.x += this.dis;

	this.xReal = x;									// current x position on the screen
	this.yReal = y;									// current y position on the screen

	this.mouseAngled = {							// the mouse position rotated along the parent's position by dirBase
		x: 0,
		y: 0
	};


	this.dead = false;								// whether dead or not
	this.faded = false;								// turns true when fadingAlpha turns 0
	this.fadingAlpha = 1.0;							// the alpha channel while fading
	this.released = false;							// whether the parent has stopped considering it or not

	this.hpMax = Math.round(200/g_g.pacing);		// maximum amount of hp
	this.hpMax = 200;								// maximum amount of hp
	//this.hpMax = Math.round(50/g_g.pacing);
	this.hp = this.hpMax;							// current amount of hp
	this.hpRegTimerMax = 300/g_g.pacing;			// maximum regeneration timer for hp
	this.hpRegTimerMax = 300;						// maximum regeneration timer for hp
	this.hpRegTimer = this.hpRegTimerMax;			// current regeneration timer for hp
	this.hpRegAmount = 10;							// hp regenerated whenever hpRegTimer reaches 0

	this.shootTimerMax = 20/g_g.pacing;				// delay (in updates) per shot
	this.shootTimer = 0;							// current timer for the delay per shot
	this.bulletSpeed = 7*g_g.pacing;				// speed of fired bullets
	this.bulletRadius = 1;							// starting radius of fired bullets
	this.bulletRadiusMax = 3;						// maximum radius of fired bullets
	this.bulletRadiusRate = 0.05*g_g.pacing;		// increase in radius of fired bullets per update
	this.bulletDamage = 20;							// damage of fired bullets

	this.color = {									// all the color information
		base: {
			min: new RGBColor(127, 127, 127),
			max: new RGBColor(255, 255, 255)
		}, eye: {
			min: new RGBColor(255, 0, 0),
			max: new RGBColor(255, 0, 0)
		}
	};


	this.level = 0;									// current level
	this.size = 0;									// current size, sets back to 0 at a point
	this.sizeRate = 1*g_g.pacing;					// size increase per kill
	//this.size = 28;
	this.sizeMax = 30;								// maximum size, when size sets back
	this.sizeMax = 20;
	//this.sizeMax = 1;

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

	this.eyeDir = this.dir;							// current eye direction (in degrees)
	this.eyeDirSpeed = 4*g_g.speed*g_g.pacing;		// amount of possible degrees changed per update

};

Comrade.prototype.update = function() {
	if (!this.dead) {
		this.xReal = this.x-g_g.camera.x;
		this.yReal = this.y-g_g.camera.y;

		var xParentReal = this.parent.x-g_g.camera.x;
		var yParentReal = this.parent.y-g_g.camera.y;

		this.mouseAngled = disDir(xParentReal, yParentReal,
			pointDis(xParentReal, yParentReal, g_g.mouse.x, g_g.mouse.y),
			pointDir(xParentReal, yParentReal, g_g.mouse.x, g_g.mouse.y) + this.dirBase);

		//if (pointDis(this.xReal, this.yReal, g_g.mouse.x, g_g.mouse.y) > this.r) {
		if (//pointDis(this.xReal, this.yReal, this.mouseAngled.x, this.mouseAngled.y) > this.r &&
			pointDis(this.parent.x, this.parent.y, g_g.mouse.x, g_g.mouse.y) > this.dis) {
				this.eyePosition();
		}

		this.shoot();

		this.regenerate();

		return false;
	} else {
		this.fadingAlpha -= 0.1;
		if (this.fadingAlpha <= 0.1) {
			this.fadingAlpha = 0.0;
			this.faded = true;
		}

		return true;
	}
};

Comrade.prototype.eyePosition = function() {
	var xParentReal = this.parent.x-g_g.camera.x;
	var yParentReal = this.parent.y-g_g.camera.y;

	//var newDir = pointDir(this.xReal, this.yReal, g_g.mouse.x, g_g.mouse.y);
	//var newDir = pointDir(this.xReal, this.yReal, this.mouseAngled.x, this.mouseAngled.y);
	var newDir = pointDir(xParentReal, yParentReal, this.mouseAngled.x, this.mouseAngled.y);

	if (Math.abs(newDir-this.eyeDir) <= this.eyeDirSpeed ||
		Math.abs(newDir-this.eyeDir+360) <= this.eyeDirSpeed)
			this.eyeDir = newDir;

	else if ((this.eyeDir-newDir + 360) % 360 > 180)
		this.eyeDir += this.eyeDirSpeed;
	else
		this.eyeDir -= this.eyeDirSpeed;

	//this.eyeDir += this.dirBase;

	while (this.eyeDir < 0) {
		this.eyeDir += 360;
	}

	while (this.eyeDir >= 360) {
		this.eyeDir -= 360;
	}


	this.dir = this.eyeDir;
	var pos = disDir(this.parent.x, this.parent.y, this.dis, this.dir);
	this.x = pos.x;
	this.y = pos.y;
	this.xReal = this.x-g_g.camera.x;
	this.yReal = this.y-g_g.camera.y;
};

Comrade.prototype.shoot = function() {
	if (this.shootTimer <= 0) {
		if (g_g.mouse.buttons.ld && !g_g.mouse.buttons.lu) {
			var pos = disDir(this.x, this.y, this.r, this.eyeDir);

			g_g.bullets.push(new Bullet(this.side, this, {},
				pos.x, pos.y, this.eyeDir,
				this.bulletRadius, this.bulletRadiusMax, this.bulletRadiusRate,
				this.bulletSpeed, this.bulletDamage));

			this.children++;
			this.shootTimer += this.shootTimerMax;
		}
	} else {
		this.shootTimer--;
	}
};

Comrade.prototype.notifyKill = function(target, info) {
	if (!this.dead) {
		if (this.size >= this.sizeMax) {
			this.size -= this.sizeMax;
			this.levelUp();
			this.parent.addComrade(this);
		} else {
			this.size += this.sizeRate;
		}

		this.r = this.size*(this.rMax-this.rMin)/this.sizeMax + this.rMin;
		this.eyeRadius = this.size*(this.eyeRadiusMax-this.eyeRadiusMin)/this.sizeMax + this.eyeRadiusMin;
		this.eyeDis = this.size*(this.eyeDisMax-this.eyeDisMin)/this.sizeMax + this.eyeDisMin;
	}
};

Comrade.prototype.levelUp = function() {
		this.level++;
		this.hpMax += 20;
		this.hp = this.hpMax;
		this.bulletSpeed += 0.2*g_g.speed;
		this.bulletRadius += 0.2;
		this.bulletRadiusRate += 0.01;
		this.bulletRadiusMax += 0.25;
		this.bulletDamage += 20;
		if (this.level%2 === 0 && this.shootTimerMax > 5)
			this.shootTimerMax -= 1;
}

Comrade.prototype.damage = function(damage, attacker, info) {
	if (!this.dead) {
		this.hp -= damage;
		if (this.hp <= 0) {
			this.hp = 0;
			this.dead = true;
			attacker.notifyKill(this, info);
		}
	}
};

Comrade.prototype.checkCollisionCircle = function(x, y, r) {
	if (pointDis(this.x, this.y, x, y) <= this.r+r)
		return true;

	return false;
};

Comrade.prototype.checkCollisionRect = function(x1, y1, x2, y2) {
	if (this.x+this.r >= x1 && this.x-this.r < x2 &&
		this.y+this.r >= y1 && this.y-this.r < y2) {
			return true;
	}
};

Comrade.prototype.regenerate = function() {
	if (this.hpRegTimer <= 0) {
		if (this.hp < this.hpMax) {
			this.hpRegTimer = this.hpRegTimerMax

			this.hp += this.hpRegAmount;

			if (this.hp > this.hpMax)
				this.hp = this.hpMax
		}
	} else {
		this.hpRegTimer -= 1;
	}
};

Comrade.prototype.draw = function() {
	g_g.ctx.globalAlpha = this.fadingAlpha;

	var xReal = this.x-g_g.camera.x;
	var yReal = this.y-g_g.camera.y;

	var baseColor = new RGBColor (
		Math.round((this.color.base.max.r-this.color.base.min.r)*this.hp/this.hpMax+this.color.base.min.r),
		Math.round((this.color.base.max.g-this.color.base.min.g)*this.hp/this.hpMax+this.color.base.min.g),
		Math.round((this.color.base.max.b-this.color.base.min.b)*this.hp/this.hpMax+this.color.base.min.b));

	//g_g.ctx.fillStyle = this.color.base;
	g_g.ctx.fillStyle = baseColor.rgb;
	//g_g.ctx.strokeStyle = this.color.base;
	g_g.ctx.strokeStyle = baseColor.rgb;
	/*if (this.index == 0)
		g_g.ctx.strokeStyle = "#f00";*/

	g_g.ctx.beginPath();
	g_g.ctx.arc(xReal, yReal,
		this.r, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();


	g_g.ctx.fillStyle = this.color.eye.max.rgb;
	g_g.ctx.strokeStyle = this.color.eye.max.rgb;

	var pos = disDir(this.xReal, this.yReal, this.eyeDis, this.eyeDir);

	g_g.ctx.beginPath();
	g_g.ctx.arc(pos.x, pos.y,
		this.eyeRadius, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();

	g_g.ctx.globalAlpha = 1.0;
};