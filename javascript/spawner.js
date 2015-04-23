/*
	Uses timers to spawn enemies.
*/

Spawner = function() {
	this.timerMaxs = [60];
	this.timer = [];

	for (var i=0; i<this.timerMaxs; ++i) {
		this.timerMaxs[i] = this.timerMaxs[i]/g_g.speed;
		this.timer.push(this.timerMaxs[i]);
	}
};

Spawner.prototype.update = function() {
	if (this.timer[0] <= 0) {
		this.timer[0] = this.timerMaxs[0];

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
		this.timer[0]--;
	}
};