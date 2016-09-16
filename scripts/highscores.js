/* jshint browser: true */
/* jshint -W097 */

"use strict";

var HighScores = {};

Object.defineProperty(HighScores, "KEY", {value: "HIGHSCORES"});

HighScores.init = function () {
    if(!localStorage.getItem(HighScores.KEY)) {
        localStorage.setItem(HighScores.KEY, "[]");
    }
};

HighScores.addScore = function(score) {
    var scores = JSON.parse(localStorage.getItem(HighScores.KEY));
    scores.push(Math.round(score));
    localStorage.setItem(HighScores.KEY, JSON.stringify(scores));
};

HighScores.getScores = function() {
    return JSON.parse(localStorage.getItem(HighScores.KEY));
};

HighScores.getHighestScore = function() {
    return Math.max.apply(null, JSON.parse(localStorage.getItem(HighScores.KEY)));
};
