/* jshint browser: true */
/* jshint -W097 */
/* global Block */
/* global MultiplierPickup */
/* global Player */
/* global Utils */
"use strict";

//TODO: Pre render on a seperate canvas

Object.defineProperty(Graphics, "NUM_LINES", {value: 20});
Object.defineProperty(Graphics, "MAX_MULTIPLIER_BAR_WIDTH", {value: 100});
Object.defineProperty(Graphics, "MULTIPLIER_BAR_HEIGHT", {value: 5});
Object.defineProperty(Block, "COLOR", {value: "#00A3FB"});
Object.defineProperty(MultiplierPickup, "COLOR", {value: "#F2DB00"});

Object.defineProperty(Player, "COLOR", {value: "#3DB845"});
Object.defineProperty(Player, "BOOST_COLOR", {value: "#BF4040"});
Object.defineProperty(Player, "HIGHLIGHT_COLOR", {value: "#FFCF70"});

Object.defineProperty(Line, "COLOR", {value: "#AAAAAA"});


Object.defineProperty(Line, "MAX_STROKE_WIDTH", {value: 2});
Object.defineProperty(Line, "MIN_STROKE_WIDTH", {value: 0.5});
Object.defineProperty(Line, "MAX_SPEED", {value: 1});
Object.defineProperty(Line, "MIN_SPEED", {value: 0.1});
Object.defineProperty(Line, "MAX_WIDTH", {value: 150});
Object.defineProperty(Line, "MIN_WIDTH", {value: 100});


function Graphics(world, canvas,  context) {
    this.world = world;
    this.context = context;
    this.canvas = canvas;
    this.animations = [];

    this.initCanvas();
    this.initLines();
    this.loadResources();
}

Graphics.prototype.loadResources = function() {
    this.avatarImage = new Image();
    this.avatarImage.src = "resources/avatar.png";
};

Graphics.prototype.initCanvas = function() {

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth * this.world.height/this.world.width;

    //TODO: can we abstract window?
    if(this.canvas.height > window.innerHeight){
        this.canvas.height = window.innerHeight;

        this.canvas.width = window.innerHeight * this.world.width / this.world.height;
    }

    this.context.scale(this.canvas.width / this.world.width, this.canvas.height / this.world.height);
};

Graphics.prototype.clearScene = function () {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
};

Graphics.prototype.draw = function(timePassed) {
    this.clearScene();
    this.drawBackground(timePassed);

    this.drawBlocks();
    this.drawMultiplierPickups();
    this.drawAnimations(timePassed);

    this.drawAvatar();
    this.drawBoost();

    this.drawHud();
};

Graphics.prototype.drawEndScene = function (score) {
    this.clearScene();

    this.context.fillStyle = "#000000";
    this.context.font = "30px Helvetica";
    this.context.textAlign = "center";

    this.context.fillText(Math.round(score), this.world.width/2, this.world.height/2);
    this.context.fillText("Press space to continue", this.world.width/2, this.world.height/2 + 30);
};


Graphics.prototype.drawHud = function () {
    this.drawScore();
    this.drawMultiplier();
};

Graphics.prototype.drawAvatar = function draw_avatar() {
    //context.fillStyle = AVATAR_COLOR;
    //context.fillRect(player.x , player.y , player.WIDTH, player.HEIGHT);

    this.context.drawImage(this.avatarImage, this.world.player.x, this.world.player.y,
        this.world.player.width, this.world.player.height);
};

Graphics.prototype.drawBoost = function () {
    // Styling was a bit of an accident, but hey, I like it.
    // a - - - b
    //   - - -
    //   c - d
    //     e

    var player = this.world.player;

    if(player.vy < 0){
        var a = {x: 0,                              y: 0};
        var b = {x: player.width,                   y: 0};
        var c = {x: Math.floor(player.width/4),     y: 7};
        var d = {x: Math.floor(player.width*(3/4)), y: 7};
        var e = {x: Math.floor(player.width/2),     y: 10};

        this.context.save();

        this.context.translate(player.x, player.y + player.height);

        var body = [a,b,d,c,a];
        var tip = [c,e,d,c];

        this.context.fillStyle = Player.BOOST_COLOR;
        this.context.beginPath();
        this.drawPath(body);
        this.context.fill();

        this.context.fillStyle = Player.HIGHLIGHT_COLOR;
        this.context.beginPath();
        this.drawPath(tip);
        this.context.fill();

        this.context.restore();
    }
};

Graphics.prototype.drawPath = function (path) {
    this.context.moveTo(path[0].x, path[0].y);

    for(var i = 1; i < path.length; i++){
        this.context.lineTo(path[i].x, path[i].y);
    }
};

