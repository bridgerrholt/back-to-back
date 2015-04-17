/*
	Draws multi-line text based off a single font customization.
*/

	/*
		[text, color, size, font]
		text = [
			["Hello!", "blue", 25, "Georgia"],
			[12345, "#ff0000", 12, "Times"]
		];
	*/
	
drawText = function(ctx, text, color, size, font, x, y) {
	y += size;
	ctx.font = String(size) + "px " + font;
	ctx.fillStyle = color;
	
	for (var i=0; i<text.length; i++) {
		ctx.fillText(String(text[i]), x, y);
		y += size;
	}
};