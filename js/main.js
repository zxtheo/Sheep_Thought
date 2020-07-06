    var config = {
        type: Phaser.AUTO,
        width: 400,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
                // gravity: { y: 20 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var sheepArray = []
    var game = new Phaser.Game(config);
    var sheep;
    var circ = [];
    var graphics;
    function preload ()
    {
        this.load.audio('baa', 'assets/bllleeggggaah.mp3')
        this.load.image('sheep', 'assets/sheep.png');
    }

    function create ()
    {

        // cursors = this.input.keyboard.createCursorKeys();
        graphics = this.add.graphics()
        numOfSheep = 10
        var group = this.physics.add.group();
        for (i = 0; i < numOfSheep; i++){
            // circ.push(this.add.circle(0, 0, 5).setStrokeStyle(2, 0xffff00));
            
   
            sheepArray.push(new Sheep(group, sheepArray, graphics));
        }
        // const triangle = new Phaser.GameObjects.Triangle(this.physics, 100, 100, 20)
        
        
        const playBaa = ()=>{
            var rand = Math.random();
            if (rand < 0.1){
                this.sound.add('baa').play();
            }
        }
        this.physics.add.collider(group, group, playBaa);
    }

    function update() {
        graphics.clear()
        sheepArray.forEach(sheep => {
            sheep.update();
        });
        
        

        // var rand = Math.random();
        
        // if (rand < 0.01){
        //     sheep.setVelocityY(-sheep.body.velocity.y);
        // }
        
        // if (cursors.left.isDown)
        // {
        //     sheep.setVelocityX(-300);
        // }
        // else if (cursors.right.isDown)
        // {
        //     sheep.setVelocityX(300);
        // }
    
        // if (cursors.up.isDown)
        // {
        //     sheep.setVelocityY(-300);
        // }
        // else if (cursors.down.isDown)
        // {
        //     sheep.setVelocityY(300);
        // }
    }
    