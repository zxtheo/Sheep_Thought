

var sheepList = [];
var dogList = [];
var noOfSheep = 30;
var noOfDogs = 1;
var c = {
    width: 600,
    height: 600
}

var sim = function(p){
    p.setup = function(){
        p.createCanvas(0, 0);
        p.ellipseMode(p.CENTER);
        p.angleMode(p.DEGREES);
        for (i = 0; i < noOfSheep; i++){
            sheepList.push(new s5(i, p));
        }
        for(i = 0; i < noOfDogs; i++){
            dogList.push(new Dog(i, p));
        }
        
    }
    p.draw = function() {
        p.frameRate(Number(document.getElementById("speed").value));
        frames = p.frameRate();
        moveSheep();
        moveDog();
    }
    
    function moveSheep(){
        sheepList.forEach(sheep => {
            sheep.move();    
        });
    }

    function moveDog(){
        dogList.forEach(dog => {
            dog.move();
        });
    }
}
let myp5 = new p5(sim, 'c1');


var draw = function(p){
    p.setup = function(){
        p.createCanvas(c.width, c.height);
        p.ellipseMode(p.CENTER);
        p.angleMode(p.DEGREES);
    }

    p.draw = function() {
        p.background('green');
        framerate();
        drawSheep();
        drawDog();
    }

    function framerate(){
        p.frameRate(Number(document.getElementById("framerate").value));
        p.textSize(10);
        p.fill("black");
        p.text(frames.toString() , 0, 10);
    }

    function drawSheep(){
        sheepList.forEach(sheep => {
            sheep.draw(p);
        });
    }
    function drawDog(){
        dogList.forEach(dog => {
            dog.draw(p);
        });
    }
}

let myp52 = new p5(draw, 'c2');




