/* jshint browser: true */
/* jshint -W097 */
/* global World */
/* global Graphics */

"use strict";

//TODO: if you restart a LOT of times then you will end up breaking the stack. recursion yo.

//TODO: implement high score with cookies (or a node instance.....)
//TODO: integrate with Facebook

//TODO: make sure you can always jump between blocks. What if we just drew a circle around each block and spawned them every time the last block doesn't have one (within that range), AND randomly spawna block every (1 -> rand) seconds

//TODO: make cool graphics
//TODO: add more animations and stuff.
//TODO: Game needs rebalancing, it's super hard to do anything now.

//BUG: it says press space to continue even on mobile
//BUG: touch is broken, really broken

Object.defineProperty(Engine, "SPACE_BAR", {value: 32});

function Engine() {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");

    this.init();
}

Engine.prototype.init = function() {
    this.world = new World();
    this.graphics = new Graphics(this.world, this.canvas, this.context);

    window.addEventListener("resize", this.graphics.resizeCanvas());

    this.prev = null;

    document.addEventListener("keypress", this.keyDownHandler.bind(this), false);
    this.canvas.addEventListener("touchstart", this.world.player.jump.bind(this.world.player), false);
    this.canvas.removeEventListener("touchstart", this.restart.bind(this), false);
};

Engine.prototype.start = function() {
    requestAnimationFrame(this.tick.bind(this));
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
    }

    this.graphics.draw(deltaTime);

    requestAnimationFrame(this.tick.bind(this));
};

Engine.prototype.keyDownHandler = function (event) {
    if (event.keyCode == Engine.SPACE_BAR) {
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
