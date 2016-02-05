/* jshint browser: true */
/* jshint -W097 */
/* global HighScores */
/* global World */
/* global Graphics */

"use strict";

//TODO: integrate with Facebook

//TODO: make cool graphics
//TODO: add more animations and stuff.

//TODO: make platforms skinnier then make it so you can go through the bottom of them?
//This would require predictive collision detection.
//This would solve jitter problems and stuff.

//BUG: There's a really weird bug where the game restarts using touch randomly...
//BUG: Sometimes you fall through blocks...

Object.defineProperty(Engine, "SPACE_BAR", {value: 32});

function Engine() {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");
    HighScores.init();

    this.init();
}

Engine.prototype.init = function() {


    this.world = new World();
    this.graphics = new Graphics(this.world, this.canvas, this.context, false);

    window.addEventListener("resize", this.graphics.resizeCanvas());

    this.playerPrevAlive = true;

    document.addEventListener("visibilitychange", this.pause.bind(this), false);
    document.addEventListener("keypress", this.keyDownHandler.bind(this), false);
    this.canvas.addEventListener("touchstart", this.keyDownHandler.bind(this), false);
};

Engine.prototype.pause = function() {
    if(!document.hidden) {
        this.start();
    } else {
        cancelAnimationFrame(this.requestAnimationFrameId);
    }
};

Engine.prototype.start = function() {
    this.prev = null;
    this.requestAnimationFrameId = requestAnimationFrame(this.tick.bind(this));
};

Engine.prototype.restart = function(event) {
    if(event !== undefined) {
        event.preventDefault();
    }

    this.init();
    this.start();
};

Engine.prototype.tick = function(timestamp) {
    if(!this.prev) {
        this.prev = timestamp;
    }

    var deltaTime = timestamp - this.prev;
    this.prev = timestamp;

    if(!this.world.player.isDead(this.world)) {
        this.world.tick(deltaTime);
    } else if(this.playerPrevAlive) {

        HighScores.addScore(this.world.player.score);
        this.playerPrevAlive = false;
    }

    this.graphics.draw(deltaTime);

    this.requestAnimationFrameId = requestAnimationFrame(this.tick.bind(this));
};

Engine.prototype.keyDownHandler = function (event) {
    if (event.keyCode == Engine.SPACE_BAR || event.type === "touchstart") {
        if (!this.world.player.isDead(this.world)) {
            this.world.player.jump();
            event.preventDefault();
        } else {
            this.restart();
            event.preventDefault();
        }
    }
};

var engine = new Engine();
engine.start();
