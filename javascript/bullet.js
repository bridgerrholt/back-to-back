/*
	A simple bullet.
*/

Bullet = function(side, x, y, dir, r, rMax, rRate, speed, damage) {
	this.side = side;								// the alliance it's on

	this.x = x;										// current x position in the world
	this.y = y;										// current y position in the world

	this.dir = dir;									// direction (in degrees) the bullet is traveling

	this.r = r;										// current radius
	this.rMax = rMax;								// maximum radius
	this.rRate = rRate;								// increase in radius per update

	this.speed = speed;								// current speed
	this.damage = damage;							// the damage delt to objects

	this.delay = 1;									// a delay so that it doesn't spawn far from the shooter
};

Bullet.prototype.update = function() {				// returns true if dead
	if (this.delay == 0) {
		if (this.r < this.rMax) {
			this.r += this.rRate;

			if (this.r > this.rMax)
				this.r = this.rMax;
		}

		var pos = disDir(this.x, this.y, this.speed, this.dir);

		this.x = pos.x;
		this.y = pos.y;

		if (this.checkOffScreen() || this.checkCollision()) {
			return true;
		}

	} else {
		this.delay--;
	}

	return false;
};

Bullet.prototype.checkOffScreen = function() {		// returns true if off the screen
	var xReal = this.x-g_g.camera.x;
	var yReal = this.y-g_g.camera.y;

	if (xReal+this.r <= -200 || xReal-this.r > g_g.canvasW+200 ||
		yReal+this.r <= -200 || yReal-this.r > g_g.canvasH+200) {
			return true;
	} else {
		return false;
	}
};

Bullet.prototype.checkCollision = function() {
	var collide = false;

	if (this.side !== 1) {
		if (g_g.player.checkCollisionBullet(this.x, this.y, this.r)) {
			collide = true;
			g_g.player.damage(this.damage);
			return true;
		}
	}

	if (this.side !== 2) {
		for (var i = 0; i < g_g.enemies.length; ++i) {
			if (g_g.enemies[i].checkCollisionBullet(this.x, this.y, this.r)) {
				collide = true;
				g_g.enemies[i].damage(this.damage);
				return true;
			}
		}
	}

	return collide;
};

Bullet.prototype.draw = function() {
	g_g.ctx.fillStyle = "#fff";
	g_g.ctx.strokeStyle = "#fff";

	g_g.ctx.beginPath();
	g_g.ctx.arc(this.x-g_g.camera.x, this.y-g_g.camera.y,
		this.r, 0, 2*Math.PI);

	g_g.ctx.fill();
	g_g.ctx.stroke();
};





