/*
	A wrapper for all the objects the player controls.
*/

Player = function(x, y) {
	this.side = 1;									// the alliance it's on

	this.x = x;										// current x position in the world
	this.y = y;										// current y position in the world

	this.xReal = x;									// current x position on the screen
	this.yReal = y;									// current y position on the screen

	this.comrades = [								// all the comrades the player controls
		new Comrade(this.x, this.y,
			0, 0, 0, this, 0)
	];


	this.dead = false;								// whether dead or not
};

Player.prototype.damage = function(damage, attacker, comradeIndex) {
	this.comrades[comradeIndex].damage(damage, attacker);
};

Player.prototype.update = function() {
	if (!this.dead) {
		var deletedAmount = 0;
		for (var i=0; i<this.comrades.length; ++i) {
			this.comrades[i].index = i;
			if (this.comrades[i].update()) {
				this.subComrade(i);
				if (this.comrades[i].children <= 0) {
					this.comrades.splice(i, 1);
					i--;
					deletedAmount++;
				}
			}
		}

		if (this.comrades.length <= 0)
			this.dead = true;

		return false;
	} else {
		return true;
	}
};

Player.prototype.addComrade = function(comradeFrom) {
	var dir = 0;
	var dirChange = 360 / (this.comrades.length+1);
	var dis = 15 * (this.comrades.length+1);

	for (var i=0; i<this.comrades.length; ++i) {
		this.comrades[i].dirBase = dir;
		this.comrades[i].dis = dis;
		dir += dirChange;
	}

	this.comrades.push(new Comrade(this.x, this.y, dis, comradeFrom.dir, dir, this, this.comrades.length));
};

Player.prototype.subComrade = function(index) {
	if (!this.comrades[index].released) {
		this.comrades[index].released = true;

		var dir = 0;
		var dirChange = 360 / (this.comrades.length-1);
		var dis = 15 * (this.comrades.length-1);

		for (var i=0; i<this.comrades.length; ++i) {
			if (!this.comrades[i].dead) {
				this.comrades[i].dirBase = dir;
				this.comrades[i].dis = dis;
				dir += dirChange;
			}
		}
	}
};

Player.prototype.checkCollisionCircle = function(x, y, r) {
	var comradeCollisions = [];
	for (var i=0; i<this.comrades.length; ++i) {
		if (this.comrades[i].checkCollisionCircle(x, y, r))
			comradeCollisions.push(i);
	}

	return comradeCollisions;
};

Player.prototype.checkCollisionRect = function(x1, y1, x2, y2) {
	var comradeCollisions = [];
	for (var i=0; i<this.comrades.length; ++i) {
		if (this.comrades[i].checkCollisionRect(x1, y1, x2, y2))
			comradeCollisions.push(i);
	}

	return comradeCollisions;
};

Player.prototype.draw = function() {
	for (var i=0; i<this.comrades.length; ++i) {
		this.comrades[i].draw();
	}
};