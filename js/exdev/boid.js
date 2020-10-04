class Boid {
    constructor(id){
        this.position = createVector(Math.random()*g.width, Math.random()*g.height);
        this.velocity = createVector(0,0);
        this.id = i;
    }

    //cohesion
    rule1(){
        let centerOfMass = createVector(0,0);
        g.boids.forEach(boid => {
            if(boid.id != this.id)
            centerOfMass.add(boid.position);
        });
        centerOfMass.div(g.boids.length - 1);
        var divFactor = 1 / g.cohesionValue;
        return(centerOfMass.sub(this.position).div(divFactor))
    }

    //seperation
    rule2(){
        let c = createVector(0,0);
        g.boids.forEach(boid => {
            if (boid.id != this.id){
                if(this.position.dist(boid.position) < g.seperationDist){
                    c.sub(boid.position.copy().sub(this.position));
                }
            }
        });
        if(c == createVector(0,0)){
            return this.position;
        }else{
            return c;
        }
    }

    rule3(){
        return createVector(0,0);
    }
    
    minVel(){
        if(this.velocity.mag() < g.minSpeed){
            this.velocity = createVector(0,0);
        }
    }
}