/*
	Uses timers to spawn enemies.
*/

Spawner = function() {
	this.spawnTimers = [							// [[current, min, max, delay, decrement, level]]
		[0, 50, 150, -150, 1, 0],					// if delay is negative, decreases the current timer by the abs of that amount,
		[0, 900, 1000, 0, 1, 1],					//  effectively allowing you to have timers first start at 0
		[0, 100, 200, 2000, 2, 2],
		[0, 100, 500, 3000, 5, 3],
		[0, 50, 1000, 5400, 10, 4],
		[0, 50, 100, 7200, 10, 5],
		[0, 150, 200, 10000, 10, 7],
		[0, 150, 500, 12000, 10, 7]];

	for (var i=0; i<this.spawnTimers.length; ++i) {
		this.spawnTimers[i][1] /= g_g.speed;
		this.spawnTimers[i][2] /= g_g.speed;
		this.spawnTimers[i][3] /= g_g.speed;
		this.spawnTimers[i][0] = this.spawnTimers[i][2];

		this.spawnTimers[i][1] = Math.round(this.spawnTimers[i][1]/g_g.pacing)
		this.spawnTimers[i][2] = Math.round(this.spawnTimers[i][2]/g_g.pacing)
		this.spawnTimers[i][3] = Math.round(this.spawnTimers[i][3]/g_g.pacing)
		this.spawnTimers[i][4] = Math.round(this.spawnTimers[i][4]*g_g.pacing)
	}
};

Spawner.prototype.update = function() {
	for (var i=0; i<this.spawnTimers.length; ++i) {
		if (this.spawnTimers[i][3] <= 0) {

			if (this.spawnTimers[i][3] < 0) {
				this.spawnTimers[i][0] += this.spawnTimers[i][3];
				this.spawnTimers[i][3] = 0;
			}

			if (this.spawnTimers[i][0] <= 0) {

				if (g_g.level === i && !g_g.player.dead)
					g_g.level++;

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

				g_g.enemies.push(new Enemy(pos.x, pos.y, this.spawnTimers[i][5]));

			} else {
				this.spawnTimers[i][0] -= 1;
			}
		} else {
			this.spawnTimers[i][3]--;
		}
	}
};