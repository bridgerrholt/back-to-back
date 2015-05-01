/*
	Basic enemies that spawn.
*/

Enemy = function(x, y, level) {
	this.side = 2;											// alliance it's on

	this.lifeTimer = 60/g_g.speed;							// the minimum amount of ticks alive

	this.x = x;												// current x position in the world
	this.y = y;												// current y position in the world

	this.xReal = x;											// current x position on the screen
	this.yReal = y;											// current y position on the screen

	this.level = level;										// level of the enemy
	this.levelFractionMax = 10;								// just used for proportions

	this.speed = 5*g_g.speed*g_g.pacing;					// speed in pixels per tick

	this.dead = false;										// whether dead or not
	this.faded = false;										// turns true when fadingAlpha turns 0
	this.fadingAlpha = 1.0;									// the alpha channel while fading

	this.hpMax = Math.round(10/g_g.pacing);					// maximum amount of hp
	this.hpMax = 10;										// maximum amount of hp
	this.hp = this.hpMax;									// current amount of hp
	this.hpRegTimerMax = 10;								// maximum regeneration timer for hp
	this.hpRegTimer = this.hpRegTimerMax;					// current regeneration timer for hp
	this.hpRegAmount = 10;									// hp regenerated whenever hpRegTimer reaches 0

	this.shootFlag = false;									// whether it shoots or not
	this.shootTimerMax = 5/g_g.pacing;						// delay (in updates) per shot
	this.shootTimer = this.shootTimerMax;					// delay (in updates) per shot
	this.bulletSpeed = 10*g_g.pacing;						// speed of fired bullets
	this.bulletRadius = 1;									// starting radius of fired bullets
	this.bulletRadiusMax = 3;								// maximum radius of fired bullets
	this.bulletRadiusRate = 0.05*g_g.pacing;				// increase in radius of fired bullets per update
	this.bulletDamage = 5;									// damage of fired bullets

	this.attack = 30*g_g.pacing;							// damage on collision with player

	this.children = 0;										// amount of other objects (such as bullets)

	/*this.color = {										// all the color information
		base: {
			min: "#f00",
			max: ""},
		eyePupil: "#222",
		eyeIris: "#00f"
	};*/

	this.color = {											// all the color information
		base: {
			min: new RGBColor(127, 0, 0),
			max: new RGBColor(255, 0, 0)
		}, eyePupil: {
			min: new RGBColor(32, 0, 0),
			max: new RGBColor(32, 0, 0)
		}, eyeIris: {
			min: new RGBColor(0, 0, 255),
			max: new RGBColor(0, 0, 255)
		}
	};




	this.comradeAmount = 0									// amount of comrades (catches if it changes)

	for (var i=0; i<g_g.player.comrades.length; ++i) {
		if (!g_g.player.comrades[i].dead)
			this.comradeAmount++;
	}

	if (this.comradeAmount === 0) {
		this.comradeTarget = -1;
	} else {
		this.comradeTarget = randomRange (					// index of the comrade it's going for
			0, this.comradeAmount);
	}

	var randomPos = {
		x: randomRange(g_g.canvasW*0.25, g_g.canvasW*0.75),
		y: randomRange(g_g.canvasH*0.25, g_g.canvasH*0.75)
	};

	this.dir = pointDir(this.x, this.y,						// the direction to go if there aren't any comrades
		randomPos.x, randomPos.y);
	console.log(randomPos.x, randomPos.y);


	var rMin = 13;
	var rMax = 26;


	this.rMin = rMin;										// minimum radius
	this.r = this.rMin;										// current radius
	this.rMax = rMax;										// maximum radius


	this.eyeRadiusMin = 2.5;								// minimum eye radius
	this.eyeRadius = this.eyeRadiusMin;						// current eye radius
	this.eyeRadiusMax = 5;									// maximum eye radius

	this.eyeDisMin =										// minimum eye distance
		rMin-this.eyeRadiusMin-1;
	this.eyeDis = this.eyeDisMin;							// current eye distance
	this.eyeDisMax =										// maximum eye distance
		rMax-this.eyeRadiusMax-2;

	this.eyeDir = 0;										// current eye direction (in degrees)
	this.eyeDirSpeed = 4;									// amount of possible degrees changed per update

	this.applyLevel();
};

Enemy.prototype.applyLevel = function() {
	var levelInc = this.level+1;

	this.r = (this.rMax-this.rMin) *
		levelInc/this.levelFractionMax+this.rMin;
	this.eyeRadius = (this.eyeRadiusMax-this.eyeRadiusMin) *
		levelInc/this.levelFractionMax+this.eyeRadiusMin;
	this.eyeDis = (this.eyeDisMax-this.eyeDisMin) *
		levelInc/this.levelFractionMax+this.eyeDisMin;

	if (this.r > this.rMax)
		this.r = this.rMax;
	if (this.eyeRadius > this.eyeRadiusMax)
		this.eyeRadius = this.eyeRadiusMax;
	if (this.eyeDis > this.eyeDisMax)
		this.eyeDis = this.eyeDisMax;


	for (var i=0; i<this.level; ++i) {
		this.hpMax += 10*g_g.pacing;
		this.speed += 0.1*g_g.speed*g_g.pacing;
	}

	this.hp = this.hpMax;
};

