/*
	Returns the direction (in degrees) between two points.
*/

pointDir = function(x1, y1, x2, y2) {
	return Math.atan2((y2-y1), (x2-x1)) * (180 / Math.PI);
};