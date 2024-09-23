import { SpriteSheet } from "./SpriteSheet.js"
import { UserInput } from "./UserInput.js"
import { Chara } from "./Chara.js"
import { World } from "./World.js"

// background canvas
const canvas_bg = document.getElementById('canvasBg');
const context_bg = canvas_bg.getContext('2d');
const SCREEN_W = canvas_bg.width / 8
const SCREEN_H = canvas_bg.height / 8

// display canvas
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

const map = [
  //1 2 3 4 5 6 7 8 9 0
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 1
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 2
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 3
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 4
    0,0,0,0,1,0,0,0,0,0,0,0,0,0, // 5
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 6
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 7
    0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 8
];


const spsheet = new SpriteSheet(8, 8, "./spritesheet.png");

export const input = new UserInput(document);


export function drawSprite(sprite_no, x, y, flip) {
    spsheet.drawSprite(context_bg, sprite_no, x, y, flip);
}

function clear_background() {
    context_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
}

function enlarge_and_display_background_buffer() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(canvas_bg, 0, 0, canvas_bg.width, canvas_bg.height, 0, 0, canvas.width, canvas.height);
}

function update() {
    clear_background();

    world.update();
    world.draw();

    enlarge_and_display_background_buffer();

    requestAnimationFrame(update);
}

let world = new World(SCREEN_W, SCREEN_H, map);

requestAnimationFrame(update);

