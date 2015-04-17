/*
	Draws multi-line text where each line is customized.
*/

	/*
		[text, color, size, font]
		text = [
			["Hello!", "blue", 25, "Georgia"],
			[12345, "#ff0000, 12, "Times"]
		];
	*/

drawTextExt = function(text, x, y) {
	y += text[0][2];
	for (var i=0; i<text.length; i++) {
		ctx.font = String(text[i][2]) + "px " + text[i][3];
		ctx.fillStyle = text[i][1];
		ctx.fillText(String(text[i][0]), x, y);
		y += text[i][2];
		if (text.length-1 != i) {
			y += Math.abs(text[i][2]-text[i+1][2]);
		}
	}
};