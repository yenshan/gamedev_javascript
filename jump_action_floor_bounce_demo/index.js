import { SpriteSheet } from "./SpriteSheet.js"
import { UserInput } from "./UserInput.js"
import { Chara } from "./Chara.js"
import { World } from "./World.js"

const SCREEN_W = 36
const SCREEN_H = 32

// background canvas
const canvas_bg = document.getElementById('canvasBg');
const context_bg = canvas_bg.getContext('2d');
canvas_bg.width = SCREEN_W * 8;
canvas_bg.height = SCREEN_H * 8;

// display canvas
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = canvas_bg.width * 2;
canvas.height = canvas_bg.height * 2;
context.imageSmoothingEnabled = false;

// Adjust canvas size to maintain aspect ratio
function resizeCanvas() {
    const aspectRatio = SCREEN_W / SCREEN_H;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight;
    
    if (width / height > aspectRatio) {
        canvas.height = height;
        canvas.width = height * aspectRatio;
    } else {
        canvas.width = width;
        canvas.height = width / aspectRatio;
    }
    
    context.imageSmoothingEnabled = false;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

export const input = new UserInput(document);

const bg_image = new Image();
bg_image.src = "./assets/background_picture.png"

let stages = [];
// load stage data
const res = await fetch("./assets/stages.json");
if (res.ok) {
    const data = await res.json();
    stages = data.maps;
}


export function drawSprite(spsheet, sprite_no, x, y, flip) {
    spsheet.drawSprite(context_bg, sprite_no, x, y, flip);
}

function clear_background() {
    context_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
}

function draw_background_image() {
    context.drawImage(bg_image, 0,0,700,700, 0,0, canvas.width, canvas.height);
    context.globalAlpha = 0.7;  
    context.fillStyle = "black"; 
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1.0;
}

function enlarge_and_display_background_buffer() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(canvas_bg, 8, 8*2, canvas_bg.width-8, canvas_bg.height-8*4, 0, 0, canvas.width, canvas.height);
}

function update() {
    clear_background();

    world.update();
    world.draw();

    enlarge_and_display_background_buffer();

    requestAnimationFrame(update);
}

let world = new World(SCREEN_W, SCREEN_H, stages[0].data);

update();

