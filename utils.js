Utils = {};

Utils.randomRange = function(min, max) {
	return Math.random() * (max - min) + min;
};