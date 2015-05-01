/*
	An RGB color structure.
*/

RGBColor = function(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.rgb = "RGB(" +
		String(this.r) + ',' +
		String(this.g) + ',' +
		String(this.b) + ')';
};