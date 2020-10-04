//http://www.diva-portal.org/smash/get/diva2:675990/FULLTEXT01.pdf?fbclid=IwAR0MOoEsVTS8r1R_fP79FngyUUluQPOb0b5UIHyoyJDNCNbVb18y_E8G0lA
const DISTANCE = 200
const FOV = Math.PI/2

class Sheep{
    constructor(physics, sheepArray){
        this.sprite = physics.create(Math.random()*900+50, Math.random()*500+50, "sheep");
        this.sprite.setScale(0.02)
        this.sprite.body.setMaxVelocity(40,40);
        // this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounce(0.9);
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

        var normSheep = this.subtract(this.sprite, mouseLocation);
        var predDistance = this.magnitude(normSheep);
        var maxVel = Math.pow(predDistance, -1) *2000;
        var minVel = 1.5 
        this.sprite.body.setMaxVelocity(maxVel,maxVel);
        
        this.newVel =this.ruleMerge(this.seperation(),
                               this.cohesion(),
                                this.alignment(),
                                this.escape(),
                                predDistance);
        this.newVel = this.minVel(this.newVel, minVel);
        this.newVel = this.checkRotation();
        this.continuous();
    }

    setVel(){
        this.sprite.setVelocity(this.newVel.x,  this.newVel.y);
    }

    ruleMerge(seperation, cohesion, alignment, escape, predDistance){

        var fleeDistance = 100;
        var ruleMultipler = this.ruleMultiplier(predDistance, fleeDistance)
        var finalVel = {x:0, y:0};
        finalVel = this.add(finalVel, this.multiply(cohesion, 1*(1+ruleMultipler*20)));
        finalVel = this.add(finalVel, this.multiply(seperation, 100*(1+ruleMultipler*10)));
        finalVel = this.add(finalVel, this.multiply(alignment, 0.5));
        finalVel = this.add(finalVel, this.multiply(escape, 250));

        
        return finalVel
    }

    continuous(){
        var {x,y} = this.sprite;
        if (y >= 600){
            this.sprite.y = 0;
        }
        else if( y <= 0 ){
            this.sprite.y = 600;
        }
        if (x >= 9000){
            this.sprite.x = 0;
        }
        else if( x <= 0 ){
            this.sprite.x = 9000;
        }
        
    }

    checkRotation(){
        var newAngle = Math.atan2(this.newVel.x, this.newVel.y);
        var currAngle = Math.atan2(this.sprite.x, this.sprite.y);
        var angle = (currAngle - newAngle + 3*Math.PI)% Math.PI/2;
        var clockwise = angle <=90;
        var anticlockwise = angle >= - 90;
        if (clockwise && anticlockwise){
            return this.newVel;
        }else if(!clockwise){
            return {x:Math.cos(currAngle + Math.PI/2), y:Math.sin(currAngle + Math.PI/2)};
        }else{
            return {x:Math.cos(currAngle - Math.PI/2), y:Math.sin(currAngle - Math.PI/2)};
        }
    }

    minVel(v, m){
        var vel = {x:0, y:0};
        var magnitude = this.magnitude(v);
        if (magnitude < m){
            return vel;
        }
        else{
            return v;
        }
    }

    ruleMultiplier(d, r){
        var vel = (1/Math.PI) * Math.atan((r-d)/10) +0.5
        return vel
    }

    cohesion(){
        var averagePosition = {x:0, y:0}
        var sheepNo = 0;
        this.sheepArray.forEach(sheep => {
            if(this.magnitude(this.subtract(sheep.sprite, this.sprite)) <=200){
                var {x,y} = sheep.sprite
                    averagePosition.x += x;
                    averagePosition.y += y;
                    sheepNo ++
            }    
        });
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
            if (this.magnitude(this.subtract(sheep.sprite, this.sprite)) <=100){
                alignment.x += sheep.sprite.body.velocity.x
                alignment.y += sheep.sprite.body.velocity.y
                count ++;
            }
        });
        alignment.x = alignment.x / count;
        alignment.y = alignment.y / count;
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