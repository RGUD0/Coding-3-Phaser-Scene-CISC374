import Phaser from "phaser";

export default class scene1 extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup;
    private player?: Phaser.Physics.Arcade.Sprite;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars?: Phaser.Physics.Arcade.Group;

    private score = 0;
    private starCount = 10;
    private sceneText?: Phaser.GameObjects.Text;
    private scoreText?: Phaser.GameObjects.Text;

    private bombs?: Phaser.Physics.Arcade.Group;

    private gameOver = false;

    private dataToPass = {
        playerScore: this.score,
    };

    constructor() {
        super({ key: "scene4" });
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("ground", "assets/platform.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    init(data: { playerScore: number }) {
        console.log("Data received in Scene3:", data);
        // Use the received data as needed
        this.score = data.playerScore;
    }

    create() {
        //this.scene.start("MainScene");
        this.add.image(400, 300, "sky");

        // Platforms START
        /*
        this.platforms = this.physics.add.staticGroup();
        const ground = this.platforms.create(
            400,
            568,
            "ground"
        ) as Phaser.Physics.Arcade.Sprite;

        ground.setScale(2).refreshBody();

        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");
        // Platforms END
        */

        // Player START
        this.player = this.physics.add.sprite(100, 450, "dude");
        //this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        //this.physics.add.collider(this.player, this.platforms);
        // Player START

        // Arrow Keys
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Star START
        this.stars = this.physics.add.group({
            key: "star",
            repeat: this.starCount - 1,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        this.stars.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setCollideWorldBounds(true);
            let posX = Phaser.Math.Between(0, this.sys.game.canvas.width);
            let posY = Phaser.Math.Between(0, this.sys.game.canvas.height);
            child.setX(posX);
            child.setY(posY);
            return true;
        });

        //this.physics.add.collider(this.stars, this.platforms);
        // Star END

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.handleCollectStar,
            undefined,
            this
        );

        this.sceneText = this.add.text(16, 16, "Scene 4", {
            fontSize: "32px",
            color: "#000",
        });

        this.scoreText = this.add.text(16, 48, "Score: " + this.score, {
            fontSize: "32px",
            color: "#000",
        });

        this.bombs = this.physics.add.group({
            key: "bomb",
            repeat: this.starCount - 1,
            setXY: { x: 12, y: 12 },
        });

        this.bombs.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.enableBody(true, child.x, 0, true, true);
            let xVel = Phaser.Math.Between(-400, 400);
            let yVel = Phaser.Math.Between(-400, 400);
            child.setVelocityX(xVel);
            child.setVelocityY(yVel);
            child.setBounce(1);
            child.setCollideWorldBounds(true);
            return true;
        });

        //this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.handleHitBomb,
            undefined,
            this
        );
    }

    private handleHitBomb() {
        this.physics.pause();
        this.player?.setTint(0xff0000);
        this.player?.anims.play("turn");
        this.gameOver = true;
    }

    private handleCollectStar(
        player:
            | Phaser.GameObjects.GameObject
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        s:
            | Phaser.GameObjects.GameObject
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText?.setText("Score: " + this.score);

        if (this.stars?.countActive(true) === 0) {
            this.stars.children.iterate((c) => {
                const child = c as Phaser.Physics.Arcade.Image;
                child.enableBody(true, child.x, 0, true, true);
                let posX = Phaser.Math.Between(0, this.sys.game.canvas.width);
                let posY = Phaser.Math.Between(0, this.sys.game.canvas.height);
                child.setX(posX);
                child.setY(posY);
                return true;
            });
            /*
            if (this.player) {
                const x =
                    this.player.x < 400
                        ? Phaser.Math.Between(400, 800)
                        : Phaser.Math.Between(0, 400);

                const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(
                    x,
                    16,
                    "bomb"
                );
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-400, 400), 20);
            }
            */
        }
    }

    update() {
        if (!this.cursors) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player?.setVelocityX(-400);
            this.player?.setVelocityY(0);
            this.player?.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player?.setVelocityX(400);
            this.player?.setVelocityY(0);
            this.player?.anims.play("right", true);
        } else if (this.cursors.down.isDown) {
            this.player?.setVelocityY(400);
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn", true);
        } else if (this.cursors.up.isDown) {
            this.player?.setVelocityY(-400);
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn", true);
        }

        /*else {
            this.player?.setVelocityX(0);
            this.player?.anims.play("turn", true);
        }*/

        /*
        if (this.cursors.up.isDown && this.player?.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
        */
    }
}
