//TODO: grouping calls to fill and stroke will yield huge performance gains if needed
//TODO: a lot of the time we're setting fillStyle ike 8 times to the same value

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
Object.defineProperty(Line, "MIN_SPEED", {value: .1});
Object.defineProperty(Line, "MAX_WIDTH", {value: 150});
Object.defineProperty(Line, "MIN_WIDTH", {value: 100});


function Graphics(world, canvas,  context) {
    this.world = world;
    this.context = context;
    this.canvas = canvas;

    this.initCanvas();    
    this.initLines();
    this.loadResources();
}

Graphics.prototype.loadResources = function() {
    this.avatarImage = new Image();
    this.avatarImage.src = "resources/avatar.png";
}

Graphics.prototype.initCanvas = function() {

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerWidth * this.world.height/this.world.width;
    
    //TODO: can we abstract window?
    if(this.canvas.height > window.innerHeight){
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerHeight * this.world.width / this.world.height;
    }

    this.context.scale(this.canvas.width / this.world.width, this.canvas.height / this.world.height); 
}

Graphics.prototype.clearScene = function () {
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);       
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

Graphics.prototype.drawEndScene = function (score) {
    this.clearScene();
    this.context.fillStyle = "#000000";

    this.context.font = "30px Helvetica";
    this.context.textAlign = "center";
    this.context.fillText(score, this.world.width/2, this.world.height/2);

    this.context.font = "30px Helvetica";
    this.context.textAlign = "center";
    this.context.fillText("Press space to continue", this.world.width/2, this.world.height/2 + 30);
}


Graphics.prototype.drawHud = function () {
    this.drawScore();
    this.drawMultiplier();
}

Graphics.prototype.drawAvatar = function draw_avatar(player) {    
    //context.fillStyle = AVATAR_COLOR;
    //context.fillRect(player.x , player.y , player.WIDTH, player.HEIGHT);

    this.context.drawImage(this.avatarImage, this.world.player.x, this.world.player.y, 
        this.world.player.width, this.world.player.height);
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

        this.context.fillStyle = Player.BOOST_COLOR;
        this.drawPath(body);
        this.context.fill();


        this.context.fillStyle = Player.HIGHLIGHT_COLOR;
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

        this.context.fillStyle = MultiplierPickup.COLOR;

        this.context.fillRect(-multiplier.width / 2, -multiplier.width / 2,
                     multiplier.width, multiplier.width);
        
        this.context.restore();
    }.bind(this));
}

Graphics.prototype.drawBlocks = function(){
    this.world.blocks.forEach(function (block) {
        this.context.fillStyle = Block.COLOR;
        this.context.fillRect(block.x, block.y , block.width, block.height);
    }.bind(this));
}

Graphics.prototype.drawScore = function () {

    this.context.fillStyle = Player.COLOR;
    this.context.font = "30px Arial";
    this.context.textAlign = "right";
    this.context.fillText(this.world.player.score, this.world.width, 30);

}

Graphics.prototype.drawMultiplier = function drawMultiplier() {
    var multiplier = this.world.player.multiplier;

    if(multiplier.value != 1){
        var percentLeft = multiplier.getTimeLeft(this.world.frame) / multiplier.getTotalTime();
        var barWidth = percentLeft * Graphics.MAX_MULTIPLIER_BAR_WIDTH;

        this.context.fillStyle = MultiplierPickup.COLOR;
        this.context.fillRect(this.world.width - barWidth, 55, barWidth, Graphics.MULTIPLIER_BAR_HEIGHT);
    }

    this.context.fillStyle = MultiplierPickup.COLOR;
    this.context.font = "20px Arial";
    this.context.textAlign = "right";
    this.context.fillText(multiplier.value + 'x', this.world.width, 50);
}

Graphics.prototype.drawBackground = function() {
    
    for(i = 0 ; i < this.lines.length; i++) {
        line = this.lines[i];

        line.x += line.speed;

        if(line.x - 10 > this.world.width) {
            this.lines.splice(i, 1);
        
            this.lines.push(new Line(this.world));

            continue;
        }

        this.context.beginPath();

        this.context.lineWidth = line.stroke_width;
        this.context.strokeStyle = Line.COLOR;
        this.context.moveTo(line.x, line.y);
        this.context.lineTo(line.x + line.width, line.y);
        this.context.stroke();
    }

}

Graphics.prototype.initLines = function () {
    this.lines = [];

    for(i = 0; i < Graphics.NUM_LINES; i++){
        this.lines.push(new Line(this.world, Math.random() * this.world.width));
    }
}

function Line(world, x) {
    this.stroke_width = Utils.randomRange(Line.MIN_STROKE_WIDTH, Line.MAX_STROKE_WIDTH);
    this.scaled = (this.stroke_width - 0.4)/15;
    
    var delta = .1;

    this.speed = Utils.randomRange(this.scaled - delta, this.scaled + delta);
    this.x = x;

    if (x === undefined){
        this.x = -150;    
    } 
    
    this.y = Math.random() * world.height;
    this.width = Utils.randomRange(Line.MIN_WIDTH, Line.MAX_WIDTH);
}
