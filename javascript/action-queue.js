/*
	The handler for special powers.
*/

ActionQueue = function() {
	this.queue = [];

	this.w = 1000;
	this.h = 64;

	this.align = {
		x: 0,
		y: 1
	};

	this.anchor = {								// horizontal and vertical clamping on the screen
		x: 0,
		y: 1
	};

	this.offset = {
		x: 30,
		y: -100
	};

	this.x = g_g.canvasW*this.anchor.x + this.offset.x;
	this.y = g_g.canvasH*this.anchor.y + this.offset.y;

	console.log(this.x);
	console.log(this.y);
};

ActionQueue.prototype.update = function() {
	this.x = g_g.canvasW*this.anchor.x - this.offset.x;
	this.y = g_g.canvasH*this.anchor.y - this.offset.y;
};

ActionQueue.prototype.draw = function() {
	console.log("draw");

	g_g.ctx.fillStyle = "#fff";
	g_g.ctx.strokeStyle = "#f00";

	//g_g.ctx.beginPath();
	g_g.ctx.strokeRect(this.x, this.y - this.h*this.align.y, this.w, this.h);
	//g_g.ctx.stroke();
};





