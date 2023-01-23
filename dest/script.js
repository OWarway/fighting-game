"use strict";
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
ctx.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.8;
class Sprite {
    constructor({ position, velocity, height, width, lastKey, colour = "red", offset, }) {
        this.position = position;
        this.velocity = velocity;
        this.height = height;
        this.width = width;
        this.lastKey = lastKey;
        this.colour = colour;
        this.isAttacking = false;
        this.offset = offset;
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
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        // Draw attack box
        if (this.isAttacking) {
            ctx.fillStyle = "green";
            ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
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
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        }
        else {
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
let lastKey;
const rectangularCollision = ({ rectangle1, rectangle2, }) => {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
            rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
            rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
};
// Creates infinate loop
const animate = () => {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    // Player Movement
    // Stop player from moving when not holding key
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
    }
    else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
    }
    // Enemy Movement
    // Stop enemy from moving when not holding key
    enemy.velocity.x = 0;
    if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
    }
    // Collision Detection
    // Handle if attack box touches enemy
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking) {
        player.isAttacking = false;
        console.log("ouch");
    }
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking) {
        enemy.isAttacking = false;
        console.log("Oww");
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
