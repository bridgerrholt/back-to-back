/*
	Everything that should happen when the page is opened or refreshed.
*/

init = function() {
	g_g.frameRate = 60;
	g_g.fps = g_g.frameRate;
	g_g.lastTick = new Date;
	g_g.thisTick = new Date;
	g_g.speed = 60/g_g.frameRate;

	g_g.canvas = document.getElementById("main-canvas"),
	g_g.ctx = g_g.canvas.getContext("2d");
	g_g.canvas.width = window.innerWidth;
	g_g.canvas.height = window.innerHeight;
	g_g.canvasW = g_g.canvas.width;
	g_g.canvasH = g_g.canvas.height;
	g_g.debugText = false;

	g_g.camera = new Camera(0, 0);

	setInputCallbacks();

	reset();

	if(typeof g_g.gameLoop != "undefined") clearInterval(g_g.gameLoop);
	g_g.gameLoop = setInterval(update, 1000/g_g.frameRate);
};