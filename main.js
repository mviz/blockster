//TODO: if you restart a LOT of times then you will end up breaking the stack. recursion yo.

//TODO: implement high score with cookies (or a node instance.....)
//TODO: integrate with Facebook

//TODO: make sure you can always jump between blocks. What if we just drew a circle around each block and spawned them every time the last block doesn't have one (within that range), AND randomly spawna block every (1 -> rand) seconds

//TODO: make cool graphics
//TODO: add more animations and stuff.
//TODO: Use requestAnimationFrame and change the jump/gravity stuff to use time differences for variable framerates

//BUG: the game plays at different speeds on different computers

//BUG: it says press space to continue even on mobile
//BUG: touch is broken, really broken

"use strict";

Object.defineProperty(Engine, "SPACE_BAR", {value: 32});

function Engine() {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");
    this.frameRate = 200;

    this.init();
}

Engine.prototype.init = function() {
    this.world = new World();
    this.graphics = new Graphics(this.world, this.canvas, this.context);

    this.paused = false;

    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    this.canvas.addEventListener("touchstart", this.world.player.jump.bind(this.world.player), false);
    this.canvas.removeEventListener("touchstart", this.restart.bind(this), false);
};

Engine.prototype.start = function() {
    this.interval = setInterval(this.tick.bind(this), 1000/(this.frameRate));
};

Engine.prototype.restart = function(event) {
    if(event !== undefined) {
        event.preventDefault();
    }

    this.init();
    this.start();
};

Engine.prototype.tick = function() {

    if(this.world.player.isDead(this.world)) {

        this.graphics.drawEndScene(this.world.player.score);
        this.paused = true;

        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        this.canvas.addEventListener("touchstart", this.restart.bind(this), false);

        clearInterval(this.interval);

        return;
    }

    this.world.tick();
    this.graphics.draw();
}; 

Engine.prototype.keyDownHandler = function (event) {
    if (event.keyCode == Engine.SPACE_BAR) {
        if (!this.paused) {
            event.preventDefault();
            this.world.player.jump();
        } else {
            this.restart();
        }
    }
};

var engine = new Engine();
engine.start();