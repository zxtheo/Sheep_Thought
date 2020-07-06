    var config = {
        type: Phaser.AUTO,
        width: 400,
        height: 600,
        backgroundColor: '#52c400',
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
        this.load.image('sheep', 'assets/baabaa.png');
    }

    function create ()
    {
        graphics = this.add.graphics()
        numOfSheep = 10
        var group = this.physics.add.group();
        for (i = 0; i < numOfSheep; i++){
            sheepArray.push(new Sheep(group, sheepArray));
        }

        this.physics.add.collider(group, group);
    }

    function update() {
        graphics.clear()
        sheepArray.forEach(sheep => {
            sheep.update();
        });
    }
    