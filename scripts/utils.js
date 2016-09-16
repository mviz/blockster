/* jshint browser: true */
/* jshint -W097 */
"use strict";

var Utils = {};

Utils.randomRange = function(min, max) {
	return Math.random() * (max - min) + min;
};

//http://stackoverflow.com/a/8721483 needed a quick solution
Utils.contains = function (point, points) {

    var result = false;
    var j = points.length - 1;

    for (var i = 0; i < points.length; j = i++) {
        if ((points[i].y > point.y) != (points[j].y > point.y) &&
  	      (point.x < (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y-points[i].y) + points[i].x)) {
    	    result = !result;
       	}
    }

    return result;
};
