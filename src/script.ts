const canvas = document.querySelector<HTMLCanvasElement>("canvas");

const ctx = canvas!.getContext("2d");

canvas!.width = 1024;
canvas!.height = 576;

ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

const gravity = 0.8;

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
  colour: string;
  jump: number;
  attackBox: {
    position: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
  };
  isAttacking: boolean;

  constructor({
    position,
    velocity,
    height,
    width,
    lastKey,
    colour = "red",
  }: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    height: number;
    width: number;
    lastKey?: string;
    colour: string;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
    this.lastKey = lastKey;
    this.colour = colour;
    this.isAttacking = false;

    // Default Jump Height
    this.jump = -20;

    this.attackBox = {
      position: this.position,
      width: 100,
      height: 50,
    };
  }

  draw() {
    ctx!.fillStyle = this.colour;
    ctx!.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Draw attack box
    if (this.isAttacking) {
      ctx!.fillStyle = "green";
      ctx!.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    // PX per frame
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Bottom of the rectangle (this.position.y + this.height)
    if (this.position.y + this.height + this.velocity.y >= canvas!.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  height: 150,
  width: 50,
  colour: "red",
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  height: 150,
  width: 50,
  colour: "blue",
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

  // Player Movement

  // Stop player from moving when not holding key
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  // Enemy Movement

  // Stop enemy from moving when not holding key
  enemy.velocity.x = 0;

  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  }

  // Collision Detection

  // Handle if attack box touches enemy
  if (
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
    player.attackBox.position.x <= enemy.position.x + enemy.width &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
    player.attackBox.position.y <= enemy.position.y + enemy.height &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("ouch");
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
      player.lastKey = "d";
      break;
    }
    case "a": {
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    }
    case "w": {
      player.velocity.y = player.jump;
      break;
    }
    case " ": {
      player.attack();
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
      enemy.velocity.y = enemy.jump;
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
