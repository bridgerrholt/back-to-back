/*
	Sets up how all the input will affect data structures.
*/

setInputCallbacks = function() {
	// mouse location and buttons
	g_g.mouse = {
		x: Math.floor(g_g.canvasW/2),
		y: Math.floor(g_g.canvasH/2),
		xReal: 0,
		yReal: 0,
		buttons: {
			ld: false,				// left down
			lp: false,				// left pressed
			lr: false,				// left released
			lu: false,				// left used (true when click activates something, false when it unactivates it 
									// example: true when clicking on menu pane to drag it, false when released))

			rd: false,				// right down
			rp: false,				// right pressed
			rr: false,				// right released
			ru: false				// right used (true when click activates something, false when it unactivates it 
		}							// example: true when clicking on menu pane to drag it, false when released))
	};


	// keys press, down, and release
	g_g.keys = {
		d: [],						// key down
		p: [],						// key pressed
		r: []						// key released
	};

	var jQueryKeyAmount = 222;

	for (var i=0; i<=jQueryKeyAmount; ++i) {
		g_g.keys.d[i] = false;
	}

	for (var i=0; i<=jQueryKeyAmount; ++i) {
		g_g.keys.p[i] = false;
	}

	for (var i=0; i<=jQueryKeyAmount; ++i) {
		g_g.keys.r[i] = false;
	}

	g_g.keyMap = {
		shift: 16,
		spacebar: 32,
		e: 69,
		i: 73,
		o: 79,
		p: 80,
		q: 81,
		w: 87
	};


	// turns off right click dialogue box
	$(document).on("contextmenu", "canvas", function(e) {
		return false;
	});


	// tracks the mouse position
	document.addEventListener("mousemove", function(evt) {
		var rect = g_g.canvas.getBoundingClientRect();
		g_g.mouse.x = evt.clientX-rect.left;
		g_g.mouse.y = evt.clientY-rect.top;
		//var message = 'Mouse position: ' + g_g.mouse.x + ',' + g_g.mouse.y;
		//console.log(message);
	}, false);


	// gets the moment the mouse is pressed down
	document.onmousedown = function(e) {
		var left, right;
		left = (navigator.appName == "Microsoft Internet Explorer") ? 1 : 0;
		right = 2;

		if (e.button == left) {
			g_g.mouse.buttons.lp = true;
			g_g.mouse.buttons.ld = true;

		} else if (e.button == right) {
			g_g.mouse.buttons.rp = true;
			g_g.mouse.buttons.rd = true;
			g_g.mouse.buttons.ru = false;
		}
	};


	// gets the moment the mouse is released up
	document.onmouseup = function(e) {
		var left, right;
		left = (navigator.appName == "Microsoft Internet Explorer") ? 1 : 0;
		right = 2;

		if (e.button === left) {
			g_g.mouse.buttons.ld = false;
			g_g.mouse.buttons.lr = true;

		} else if (e.button === right) {
			g_g.mouse.buttons.rd = false;
			g_g.mouse.buttons.rr = true;
			g_g.mouse.buttons.ru = false;
		}
	};


	// gets the moment keys are pressed down
	$(document).keydown(function(e) {
		g_g.keys.p[e.which] = true;
		g_g.keys.d[e.which] = true;
	});
	

	// gets the moment keys are released up
	$(document).keyup(function(e) {
		g_g.keys.d[e.which] = false;
		g_g.keys.r[e.which] = true;
	});


	// sets the window to the browser's window
	$(window).resize(function() {
		g_g.canvas.width = window.innerWidth;
		g_g.canvas.height = window.innerHeight;
		g_g.canvasW = g_g.canvas.width;
		g_g.canvasH = g_g.canvas.height;
	});
};