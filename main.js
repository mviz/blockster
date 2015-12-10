//TODO: get rid of the rest of the globals
//TODO: fix scaling issues with game_width
//TODO: implement high score with cookies (or a node instance.....)

//NOTE: I use Function.bind(), this is only available in new browsers.

var FRAME_RATE = 60;
var SPACE_BAR = 32;

var game_width = 480; //TODO: move these to world
var game_height = 320;

//TODO: move this to the Graphics class
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerWidth * game_height/game_width;
if(canvas.height > window.innerHeight){
    canvas.height = window.innerHeight;
    canvas.width = window.innerHeight * game_width / game_height;
}
context.scale(canvas.width / game_width, canvas.height / game_height); 

function Engine() {
    this.init();
}

Engine.prototype.init = function() {
    this.world = new World();
    this.paused = false;

    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    canvas.addEventListener("touchstart", this.world.player.jump.bind(this.world.player), false);//TODO: this is probably broken
    canvas.removeEventListener("touchstart", this.init.bind(this), false);

    this.graphics = new Graphics(this.world, canvas, context);
}

Engine.prototype.start = function() {
    this.interval = setInterval(this.tick.bind(this), 1/(FRAME_RATE * 1000));
}

Engine.prototype.tick = function() {

    if(this.world.player.isDead()) {

        this.graphics.drawEndScene(this.world.player.score);
        this.paused = true;

        document.addEventListener("keydown", this.keyDownHandler.bind(this), false)
        canvas.addEventListener("touchstart", this.init.bind(this), false)

        clearInterval(this.interval);

        return;
    }

    this.world.tick();
    this.world.player.tick(this.world); //TODO: this shouldn't be this way, two way dependency
    this.graphics.draw();
}

//TODO: refactor an input class or something. (GameController maybe? Has knowledge of the world and player)
Engine.prototype.keyDownHandler = function (event) {
    if (event.keyCode == SPACE_BAR) {
        if (!this.paused) {
            event.preventDefault();
            this.world.player.jump();
        } else {
            this.init();
        }
    }
}

var engine = new Engine();
engine.start();