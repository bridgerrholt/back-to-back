/*
	Called every update, draws the whole scene.
*/

draw = function() {
	// background
	g_g.ctx.fillStyle = "#000";
	g_g.ctx.fillRect(0, 0, g_g.canvasW, g_g.canvasH);


	// draw
	g_g.ctx.save();
	g_g.ctx.translate(0.5, 0.5);


	g_g.player.draw();

	for (var i=0; i<g_g.enemies.length; ++i) {
		g_g.enemies[i].draw();
	}
	
	for (var i=0; i<g_g.bullets.length; ++i) {
		g_g.bullets[i].draw();
	}


	// draw end
	g_g.actionQueue.draw();
	g_g.camera.draw();

	g_g.ctx.textAlign = "right";
	drawText(g_g.ctx, [
		String(g_g.level)
	], "#f00", 42, "times", g_g.canvasW-15, 5);

	if (g_g.player.dead) {
		g_g.ctx.textAlign = "center";

		drawText(g_g.ctx, [
			"YOU DIED"
		], "#b00", 100, "times", Math.floor(g_g.canvasW/2), Math.floor(g_g.canvasH/2) - Math.floor(g_g.canvasH/2)/3);

		drawText(g_g.ctx, [
			"(click to restart)"
		], "#b00", 32, "times", Math.floor(g_g.canvasW/2), Math.floor(g_g.canvasH/2) - Math.floor(g_g.canvasH/2)/10);
	}

	g_g.ctx.textAlign = "left";

	var comradeHp, comradeHpMax, comradeHpPercent, comradeChildren;
	if (g_g.player.comrades.length > 0) {
		comradeHp = roundFloat(g_g.player.comrades[0].hp, 2);
		comradeHpMax = roundFloat(g_g.player.comrades[0].hpMax, 2);
		comradeHpPercent = roundFloat(comradeHp/comradeHpMax*100, 2);
		comradeChildren = g_g.player.comrades[0].children;
	} else {
		comradeHp = 0;
		comradeHpMax = 0;
		comradeHpPercent = 0.0;
		comradeChildren = 0;
	}

	if (g_g.debugText) {
		drawText(g_g.ctx, [
			"FPS: " + String(roundFloat(g_g.fps, 1)),
			"Camera: " + String(roundFloat(g_g.camera.x, 1)) + ", " + String(roundFloat(g_g.camera.y, 1)),
			"Mouse: " + String(g_g.mouse.x) + ", " + String(g_g.mouse.y),
			"Bullets: " + String(g_g.bullets.length),
			"Health: " + String(comradeHp, 2) + '/' + String(comradeHpMax, 2) +
				"  " + String(comradeHpPercent) + '%',
			"Children: " + String(comradeChildren)
		], "#f00", 16, "times", 0, 0);
	}

	g_g.ctx.restore();
};