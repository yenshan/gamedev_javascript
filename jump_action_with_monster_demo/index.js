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
    const aspectRatio = SCREEN_W*1.2 / SCREEN_H;

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

let stages = [];
// load stage data
const res = await fetch("./assets/stages.json");
if (res.ok) {
    const data = await res.json();
    stages = data.maps;
}

const camera_pos = {
    x: 8,
    y: 8*2,
};

// camera shake functions
//
let camera_up_count = 0;
let camera_down_count = 0;
const SHAKE_RANGE = 8;

export function shake_camera() {
    camera_up_count = SHAKE_RANGE;
}
function check_camera_shake() {
    if (camera_up_count > 0) {
        camera_up_count--;
        let dy = (SHAKE_RANGE-camera_up_count);
        camera_pos.y = 8*2 + dy;
        if (camera_up_count == 0)
            camera_down_count = SHAKE_RANGE;

    }
    if (camera_down_count > 0) {
        camera_down_count--;
        let dy = camera_down_count;
        camera_pos.y = 8*2 + dy;
    }
}

export function drawSprite(spsheet, sprite_no, x, y, flip) {
    spsheet.drawSprite(context_bg, sprite_no, x, y, flip);
}

function clear_background() {
    context_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
}

function enlarge_and_display_background_buffer() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const src_x = camera_pos.x;
    const src_y = camera_pos.y;
    const src_w = canvas_bg.width-8*2;
    const src_h = canvas_bg.height-8*4;
    context.drawImage(canvas_bg, src_x, src_y, src_w, src_h, 0, 0, canvas.width, canvas.height);
}

function update() {
    clear_background();

    world.update();
    world.draw();

    check_camera_shake();

    enlarge_and_display_background_buffer();

    requestAnimationFrame(update);
}

let world = new World(SCREEN_W, SCREEN_H, stages[0].data);

update();
