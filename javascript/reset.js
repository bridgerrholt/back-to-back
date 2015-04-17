/*
	Everything that should happen whenever the game is restarted, also called in init().
*/

reset = function() {
	g_g.player = new Player(0, 0);
	g_g.bullets = [];
};