export default class scene extends Phaser.Scene {

	preload() {
		this.load.image('tiles', 'tiles.png')

		this.load.tilemapTiledJSON('tilemap', 'tilemap.json')

		this.load.atlas('faune', 'player/texture.png', 'player/texture.json');
		this.load.atlas('treasure', 'treasure/texture.png', 'treasure/texture.json');
	}

	create() {
		const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
		this.cursor = this.input.keyboard.addKeys({ up: KeyCodes.W, down: KeyCodes.S, left: KeyCodes.A, right: KeyCodes.D, interaction: KeyCodes.F });
		this.map = this.make.tilemap({ key: 'tilemap' })
		const tileset = this.map.addTilesetImage('0x72_DungeonTilesetII_v1.4', 'tiles')
		this.map.createLayer('Ground', tileset)
		const wallsLayer2 = this.map.createLayer('Wall2', tileset)
		wallsLayer2.setCollisionByProperty({ colider: true });
		const wallsLayer = this.map.createLayer('Wall', tileset)
		wallsLayer.setCollisionByProperty({ colider: true });


		// const debugGraph = this.add.graphics().setAlpha(0.7);
		// wallsLayer.renderDebug(debugGraph,{
		// 	tileColor:null,
		// 	collidingTileCOlor: new Phaser.Display.Color(243,234,48,255),
		// 	faceColor: new Phaser.Display.Color(40,39,37,255)
		// })
		// wallsLayer2.renderDebug(debugGraph,{
		// 	tileColor:null,
		// 	collidingTileCOlor: new Phaser.Display.Color(243,234,48,255),
		// 	faceColor: new Phaser.Display.Color(40,39,37,255)
		// })


		this.faune = this.physics.add.sprite(128, 128, 'faune', 'run-down-1.png')
		this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.55);
		console.log(this.faune);
		this.faune.body.setOffset(this.faune.width / 4, this.faune.height / 2);
		this.anims.create({
			key: 'faune-idle-down',
			frames: [{ key: 'faune', frame: 'run-down-1.png' }]
		})
		this.anims.create({
			key: 'faune-run-down',
			frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'faune-run-up',
			frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'faune-run-side',
			frames: this.anims.generateFrameNames('faune', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
			repeat: -1,
			frameRate: 15
		});
		this.anims.create({
			key: 'chest-open',
			frames: this.anims.generateFrameNames('treasure', { start: 0, end: 2, prefix: 'chest_empty_open_anim_f', suffix: '.png' }),
			frameRate: 15
		});

		this.faune.anims.play('faune-run-down');
		this.chests = this.physics.add.staticGroup();
		const chestsLayer = this.map.getObjectLayer('Chests');
		console.log(chestsLayer)
		chestsLayer.objects.forEach(chestObj => {
			console.log(this.chests.get((chestObj.x + chestObj.width * 0.5), chestObj.y - chestObj.height * 0.5, 'treasure', 'chest_empty_open_anim_f0.png'));
		});
		this.chests.children.iterate((child) => {
			child.body.setSize(child.width * 3.5, child.height * 3.5);
		});


		this.physics.add.collider(this.faune, wallsLayer);
		this.physics.add.collider(this.faune, this.chests, this.handlePlayerChestCollision, undefined, this);

		this.cameras.main.startFollow(this.faune, true);
		//const chest = this.add.sprite(64,64,'treasure','treasure/chest_empty_open_anim_f0.png');

		//chest.play('chest-open')
		window.addEventListener('keyup', (e) => {
			if (e.key == 'f') {
				console.log(this.chests)
				this.chests.children.iterate((child) => {
					var dist = Phaser.Math.Distance.BetweenPoints(this.faune, child);
					if (dist <= 50) {
						child.play('chest-open');
						this.requestData('http://192.168.0.104:3000/game/api/testapi/', { 'mess': 'HI' });
					}
				});
			}
		});
	}


	handlePlayerChestCollision(obj1, obj2) {
		if (this.helptxt) {
			this.helptxt.destroy();
		}
		const style = { font: "bold 12px Arial", fill: "#fff" };
		this.helptxt = this.add.text(obj2.x - obj2.width, obj2.y - 24, `Press F`, style);
		console.log(this.helptxt.height)
		this.helptxt.setDepth(999);
		obj2.body.setSize(obj2.width, obj2.height)
		const timeout = setInterval(()=>{
					const destroyDist = Phaser.Math.Distance.BetweenPoints(obj1, obj2);
					console.log(destroyDist);
			if(destroyDist >= 50){
				this.helptxt.destroy();
				obj2.body.setSize(obj2.width * 3.5, obj2.height * 3.5);
				clearInterval(timeout);
			}	
		},100)

		
		//this.helptxt.setScrollFactor(0.7);

		//obj2.play("chest-open");
		//console.log("obj2.body.blocked");
		//this.input.keyboard.on('keydown', function (event) {
		//console.log(event);
		//});

	}

	requestData(url, data) {
		var params = JSON.stringify(data);
		let xhr = new XMLHttpRequest();
		url+=params;
		xhr.open('GET', url);
		xhr.responseType = 'json';
		xhr.send();
		xhr.onload = function () {
			let responseObj = xhr.response;
			console.log(responseObj.msg);
		};
	}
	update() {
		if (!this.cursor || !this.faune) {
			return
		}


		if (this.cursor.left.isDown) {
			this.faune.setVelocity(-500, 0);
			this.faune.anims.play('faune-run-side', true);
			this.faune.setFlipX(true);
		} else if (this.cursor.right.isDown) {
			this.faune.setVelocity(500, 0);
			this.faune.anims.play('faune-run-side', true);
			this.faune.setFlipX(false);
		} else if (this.cursor.up.isDown) {
			this.faune.setVelocity(0, -500);
			this.faune.anims.play('faune-run-up', true);
		} else if (this.cursor.down.isDown) {
			this.faune.setVelocity(0, 500);
			this.faune.anims.play('faune-run-down', true);
		} else {

			this.faune.anims.play('faune-run-down');
			this.faune.setVelocity(0, 0);
		}




	}

}