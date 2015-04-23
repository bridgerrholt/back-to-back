/*
	Defines all the data to be used.
*/

var g_g = {};							// all the globally available data (global_game)

// init()
g_g.canvas;								// canvas element
g_g.ctx;								// drawing context for the canvas
g_g.canvasW;							// width of the canvas
g_g.canvasH;							// height of the canvas
g_g.gameLoop;							// holds the canvas game loop

g_g.frameRate;							// maximum FPS
g_g.fps;								// current FPS
g_g.lastTick;							// milliseconds of the last update
g_g.thisTick;							// milliseconds of the current update
g_g.speed;								// the frameRate as compared to 60 FPS (multiply with all speeds)
g_g.debugText;							// whether or not text for debugging purposes should be drawn

g_g.camera = {};						// data for the single Camera() instance


// setInputCallbacks()
g_g.mouse = {};							// mouse location and buttons
g_g.keys = {};							// keys press, down, and release
g_g.keyMap = {};						// converts english into array indexes


// reset()
g_g.spawner = {};

g_g.player = {};
g_g.enemies = [];
g_g.bullets = [];



// objects
function Camera(){}
function Spawner(){}
function Player(){}
function Enemy(){}
function Bullet(){}

// functions
function pointDir(){}
function pointDis(){}
function disDir(){}
function roundFloat(){}
function randomRange(){}

function update(){}
function setInputCallbacks(){}
function draw(){}
function drawText(){}
function drawTextExt(){}

function init(){}
function reset(){}