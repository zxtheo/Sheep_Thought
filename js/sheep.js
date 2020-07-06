const DISTANCE = 200
const FOV = Math.PI/2

class Sheep{
    constructor(physics, sheepArray){
        this.sprite = physics.create(Math.random()*400, Math.random()*400, "sheep");
        this.sprite.setScale(0.05)
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0);
        var radius = this.sprite.width / 2;
        this.sprite.body.setCircle(radius)
        this.sheepArray = sheepArray;     
        this.direction;
        this.newVel;


    }

    update(){
        const {x,y} = this.sprite.body.velocity;
        this.direction = Math.atan2(y, x) + Math.PI/2;
        this.sprite.rotation = this.direction;

        var cohesion = this.multiply(this.cohesion(), 5);
        var seperation = this.multiply(this.seperation(), 4000);
        this.newVel = this.add(cohesion, seperation);
        this.sprite.setVelocity( this.newVel.x,  this.newVel.y);
    }

    cohesion(){
        var averagePosition = {x:0, y:0}
        this.sheepArray.forEach(sheep => {
            var {x,y} = sheep.sprite
            averagePosition.x += x;
            averagePosition.y += y;
        });
        var sheepNo =  this.sheepArray.length;
        averagePosition.x = averagePosition.x / sheepNo;
        averagePosition.y = averagePosition.y / sheepNo;
        var normSheep = this.subtract(averagePosition, this.sprite.body);
        var magnitude = this.magnitude(normSheep);
        var cohesionVector = this.divide(normSheep, magnitude);
        return cohesionVector;
    }

    seperation(){
        var seperation = {x:0, y:0}
        this.sheepArray.forEach(sheep => {
            if (sheep.sprite != this.sprite){
                var normSheep = this.subtract(this.sprite, sheep.sprite);
                var magnitude = this.magnitude(normSheep);
                var sepVec = this.multiply(this.divide(normSheep, magnitude), this.inverse(magnitude, 1));
                seperation.x += sepVec.x;
                seperation.y += sepVec.y;
            }
        });
        return seperation
    }

    subtract(a, b){
        return {x:a.x - b.x, y:a.y - b.y};
    }

    magnitude(a){
        return Math.sqrt(a.x*a.x + a.y*a.y);
    }

    divide(a, b){
        return{x:a.x/b, y:a.y/b};
    }

    multiply(a, b){
        return{x:a.x*b, y:a.y*b};
    }

    add(a, b){
        return{x:a.x+b.x, y:a.y+b.y};
    }

    inverse(a, b){
        return Math.pow((a+ 0.01)/b, -2);
    }
}