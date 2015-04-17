/*
	Provides the means for objects to be drawn based off the position in the world.
*/

Camera = function(x, y) {
	this.x = x-Math.floor(g_g.canvasW/2);
	this.y = y-Math.floor(g_g.canvasH/2);
};

Camera.prototype.update = function() {
	this.x = g_g.player.x-Math.floor(g_g.canvasW/2);
	this.y = g_g.player.y-Math.floor(g_g.canvasH/2);
};


Camera.prototype.draw = function() {
	/*g_g.ctx.beginPath();
	g_g.ctx.arc(
		this.target.x+Math.floor(g_g.canvasW/2)-this.x,
		this.target.y+Math.floor(g_g.canvasH/2)-this.y,
		2, 0, 2*Math.PI);

	g_g.ctx.fillStyle = "#F00"
	g_g.ctx.fill();*/
};