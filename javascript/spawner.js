/*
	Uses timers to spawn enemies.
*/

Spawner = function() {
	this.spawnTimers = [							// [[current, min, max, delay, decrement]]
		[0, 50, 70, 0, 1],
		[0, 900, 1000, 0, 1],
		[0, 100, 200, 2000, 2]];

	for (var i=0; i<this.spawnTimers.length; ++i) {
		this.spawnTimers[i][1] /= g_g.speed;
		this.spawnTimers[i][2] /= g_g.speed;
		this.spawnTimers[i][3] /= g_g.speed;
		this.spawnTimers[i][0] = this.spawnTimers[i][2];
	}
};

Spawner.prototype.update = function() {
	for (var i=0; i<this.spawnTimers.length; ++i) {
		if (this.spawnTimers[i][3] <= 0) {
			if (this.spawnTimers[i][0] <= 0) {
				this.spawnTimers[i][2] -= this.spawnTimers[i][4];
				if (this.spawnTimers[i][2] < this.spawnTimers[i][1]) {
					this.spawnTimers[i][2] = this.spawnTimers[i][1];
				}
				this.spawnTimers[i][0] = this.spawnTimers[i][2];

				var dis;

				if (pointDis(0, 0, g_g.canvasW/2, g_g.canvasH/2) < 700) {
					dis = 700;
				} else {
					dis = pointDis(0, 0, g_g.canvasW/2, g_g.canvasH/2);
				}

				var dir = randomRange(0, 360);

				var pos = disDir(0, 0, dis, dir);

				g_g.enemies.push(new Enemy(pos.x, pos.y));

			} else {
				this.spawnTimers[i][0]--;
			}
		} else {
			this.spawnTimers[i][3]--;
		}
	}
};