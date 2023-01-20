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
  lastKey: unknown;

  constructor({
    position,
    velocity,
    height,
    width,
    lastKey,
  }: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    height: number;
    width: number;
    lastKey?: string;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
    this.lastKey = lastKey;
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
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

let lastKey: string;

// Creates infinate loop
const animate = () => {
  window.requestAnimationFrame(animate);
  ctx!.fillStyle = "black";
  ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;

  // Player Movement
  if (keys.a.pressed && lastKey === "a") {
    player.velocity.x = -1;
  } else if (keys.d.pressed && lastKey === "d") {
    player.velocity.x = 1;
  }

  // Enemy Movement
  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = -1;
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = 1;
  }
};

animate();

window.addEventListener("keydown", (e) => {
  const { key } = e;

  console.log("key", key);

  switch (key) {
    // Player 1
    case "d": {
      keys.d.pressed = true;
      lastKey = "d";
      break;
    }
    case "a": {
      keys.a.pressed = true;
      lastKey = "a";
      break;
    }
    case "w": {
      player.velocity.y = -10;
      break;
    }

    // Player 2 (enemy)
    case "ArrowRight": {
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    }
    case "ArrowLeft": {
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    }
    case "ArrowUp": {
      enemy.velocity.y = -10;
      break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  const { key } = e;
  switch (key) {
    // Player 1
    case "d": {
      keys.d.pressed = false;
      break;
    }
    case "a": {
      keys.a.pressed = false;
      break;
    }

    // Player 2 (enemy)
    case "ArrowRight": {
      keys.ArrowRight.pressed = false;
      break;
    }
    case "ArrowLeft": {
      keys.ArrowLeft.pressed = false;
      break;
    }
  }
});
