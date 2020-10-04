class s4 {
    constructor(id, p) {
        this.p = p;
        this.id = id;
        this.loc = p.createVector(randInt(10, c.width - 10), randInt(10, c.height - 10))
        this.fill = "white";
        this.movement = p.createVector(0,0);
        this.vel = p.createVector(0,0);
        this.fleeRadius = 100;
        this.seperationRadius = 30;
        this.maxVel = 6;
    }

    //checks if the sheep is colliding wit onother sheep
    checkLocation(location){
        var p = this.p;
        sheepList.forEach(sheep => {
            if (sheep.id != this.id){

                //hit other sheep
                var hit = p.collideCircleCircle(location.x, location.y, 20, sheep.loc.x, sheep.loc.y, 20);
                var distance = p5.Vector.dist(sheep.loc, location)
                if(hit){
                   var move = p.createVector(location.x - sheep.loc.x, location.y - sheep.loc.y);
                   move.normalize();
                   move.mult(20.5-distance);
                   location.add(move);
                }
            }  
        });
         // hit walls
         var left = p.collideLineCircle(0, 0, 0, c.height, location.x, location.y, 20);
         var right = p.collideLineCircle(c.width, 0, c.width, c.height, location.x, location.y, 20);
         var top = p.collideLineCircle(0, 0, c.width, 0, location.x, location.y, 20);
         var bottom = p.collideLineCircle(0, c.height, c.width, c.height, location.x, location.y, 20);

         //constrain walls
         location.y = p.constrain(location.y, 10, c.width-10);
         location.x = p.constrain(location.x, 10, c.height-10);
        return location;
    }

    move(){
        
        var p = this.p;
        var dog = p.createVector(p.mouseX, p.mouseY);
        
        var l = this.loc.copy();
        var sheepCopy = [...sheepList];
        var movement = p.createVector(0,0); //set movement to zero to act more like sheep

        //multipliers added from "Extending Reynolds’ flocking model to a simulation of sheep in the presence of a predator"
        var m1 = 1;
        var m2 = 1;
        var m3 = 1;
        var m4 = 1;

        var cohesion =  this.cohesion(p, sheepCopy);
        var seperation = this.seperation(p, sheepCopy);
        var alignment = this.alignment(p, sheepCopy);
        var evade = this.evade(p, dog);

        
        //add direction
        movement.add(cohesion.mult(m1));
        movement.add(seperation.mult(m2));
        movement.add(alignment.mult(m3));
        movement.add(evade.mult(m4, dog).mult(m4));

        movement = this.limitVelocity(movement);
        this.vel = movement;
        l.add(movement);

        //check new locaiton
        l = this.checkLocation(l);
        
        

        // set new locaiton
        this.loc = l

    }

    cohesion(p, sheepCopy){
        var averageSheep = p.createVector(0,0);
        var sheepNo = 0;
        sheepCopy.forEach(sheep => {
            if (sheep.id != this.id){
                if(this.magnitude(sheep.loc.copy().sub(this.loc)) < this.fleeRadius){
                    averageSheep.add(sheep.loc).copy();
                    sheepNo ++;
                }
            }
        });
        averageSheep.div(sheepNo);

        if (averageSheep.x !=  0 && averageSheep.y != 0){
            return averageSheep.sub(this.loc.copy()).div(100);
        }
        return p.createVector(0.0);
    }

    seperation(p, sheepCopy){
        var closeness = p.createVector(0,0);
        sheepCopy.forEach(sheep => {
            if (sheep.id != this.id){
                if(this.magnitude(sheep.loc.copy().sub(this.loc)) < this.seperationRadius){
                    closeness.sub(sheep.loc.copy().sub(this.loc))
                }
            }
        });

        return closeness.div(100); //div made seperation smoother
    }
    
    alignment(p, sheepCopy){
        var averageVel = p.createVector(0,0);
        sheepCopy.forEach(sheep => {
            if (sheep.id != this.id){
                averageVel.add(sheep.vel)
            }
        });
        averageVel.div(sheepCopy.length - 1);
        
        return averageVel.sub(this.vel).div(8);
    }

    magnitude(a){
        return Math.sqrt(a.x*a.x + a.y*a.y);
    }

    limitVelocity(vel){

        if (magnitude(vel) > this.maxVel){
            vel.div(magnitude(vel)).mult(this.maxVel);
        }

        return vel;
    }

    evade(p, dog){
        //added different speeds for different distances so sheep speed up the closer the dog
        var dogDistance = this.magnitude(this.loc.copy().sub(dog));
        if (dogDistance < this.fleeRadius/2){
            return (dog.copy().sub(this.loc.copy()).mult(-1));
        }
        if (dogDistance < this.fleeRadius){
            return (dog.copy().sub(this.loc.copy()).mult(-1)).div(50);
        }
        if (dogDistance < this.fleeRadius*2){
            return (dog.copy().sub(this.loc.copy()).mult(-1)).div(100);
        }
        return p.createVector();
    }

  }

  