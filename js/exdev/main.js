    var config = {
        type: Phaser.AUTO,
        width: 1000,
        height: 600,
        backgroundColor: '#52c400',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            },
            fps:24
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
    var graphics;
    var mouseLocation = {x:0, y:0};
    function preload ()
    {
        this.load.image('sheep', 'assets/baabaa.png');
    }

    function create ()
    {
        graphics = this.add.graphics()
        numOfSheep = 500
        var group = this.physics.add.group();
        for (i = 0; i < numOfSheep; i++){
            sheepArray.push(new Sheep(group, sheepArray));
        }

        this.physics.add.collider(group, group);
        
    }

    function update() {
        this.input.on('pointermove', function(pointer) {
            mouseLocation = {x:pointer.x, y:pointer.y}
            
        });
        graphics.clear()
        sheepArray.forEach(sheep => {
            sheep.update();
        });
        sheepArray.forEach(sheep =>{
            sheep.setVel();
        });
        
    }
    
