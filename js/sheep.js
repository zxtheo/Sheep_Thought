const DISTANCE = 200
const FOV = Math.PI/2

class Sheep{
    constructor(physics, sheepArray){
        this.sprite = physics.create(Math.random()*1000, Math.random()*600, "sheep");
        this.sprite.setScale(0.02)
        this.sprite.body.setMaxVelocity(40,40);
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

        this.newVel =this.ruleMerge(this.seperation(),
                               this.cohesion(),
                                this.alignment(),
                                this.escape());

        this.sprite.setVelocity(this.newVel.x,  this.newVel.y);
    }

    ruleMerge(seperation, cohesion, alignment, escape){
        var normSheep = this.subtract(this.sprite, mouseLocation);
        var predDistance = this.magnitude(normSheep);
        var fleeDistance = 200;
        var ruleMultipler = this.ruleMultiplier(predDistance, fleeDistance)
        var finalVel = {x:0, y:0};
        finalVel = this.add(finalVel, this.multiply(cohesion, 2*(ruleMultipler*7)));
        finalVel = this.add(finalVel, this.multiply(seperation, 75*(ruleMultipler*20)));
        finalVel = this.add(finalVel, this.multiply(alignment, 0.5*(ruleMultipler*1)));
        finalVel = this.add(finalVel, this.multiply(escape,1500));

        
        return finalVel
    }

    ruleMultiplier(d, r){

        var vel = (1/Math.PI) * Math.atan((r-d)/20) +0.5
        return vel
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

    alignment(){
        var alignment = {x:0, y:0};
        var count = 0;
        this.sheepArray.forEach(sheep => {
            if (this.magnitude(this.subtract(sheep.sprite, this.sprite)) <=10){
                alignment.x += sheep.sprite.body.velocity.x
                alignment.y += sheep.sprite.body.velocity.y
                count ++;
            }
        });
        // alignment.x = alignment.x / count;
        // alignment.y = alignment.y / count;
        return alignment
    }

    escape(){
        
        var normSheep = this.subtract(this.sprite, mouseLocation);
        var magnitude = this.magnitude(normSheep);
        var escape = this.multiply(this.divide(normSheep, magnitude), this.inverse(magnitude, 10))
        return escape
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