const canvas = document.querySelector<HTMLCanvasElement>("canvas");

const ctx = canvas!.getContext("2d");

canvas!.width = 1024;
canvas!.height = 576;

ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

const gravity = 0.2;

class Sprite {
  position: {
    x: number;
    y: number;
  };

  velocity: {
    x: number;
    y: number;
  };

  height: number;
  width: number;

  constructor({
    position,
    velocity,
    height,
    width,
  }: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    height: number;
    width: number;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
  }

  draw() {
    ctx!.fillStyle = "red";
    ctx!.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Bottom of the rectangle (this.position.y + this.height)
    if (this.position.y + this.height + this.velocity.y >= canvas!.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  height: 150,
  width: 50,
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  height: 150,
  width: 50,
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

// Creates infinate loop
const animate = () => {
  window.requestAnimationFrame(animate);
  ctx!.fillStyle = "black";
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;

  if (keys.a.pressed) {
    player.velocity.x = -1;
  } else if (keys.d.pressed) {
    player.velocity.x = 1;
  }
};

animate();

window.addEventListener("keydown", (e) => {
  const { key } = e;
  switch (key) {
    case "d": {
      keys.d.pressed = true;
      break;
    }
    case "a": {
      keys.a.pressed = true;
      break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  const { key } = e;
  switch (key) {
    case "d": {
      keys.d.pressed = false;
      break;
    }
    case "a": {
      keys.d.pressed = false;
      break;
    }
  }
});
