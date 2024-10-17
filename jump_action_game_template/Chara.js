import {SpriteSheet} from "./SpriteSheet.js"
import {drawSprite, input} from "./index.js"

const CHARA_WIDTH = 16;
const CHARA_HEIGHT = 24;
const JUMP_VY = -5;

const State = {
    STOP: 'STOP',
    MOVE_LEFT : 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    JUMP_UP: 'JUMP_UP',
    JUMP_DOWN: 'JUMP_DOWN',
    FALL: 'FALL',
}

const anime_table = {
    STOP: {move_count: 1, frames: [0], frame_interval: 60},
    MOVE_LEFT: {move_count: 12, frames: [1,2,3,1,5,4], frame_interval: 2},
    MOVE_RIGHT: {move_count: 12, frames: [1,2,3,1,5,4], frame_interval: 2},
    JUMP_UP: {move_count: 60, frames: [6], frame_interval: 1},
    JUMP_DOWN: {move_count: 60, frames: [6], frame_interval: 1},
    FALL: {move_count: 1, frames: [3], frame_interval: 1},
};

const spsheet = new SpriteSheet(CHARA_WIDTH, CHARA_HEIGHT, "./assets/chara_spritesheet.png");

export class Chara {

    constructor(x,y, world) {
        this.x = x;
        this.y = y;
        this.w = CHARA_WIDTH;
        this.h = CHARA_HEIGHT;
        this.vx = 0;
        this.vy = 0;
        this.anime_count = 0;
        this.anime_index = 0;
        this.move_count = 0;
        this.state = State.STOP;
        this.flip = false;
        this.anime_table = anime_table;
        this.world = world;
        this.sprite = 16;
    }

    update() {
        if (this.do_action().finished) {
            if (this.vy > 0) {
                this.change_state(State.FALL);
            } else {
                this.vx = 0;
                this.change_state(State.STOP);
            }

            if (input.left) {
                this.check_move_left();
            }
            if (input.right) {
                this.check_move_right();
            }
            if (input.A) {
                this.do_jump();
            }
        }

        this.anime_update();
    }

    do_action() {
        const action_func = `action_${this.state.toLowerCase()}`;
        return this[action_func]();
    }

    do_jump() {
        if (input.left) {
            this.vx = -1;
            this.flip = true;
        }
        if (input.right) {
            this.vx = 1;
            this.flip = false;
        }
        this.vy = JUMP_VY;
        this.change_state(State.JUMP_UP);
    }
    
    check_move_right() {
        this.change_state(State.MOVE_RIGHT);
        this.flip = false;
    }

    check_move_left() {
        this.change_state(State.MOVE_LEFT);
        this.flip = true;
    }

    action_stop() {
        return this.count_move(0,0);
    }

    action_fall() {
        return this.count_move(0,0);
    }

    action_move_left() {
        return this.count_move(-1, 0);
    }

    action_move_right() {
        return this.count_move(1, 0);
    }

    action_jump_up() {
        if (this.vy > 0) {
            this.change_state(State.JUMP_DOWN);
            return { finished: false };
        }
        return this.count_move(this.vx, 0);
    }

    action_jump_down() {
        if (this.vy == 0) {
            this.change_state(State.STOP);
            return { finished: false };
        }
        return this.count_move(this.vx, 0);
    }

    anime_update() {
        let frames = this.anime_table[this.state].frames;
        let frame_interval = this.anime_table[this.state].frame_interval;

        if (this.anime_count >= frame_interval) {
            this.anime_index++;
            this.anime_count = 0;
        }

        if (this.anime_index >= frames.length)
            this.anime_index = 0;

        this.sprite = frames[this.anime_index];
        this.anime_count++;
    }

    change_state(state) {
        this.state = state;
        this.move_count = this.anime_table[this.state].move_count;
    }

    count_move(dx, dy) {
        this.move_count--;
        if (this.move_count < 0) {
            return { finished: true };
        }
        this.x += dx;
        this.y += dy;
        return { finished: false };
    }

    draw() {
        drawSprite(spsheet, this.sprite, this.x, this.y, this.flip);
    }

}

