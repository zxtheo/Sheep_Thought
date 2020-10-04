var g = {
    width:400,
    height:600,
    boidNo:10,
    boids:[],
    maxSpeed: 1,
    minSpeed: 0.5,
    seperationDist:20,
    cohesionValue: 0.01
}
function setup(){
    createCanvas(g.width, g.height);
    for(i = 0; i < g.boidNo; i++){
        g.boids.push(new Boid(i));
    }
}

function draw(){
    clear();
    drawBoids();
    moveAllBoidsToNewPositions();
    
}

function moveAllBoidsToNewPositions(){
    let v1, v2, v3;
    v1 = v2 = v3 = createVector(0,0);
    g.boids.forEach(boid => {
        v1 = boid.rule1();
        v2 = boid.rule2();
        v3 = boid.rule3();

        boid.velocity.add(v1);
        boid.velocity.add(v2);
        boid.velocity.add(v3);

        boid.velocity.limit(g.maxSpeed);
        boid.minVel();
        boid.position.add(boid.velocity);
    });
}

function drawBoids(){
    g.boids.forEach(boid => {
        circle(boid.position.x, boid.position.y,  20);
    });
}


