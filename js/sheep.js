const DISTANCE = 200
const FOV = Math.PI/2

class Sheep{
    constructor(physics, sheepArray, graphics){
        this.sprite = physics.create(Math.random()*400, Math.random()*400, "sheep");
        this.sprite.setScale(0.015);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setVelocityY(100);
        // this.sprite.setMass(Math.random()*5);
        this.sprite.setBounce(1);
        this.sprite.setCircle(10/0.015);
        this.sheepArray = sheepArray;
        this.graphics = graphics;
        
        this.triangle = new Phaser.Geom.Triangle.BuildEquilateral(100, 200, 200);
        graphics.strokeTriangleShape(this.triangle)
        
        this.direction;
    }

    

    update(){
        // this.triangle.x = this.sprite.x
        // this.triangle.y = this.sprite.y
        // debugger
        const {x:x1,y:y1} = this.sprite
        // const {y2,y3} = this.triangle
        // const fov = Math.PI / 2
        // const distance = 50;
        const {x,y} = this.sprite.body.velocity;
        this.direction = Math.atan2(y, x) + Math.PI/2;
        this.sprite.rotation = this.direction;
        /*
                
            x1,y1 is the x,y of the centre of the sheep (this shall cause problems later)
        

                                              --------> x2, y2 shall be here
                                        -----
               OO0O               -----
             OOOO0OOO       ----
            OOOOO0OOOO ------------------------------ This is the direction
             OOOO0OOO       ----
               OO0O               -----
                                        -----
                                              --------> x3, y3 shall be here

        */
        const triAngle = this.direction - Math.PI/2
        var x2 = x1 + Math.cos(triAngle + FOV/2) * DISTANCE;
        var y2 = y1 + Math.sin(triAngle + FOV/2) * DISTANCE;

        var x3 = x1 + Math.cos(triAngle - FOV/2) * DISTANCE;
        var y3 = y1 + Math.sin(triAngle - FOV/2) * DISTANCE;
        this.triangle.setTo(x1,y1,x2,y2,x3,y3)
        // Phaser.Geom.Triangle.CenterOn(this.triangle, x1, y1)
        // Phaser.Geom.Triangle.SetAngle(this.triangle, this.direction)
        this.graphics.strokeTriangleShape(this.triangle)

        
        // this.view();
        // var rand = Math.random();
        
        // if (rand < 0.01){
        //     this.sprite.setVelocityY(-this.sprite.body.velocity.y);
        // }
    }

    view(){
        this.sheepArray.forEach(sheep =>{
            var distance = Phaser.Math.Distance.BetweenPoints(sheep.sprite, this.sprite)
            // if(distance == 0 || distance > this.fieldOfView){
            //     return false
            // }s
            var {x,y} = sheep.sprite;
            var relPoint = Phaser.Actions.RotateAround({x,y}, this.sprite, this.direction)
            // this.graphics.fillCircleShape(new Phaser.Geom.Circle(relPoint.x, relPoint.y, 5))
            var angle = Phaser.Math.Angle.BetweenPoints(sheep.sprite, this.sprite)
            // console.log(relPoint)
        });
    }
}