Enemy.prototype.update = function() {
	if (this.lifeTimer > 0)
		this.lifeTimer--

	if (!this.dead) {
		this.xReal = this.x-g_g.camera.x;
		this.yReal = this.y-g_g.camera.y;

		var newComradeAmount = 0
		for (var i=0; i<g_g.player.comrades.length; ++i) {
			if (!g_g.player.comrades[i].dead)
				newComradeAmount++;
		}

		if (newComradeAmount !== this.comradeAmount) {
			this.comradeAmount = newComradeAmount;

			if (this.comradeAmount === 0) {
				this.comradeTarget = -1;
			} else {
				this.comradeTarget = randomRange(0, this.comradeAmount);
			}
		}

		if (this.comradeTarget !== -1) {
			if (pointDis(this.xReal, this.yReal,
				g_g.player.comrades[this.comradeTarget].x, g_g.player.comrades[this.comradeTarget].y) > this.r) {
					this.eyePosition();
			}

			//if (pointDis(this.xReal, this.yReal, g_g.player.x, g_g.player.y) > this.r+g_g.player.r) {
				this.move();
			//}

			this.checkCollision()
		} else {
			var pos = disDir(this.x, this.y, this.speed, this.dir);

			this.x = pos.x;
			this.y = pos.y;

			this.eyeDir = this.dir;

			if (this.lifeTimer <= 0 && this.checkOffScreen())
				this.dead = true;
		}




		//this.shoot();

		//this.regenerate();

		return false;
	} else {
		this.fadingAlpha -= 0.15;
		if (this.fadingAlpha <= 0.1) {
			this.fadingAlpha = 0.0;
			this.faded = true;
		}

		if (this.children <= 0 && this.faded)
			return true;
		else
			return false;
	}
};

Enemy.prototype.move = function() {
	this.dir = pointDir(this.x, this.y,
		g_g.player.comrades[this.comradeTarget].x, g_g.player.comrades[this.comradeTarget].y);
	var pos = disDir(this.x, this.y, this.speed, this.dir);

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

Enemy.prototype.notifyKill = function(target, info) {

};

Enemy.prototype.damage = function(damage, attacker, info) {
	this.hp -= damage;
	if (this.hp <= 0) {
		this.hp = 0;
		this.dead = true;
		attacker.notifyKill(this, info);
	}
};

Enemy.prototype.checkCollision = function() {
	this.checkCollisionPlayer()
};

Enemy.prototype.checkCollisionPlayer = function() {
	var comradeCollisions = g_g.player.checkCollisionCircle (
		this.x, this.y, this.r);

	for (var i=0; i<comradeCollisions.length; ++i) {
		if (!comradeCollisions[i].dead) {
			g_g.player.damage(this.attack/comradeCollisions.length, this, comradeCollisions[i].index);

			this.hp = 0;
			this.dead = true;
		}
	}

	for (var i=0; i<comradeCollisions.length; ++i) {
		if (!comradeCollisions[i].dead) {
			var pos = disDir(comradeCollisions[i].x, comradeCollisions[i].y,
				comradeCollisions[i].r+this.r+1,
				pointDir(comradeCollisions[i].x, comradeCollisions[i].y, this.x, this.y));

			this.x = pos.x;
			this.y = pos.y;

			break;
		}
	}
};

Enemy.prototype.checkCollisionCircle = function(x, y, r) {
	if (x+r >= this.x-this.r && x-r < this.x+this.r &&
		y+r >= this.y-this.r && y-r < this.y+this.r) {
			return true;
	}

	return false;

	/*if (Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2) <= Math.pow(r-this.r, 2)) {
			return true;
	}

	return false;*/
};

Enemy.prototype.checkOffScreen = function() {		// returns true if off the screen
	var xReal = this.x-g_g.camera.x;
	var yReal = this.y-g_g.camera.y;

	if (xReal+this.r <= -200 || xReal-this.r > g_g.canvasW+200 ||
		yReal+this.r <= -200 || yReal-this.r > g_g.canvasH+200) {
			return true;
	} else {
		return false;
	}
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
	g_g.ctx.globalAlpha = this.fadingAlpha;

	var xReal = this.x-g_g.camera.x;
	var yReal = this.y-g_g.camera.y;

	var baseColor = new RGBColor (
		Math.round((this.color.base.max.r-this.color.base.min.r)*this.hp/this.hpMax+this.color.base.min.r),
		Math.round((this.color.base.max.g-this.color.base.min.g)*this.hp/this.hpMax+this.color.base.min.g),
		Math.round((this.color.base.max.b-this.color.base.min.b)*this.hp/this.hpMax+this.color.base.min.b));

	g_g.ctx.fillStyle = baseColor.rgb;
	g_g.ctx.strokeStyle = baseColor.rgb;

	g_g.ctx.beginPath();
	g_g.ctx.arc(xReal, yReal,
		this.r, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();


	var pos;

	/*if (this.comradeTarget !== 0)
		pos = {x: xReal, y: yReal};
	else*/
		pos = disDir(this.xReal, this.yReal, this.eyeDis, this.eyeDir);

	g_g.ctx.fillStyle = this.color.eyePupil.max.rgb;
	g_g.ctx.strokeStyle = this.color.eyePupil.max.rgb;

	g_g.ctx.beginPath();
	g_g.ctx.arc(pos.x, pos.y,
		this.eyeRadius, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();

	g_g.ctx.globalAlpha = 1.0;
};