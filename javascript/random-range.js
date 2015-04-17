/*
	Returns a random integer between two values.
*/

randomRange = function(min, max) {
	return Math.floor(Math.random()*(max-min) + min);
};