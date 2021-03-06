/*
	The main game loop, updates all the data and calls draw();
*/

update = function() {
	g_g.thisTick = new Date;
	g_g.fps = 1000/(g_g.thisTick-g_g.lastTick);

	g_g.spawner.update();

	g_g.player.update();
	g_g.actionQueue.update();

	for (var i=0; i<g_g.enemies.length; ++i) {
		if (g_g.enemies[i].update()) {
			g_g.enemies.splice(i, 1);
			i--;
		}
	}

	for (var i=0; i<g_g.bullets.length; ++i) {
		if (g_g.bullets[i].update()) {
			g_g.bullets.splice(i, 1);
			i--;
		}
	}

	g_g.camera.update();

	if (g_g.keys.r[g_g.keyMap.p])
		g_g.debugText = !g_g.debugText;

	if (g_g.player.dead && g_g.mouse.buttons.lr)
		reset();

	draw();

	g_g.mouse.buttons.lp = false;
	g_g.mouse.buttons.lr = false;
	g_g.mouse.buttons.rp = false;
	g_g.mouse.buttons.rr = false;

	for (var i=0; i<=222; ++i) {
		g_g.keys.p[i] = false;
	}

	for (var i=0; i<=222; ++i) {
		g_g.keys.r[i] = false;
	}


	g_g.lastTick = g_g.thisTick;
};