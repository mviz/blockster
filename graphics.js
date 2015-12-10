//TODO: grouping calls to fill and stroke will yield huge performance gains if needed

Block.prototype.color = "#00A3FB";
MultiplierPickup.prototype.color = "#F2DB00";
Player.prototype.color = "#3DB845";
Line.prototype.color = "#AAAAAA";

//TODO: errr idk what to do here. 
var BOOST_COLOR = "#BF4040";
var HIGHLIGHT_COLOR = "#FFCF70";

var NUM_LINES = 20;

var MAX_LINE_STROKE_WIDTH = 2;
var MIN_LINE_STROKE_WIDTH = 0.5;
var MAX_LINE_SPEED = 1;
var MIN_LINE_SPEED = .1;
var MIN_LINE_WIDTH = 100;
var MAX_LINE_WIDTH = 150;

var MAX_MULTIPLIER_BAR_WIDTH = 100;
var MULTIPLIER_BAR_HEIGHT = 5;

var avatar_image = new Image();
avatar_image.src = "resources/avatar.png";

function Graphics(world, canvas,  context) {
    this.world = world;
    this.context = context;
    this.canvas = canvas;
    this.initLines();
}

Graphics.prototype.clearScene = function () {
    this.context.clearRect(0,0, canvas.width, canvas.height);       
}

Graphics.prototype.draw = function() {
    this.clearScene();
    this.drawBackground();

    this.drawAvatar();
    this.drawBoost();

    this.drawBlocks();
    this.drawMultipliers();

    this.drawHud();
}

Graphics.prototype.drawHud = function () {
    this.drawScore();
    this.drawMultiplier();
}

Graphics.prototype.drawAvatar = function draw_avatar(player) {    
    /*context.fillStyle = AVATAR_COLOR;
    context.fillRect(player.x , player.y , player.WIDTH, player.HEIGHT);*/

    this.context.drawImage(avatar_image, this.world.player.x, this.world.player.y, 16, 16); //TODO: magic numbers
}

Graphics.prototype.drawBoost = function () {
    // Styling was a bit of an accident, but hey, I like it.
    // a - - - b
    //   - - -
    //   c - d 
    //     e

    var player = this.world.player;

    if(player.vy < 0){
        var a = {'x': 0,                              'y': 0};
        var b = {'x': player.width,                   'y': 0};
        var c = {'x': Math.floor(player.width/4),     'y': 7};
        var d = {'x': Math.floor(player.width*(3/4)), 'y': 7};
        var e = {'x': Math.floor(player.width/2),     'y': 10};
        
        this.context.save();

        this.context.translate(player.x, player.y + player.height);

        var body = [a,b,d,c,a];
        var tip = [c,e,d,c];

        this.context.fillStyle = BOOST_COLOR;
        this.drawPath(body);
        this.context.fill();


        this.context.fillStyle = HIGHLIGHT_COLOR;
        this.drawPath(tip);
        this.context.fill();

        this.context.restore();
    }
}

Graphics.prototype.drawPath = function (path) {
    this.context.moveTo(path[0].x, path[0].y);
    for(i = 1; i < path.length; i++){
        this.context.lineTo(path[i].x, path[i].y);
    }
}

Graphics.prototype.drawMultipliers = function(){
    this.world.multipliers.forEach(function (multiplier) {
        this.context.save();

        this.context.translate(multiplier.x + multiplier.width / 2, multiplier.y + multiplier.width / 2);
        this.context.rotate(Math.PI / 4);

        this.context.fillStyle = multiplier.color;

        this.context.fillRect(-multiplier.width / 2, -multiplier.width / 2,
                     multiplier.width, multiplier.width);
        
        this.context.restore();
    });
}

Graphics.prototype.drawBlocks = function(){
    this.world.blocks.forEach(function (block) {
        this.context.fillStyle = block.color;
        this.context.fillRect(block.x, block.y , block.width, block.height);
    });
}

Graphics.prototype.drawScore = function () {

    this.context.fillStyle = this.world.player.color;//TODO: errr need a better way to move colors around.
    this.context.font = "30px Arial";
    this.context.textAlign = "right";
    this.context.fillText(this.world.player.score, game_width, 30); //TODO: game_width again

}

Graphics.prototype.drawMultiplier = function drawMultiplier() {
    var multiplier = this.world.player.multiplier;

    if(multiplier.value != 1){
        var percentLeft = multiplier.getTimeLeft(this.world.frame) / multiplier.getTotalTime();
        var barWidth = percentLeft * MAX_MULTIPLIER_BAR_WIDTH;

        this.context.fillStyle = MultiplierPickup.prototype.color;
        this.context.fillRect(game_width - barWidth, 55, barWidth, MULTIPLIER_BAR_HEIGHT);
    }

    this.context.fillStyle = MultiplierPickup.prototype.color;
    this.context.font = "20px Arial";
    this.context.textAlign = "right";
    this.context.fillText(multiplier.value + 'x', game_width, 50);
}

Graphics.prototype.drawEndScene = function (score) {
    this.clearScene();
    this.context.fillStyle = "#000000";

    this.context.font = "30px Helvetica";
    this.context.textAlign = "center";
    this.context.fillText(score, game_width/2, game_height/2);

    this.context.font = "30px Helvetica";
    this.context.textAlign = "center";
    this.context.fillText("Press space to continue", game_width/2, game_height/2 + 30);
}

Graphics.prototype.drawBackground = function() {
    
    for(i = 0 ; i < this.lines.length; i++) {
        line = this.lines[i];

        line.x += line.speed;

        if(line.x - 10 > game_width) {
            this.lines.splice(i, 1);
        
            this.lines.push(new Line());

            continue;
        }

        this.context.beginPath();

        this.context.lineWidth = line.stroke_width;
        this.context.strokeStyle = line.color;
        this.context.moveTo(line.x, line.y);
        this.context.lineTo(line.x + line.width, line.y);
        this.context.stroke();
    }

}

Graphics.prototype.initLines = function () {
    this.lines = [];
    for(i = 0; i < NUM_LINES; i++){
        this.lines.push(new Line(Math.random() * game_width));
    }
}

function Line(x) {
    this.stroke_width = Utils.randomRange(MIN_LINE_STROKE_WIDTH, MAX_LINE_STROKE_WIDTH);
    this.scaled = (this.stroke_width - 0.4)/15;
    
    var delta = .1;

    this.speed = Utils.randomRange(this.scaled - delta, this.scaled + delta);
    this.x = x;

    if (x === undefined){
        this.x = -150;    
    } 
    
    this.y = Math.random() * game_height;
    this.width = Utils.randomRange(MIN_LINE_WIDTH, MAX_LINE_WIDTH);
}
