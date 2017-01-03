var sketchProc = function(processingInstance) {
    with (processingInstance) {
        size(400, 400);
        frameRate(60);

    var ball;
    var bars = [];
    var colors = [];
    var gameOver = false;
    var num_success = 0;
    var mouseOn = false;

    var Ball = function(position) {
        this.color = color(0);
        this.size = 20;
        this.position = position;
        this.velocity = new PVector();
        this.acceleration = new PVector();
    };

    Ball.prototype.update = function() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
    };

    Ball.prototype.display = function() {
        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.size, this.size)
        ;
        if (this.position.y < this.size/2) {
            this.velocity.y = abs(this.velocity.y)/1.5;
        } else if (this.position.y > height - this.size/2) {
            this.velocity.y = -abs(this.velocity.y)/1.5;
        }
    };

    Ball.prototype.applyForce = function(force) {
        this.acceleration.add(force);
    };

    var Bar_seg = function(color, height, position) {
        this.color = color;
        this.position = position;
        this.width = 20;
        this.height = height;
    };

    Bar_seg.prototype.display = function() {
        noStroke();
        fill(this.color);
        rect(this.position.x, this.position.y, this.width, this.height);
    };

    Bar_seg.prototype.check = function() {
        if (ball.position.x > this.position.x - ball.size/2&&
        ball.position.x < this.position.x + this.width + ball.size/2) {
            if (ball.position.y + 10 > this.position.y &&
            ball.position.y - 10 < this.position.y + this.height &&
            ball.color !== this.color) {
                gameOver = true;
            }
        }
    };

    var Bar = function(number, pos_X) {
        this.number = number;
        this.colors = [];
        this.segs = [];
        this.pos_X = pos_X;
        
        for (var i=0; i<this.number; i++) {
            var c = color(random(255),random(255),random(255));
            this.colors.push(c);
            this.segs.push(new Bar_seg(c, height/this.number, new PVector(pos_X, height/this.number*i)));
        }
    };

    Bar.prototype.run = function() {
        for (var i=0; i<this.segs.length; i++) {
            this.segs[i].position.x -= 2;
            this.segs[i].display();
            this.segs[i].check();
        }
    };

    var g = new PVector(0, 0.1);
    var up = new PVector(0, -0.22);

    for (var i = 2; i < 40; i++) {  
        bars.push(new Bar(round(i/3), (i-1)*400));
    }

    var ball = new Ball(new PVector(50, height/2));

    var draw = function() {
        background(255, 255, 255);

        for (var i=0; i<bars.length; i++) {
            var bar = bars[i];
            if (bar.segs[0].position.x === 400) {
                ball.color = bar.colors[floor(random(0,bar.colors.length-1))];
                num_success++;
            }
            
            bar.run();
        }
        ball.applyForce(g);
        if (mouseOn) {
            ball.applyForce(up);
        }
        ball.update();
        ball.display();
        
        textSize(20);
        fill(0, 0, 0);
        text(num_success, width/2, 40);
        
        if (gameOver === true) {
            noLoop();
            textSize(20);
            fill(0, 0, 0);
            textAlign(CENTER, CENTER);
            textSize(50);
            text("Try Again", width/2, height/2);
        }
    };
    mousePressed = function() {
        mouseOn = true;
    };
    mouseReleased = function() {
        mouseOn = false;
    };
}};

// Get the canvas that Processing-js will use
var canvas = document.getElementById("mycanvas");
// Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc);