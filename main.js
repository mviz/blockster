//TODO: if you restart a LOT of times then you will end up breaking the stack.
//TODO: blocks can appear too close to the top and bottom (some are actually overlapping the edges)
//TODO: implement high score with cookies (or a node instance.....)
//TODO: it says press space to continue even on mobile
//TODO: touch is broken, really broken
//TODO: multipliers shouldn't overlap anything either

//NOTE: Some of this uses Function.bind(), this is only available in new browsers.


Object.defineProperty(Engine, "SPACE_BAR", {value: 32});

function Engine() {
    this.canvas = document.getElementById("gameCanvas");
    this.context = this.canvas.getContext("2d");
    this.frameRate = 60;

    this.init();
}

Engine.prototype.init = function() {
    this.world = new World();
    this.graphics = new Graphics(this.world, this.canvas, this.context);

    this.paused = false;

    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    this.canvas.addEventListener("touchstart", this.world.player.jump.bind(this.world.player), false);
    this.canvas.removeEventListener("touchstart", this.restart.bind(this), false);
}

Engine.prototype.start = function() {
    this.interval = setInterval(this.tick.bind(this), 1/(this.frameRate * 1000));
}

Engine.prototype.restart = function(event) {
    if(event !== undefined) {
        event.preventDefault();
    }

    this.init();
    this.start();
}

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
}

Engine.prototype.keyDownHandler = function (event) {
    if (event.keyCode == Engine.SPACE_BAR) {
        if (!this.paused) {
            event.preventDefault();
            this.world.player.jump();
        } else {
            this.restart();
        }
    }
}

var engine = new Engine();
engine.start();