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
    offset: { x: number; y: number };
  };
  isAttacking: boolean;
  offset: { x: number; y: number };
  health: number;

  constructor({
    position,
    velocity,
    height,
    width,
    lastKey,
    colour = "red",
    offset,
  }: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    height: number;
    width: number;
    lastKey?: string;
    colour: string;
    offset: {
      x: number;
      y: number;
    };
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
    this.lastKey = lastKey;
    this.colour = colour;
    this.isAttacking = false;
    this.offset = offset;
    this.health = 100;

    // Default Jump Height
    this.jump = -20;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset: {
        x: this.offset.x,
        y: this.offset.y,
      },
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

    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

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
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  height: 150,
  width: 50,
  colour: "blue",
  offset: {
    x: 50,
    y: 0,
  },
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

const rectangularCollision = ({
  rectangle1,
  rectangle2,
}: {
  rectangle1: Sprite;
  rectangle2: Sprite;
}): boolean => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

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
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    const enemyHealthBar = document.querySelector(
      "#enemyHealth"
    ) as HTMLElement;
    enemy.health -= 10;
    enemyHealthBar.style.width = enemy.health.toString() + "%";
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    const playerHealthBar = document.querySelector(
      "#playerHealth"
    ) as HTMLElement;
    player.health -= 10;
    playerHealthBar.style.width = player.health.toString() + "%";
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
};

const determineWinner = ({
  player,
  enemy,
  timerId,
}: {
  player: Sprite;
  enemy: Sprite;
  timerId: number;
}) => {
  clearTimeout(timerId);
  const UIScore = document.querySelector(".score") as HTMLElement;
  UIScore.style.display = "flex";
  if (player.health === enemy.health) {
    UIScore.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    UIScore.innerHTML = "Player 1 Wins";
  } else if (enemy.health > player.health) {
    UIScore.innerHTML = "Player 2 Wins";
  }
};

let timer = 30;
let timerId: number;
const decreaseTimer = () => {
  if (timer > 0) {
    timerId = setTimeout(() => {
      timer--;
      const UITimer = document.querySelector(".timer") as HTMLElement;
      UITimer.innerHTML = timer.toString();

      decreaseTimer();
    }, 1000);
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
};

decreaseTimer();

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
    case "ArrowDown": {
      enemy.attack();
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
