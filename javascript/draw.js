/*
	Called every update, draws the whole scene.
*/

draw = function() {
	g_g.ctx.fillStyle = "#000";
	g_g.ctx.fillRect(0, 0, g_g.canvasW, g_g.canvasH);


	g_g.ctx.save();
	g_g.ctx.translate(0.5, 0.5);


	g_g.player.draw();

	for (var i=0; i<g_g.enemies.length; ++i) {
		g_g.enemies[i].draw();
	}
	
	for (var i=0; i<g_g.bullets.length; ++i) {
		g_g.bullets[i].draw();
	}

	g_g.camera.draw();

	var comradeHp, comradeHpMax, comradeHpPercent, comradeChildren;
	if (g_g.player.comrades.length > 0) {
		comradeHp = g_g.player.comrades[0].hp;
		comradeHpMax = g_g.player.comrades[0].hpMax;
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
			"Health: " + String(comradeHp) + '/' + String(comradeHpMax) +
				"  " + String(comradeHpPercent) + '%',
			"Children: " + String(comradeChildren)
		], "#f00", 16, "times", 0, 0);
	}

	g_g.ctx.restore();
};