Graphics.prototype.drawMultiplierPickups = function(){
    this.context.beginPath();

    this.world.multipliers.forEach(function (multiplier) {
        this.drawPath(multiplier.getCorners());
    }.bind(this));

    this.context.fillStyle = MultiplierPickup.COLOR;
    this.context.fill();
};

Graphics.prototype.drawBlocks = function(){

    this.context.fillStyle = Block.COLOR;
    this.context.beginPath();

    this.world.blocks.forEach(function (block) {
        this.context.rect(block.x, block.y, block.width, block.height);
    }.bind(this));

    this.context.fillStyle = Block.COLOR;
    this.context.fill();
};

Graphics.prototype.drawScore = function () {

    this.context.fillStyle = Player.COLOR;
    this.context.font = "30px Arial";
    this.context.textAlign = "right";
    this.context.fillText(Math.round(this.world.player.score), this.world.width, 30);
};

Graphics.prototype.drawMultiplier = function drawMultiplier() {

    var multiplier = this.world.player.multiplier;
    this.context.fillStyle = MultiplierPickup.COLOR;

    if(multiplier.value != 1){
        var percentLeft = multiplier.getTimeLeft(this.world.frame) / multiplier.getTotalTime();
        var barWidth = percentLeft * Graphics.MAX_MULTIPLIER_BAR_WIDTH;

        this.context.fillRect(this.world.width - barWidth, 55, barWidth, Graphics.MULTIPLIER_BAR_HEIGHT);
    }

    this.context.font = "20px Arial";
    this.context.textAlign = "right";
    this.context.fillText(multiplier.value + "x", this.world.width, 50);
};

Graphics.prototype.drawBackground = function (timePassed) {
    this.context.strokeStyle = Line.COLOR;

    for(var i = 0 ; i < this.lines.length; i++) {
        var line = this.lines[i];

        line.x += line.speed * timePassed;

        if(line.x - 10 > this.world.width) {
            this.lines.splice(i, 1);
            i--;

            this.lines.push(new Line(this.world));
        }

        this.context.beginPath();
        this.context.lineWidth = line.stroke_width;

        this.context.moveTo(line.x, line.y);
        this.context.lineTo(line.x + line.width, line.y);
        this.context.stroke();
    }

};

Graphics.prototype.drawAnimations = function(timePassed) {
    this.world.collectedMultipliers.forEach(function(multiplier){
        this.animations.push(new PickupAnimation(multiplier));
    }.bind(this));

    //TODO: this is a terrible, terrible thing.
    this.world.collectedMultipliers = [];

    for(var i = 0; i < this.animations.length; i++){
        var animation = this.animations[i];

        if(animation.isFinished()) {
            this.animations.splice(i, 1);
        }

        animation.drawFrame(this.context, timePassed);
    }

};

Graphics.prototype.initLines = function () {
    this.lines = [];

    for(var i = 0; i < Graphics.NUM_LINES; i++){
        this.lines.push(new Line(this.world, Math.random() * this.world.width));
    }
};

function Line(world, x) {
    this.stroke_width = Utils.randomRange(Line.MIN_STROKE_WIDTH, Line.MAX_STROKE_WIDTH);
    this.scaled = (this.stroke_width - 0.4)/15;

    var delta = 0.1;

    this.speed = Utils.randomRange(this.scaled - delta, this.scaled + delta);
    this.x = x;

    if (x === undefined){
        this.x = -150;
    }

    this.y = Math.random() * world.height;
    this.width = Utils.randomRange(Line.MIN_WIDTH, Line.MAX_WIDTH);
}

Object.defineProperty(PickupAnimation, "ANIMATION_LENGTH", {value: 90});

function PickupAnimation(multiplier) {
    this.y = multiplier.y;
    this.x = multiplier.x;
    this.timeElapsed = 0;
    this.width = this.height = 10;
}

PickupAnimation.prototype.drawFrame = function (context, timePassed) {
    this.timeElapsed += timePassed;
    var distance = this.timeElapsed / 5;

    context.rect(this.x, this.y - distance, this.width, this.height);
    context.rect(this.x, this.y + distance, this.width, this.height);
    context.rect(this.x - distance, this.y, this.width, this.height);
    context.rect(this.x + distance, this.y, this.width, this.height);

    context.fillStyle = MultiplierPickup.COLOR;
    context.fill();
};

//TODO: this should be based off actual time elapsed per frame...

PickupAnimation.prototype.isFinished = function() {
    return PickupAnimation.ANIMATION_LENGTH - this.timeElapsed < 0;
};
