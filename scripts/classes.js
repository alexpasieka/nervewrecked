class Car extends PIXI.Sprite {
  constructor(x = 0, y = 0, dx = 0, image) {
    super(PIXI.loader.resources[image].texture);
    this.x = x;
    this.y = y;
		this.dx = dx;
    this.image = image;
  }
}

class Cone extends PIXI.Sprite {
	constructor(x = 0, y = 0, dy = 0) {
		super(PIXI.loader.resources["media/cone.png"].texture);
		this.x = x;
		this.y = y;
		this.dy = dy;
	}
}

class Heart extends PIXI.Sprite {
  constructor(x = 0, y = 0) {
    super(PIXI.loader.resources["media/heart.png"].texture);
    this.x = x;
    this.y = y;
  }
}
