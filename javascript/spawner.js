/*
	Uses timers to spawn enemies.
*/

Spawner = function() {
	this.spawnTimerMaxs = [70, 1000];
	this.spawnTimerMins = [50, 900];
	this.spawnTimers = [];

	for (var i=0; i<this.spawnTimerMaxs.length; ++i) {
		this.spawnTimerMaxs[i] = this.spawnTimerMaxs[i]/g_g.speed;
		this.spawnTimers.push(this.spawnTimerMaxs[i]);
	}
};

Spawner.prototype.update = function() {
	for (var i=0; i<this.spawnTimers.length; ++i) {
		if (this.spawnTimers[i] <= 0) {
			this.spawnTimerMaxs[i]--;
			if (this.spawnTimerMaxs[i] < this.spawnTimerMins[i]) {
				this.spawnTimerMaxs[i] = this.spawnTimerMins[i];
			}
			this.spawnTimers[i] = this.spawnTimerMaxs[i];

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
			this.spawnTimers[i]--;
		}
	}
};