import {SpriteSheet} from "./SpriteSheet.js"
import {drawSprite, input} from "./index.js"

const CHARA_WIDTH = 16;
const CHARA_HEIGHT = 24;
const JUMP_VY = -5;

const State = {
    STOP: 'STOP',
    MOVE_LEFT : 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    TURN_LEFT: 'TURN_LEFT',
    TURN_RIGHT: 'TURN_RIGHT',
    BREAKING: 'BREAKING',
    JUMP_UP: 'JUMP_UP',
    JUMP_DOWN: 'JUMP_DOWN',
    JUMP_HIT: 'JUMP_HIT',
    FALL: 'FALL',
    FALL2: 'FALL2',
    DEAD: 'DEAD',
    FALL_END: 'FALL_END',
    REBORN: 'REBORN'
}

const anime_table = {
    STOP: {move_count: 1, frames: [0], frame_interval: 60},
    MOVE_LEFT: {move_count: 12, frames: [1,2,3,1,5,4], frame_interval: 2},
    MOVE_RIGHT: {move_count: 12, frames: [1,2,3,1,5,4], frame_interval: 2},
    TURN_LEFT: {move_count: 8, frames: [0], frame_interval: 2},
    TURN_RIGHT: {move_count: 8, frames: [0], frame_interval: 2},
    BREAKING: {move_count: 16, frames: [7,10,11], frame_interval: 2},
    JUMP_UP: {move_count: 60, frames: [6], frame_interval: 1},
    JUMP_DOWN: {move_count: 60, frames: [6], frame_interval: 1},
    JUMP_HIT: {move_count: 16, frames: [6], frame_interval: 1},
    FALL: {move_count: 1, frames: [3], frame_interval: 1},
    FALL2: {move_count: 1, frames: [7], frame_interval: 1},
    DEAD: {move_count: 30, frames: [8], frame_interval: 30},
    FALL_END: {move_count: 60, frames: [9], frame_interval: 60},
    REBORN: {move_count: 70, frames: [0], frame_interval: 70},
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
        this.prev_state = State.STOP;
        this.state = State.STOP;
        this.flip = false;
        this.anime_table = anime_table;
        this.world = world;
        this.sprite = 16;
    }

    update() {
        const action_func = `action_${this.state.toLowerCase()}`;
        this[action_func]();
        this.anime_update();
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
    
    move_right() {
        this.vx = 1;
        this.change_state(State.MOVE_RIGHT);
        this.flip = false;
    }

    move_left() {
        this.vx = -1;
        this.change_state(State.MOVE_LEFT);
        this.flip = true;
    }

    action_stop() {
        if (this.vy > 0) {
            if (this.vx == 0)
                this.change_state(State.FALL);
            else 
                this.change_state(State.FALL2);
        } else if (input.left) {
            this.move_left();
        } else if (input.right) {
            this.move_right();
        } else if (input.A) {
            this.do_jump();
        } else {
            this.count_move(0,0);
        }
    }

    action_fall() {
        if (this.vy == 0) {
            if (this.vx == 0) {
                this.change_state(State.STOP);
            } else if (this.vx > 0 && input.right) {
                this.change_state(State.MOVE_RIGHT);
            } else if (this.vx < 0 && input.left) {
                this.change_state(State.MOVE_LEFT);
            } else {
                this.change_state(State.BREAKING);
            }
        }
        this.x += this.vx;
    }

    action_fall2() {
        this.action_fall();
    }

    action_move_left() {
        if (!this.count_move(-1, 0).finished)
            return;

        if (this.vy > 0) {
            this.vx = -1;
            if (this.vx == 0)
                this.change_state(State.FALL);
            else 
                this.change_state(State.FALL2);
        } else if (input.A) {
            this.do_jump();
        } else if (input.left) {
            this.move_left();
        } else if (this.prev_state == State.STOP) {
            this.vx = 0;
            this.change_state(State.STOP);
        } else { 
            this.vx = -1;
            this.change_state(State.BREAKING);
        }
    }

    action_move_right() {
        if (!this.count_move(this.vx, 0).finished)
            return;

        if (this.vy > 0) {
            this.vx = 1;
            if (this.vx == 0)
                this.change_state(State.FALL);
            else 
                this.change_state(State.FALL2);
        } else if (input.A) {
            this.do_jump();
        } else if (input.right) {
            this.move_right();
        } else if (this.prev_state == State.STOP) {
            this.vx = 0;
            this.change_state(State.STOP);
        } else {
            this.vx = 1;
            this.change_state(State.BREAKING);
        }
    }

    action_jump_up() {
        if (this.vy < 0) {
            const hl = this.world.hitObj(this.x+2, this.y+9, 0, this.vy/4);
            const hc = this.world.hitObj(this.x+this.w/2, this.y+9, 0, this.vy/2);
            const hr = this.world.hitObj(this.x+this.w-2, this.y+9, 0, this.vy/4);
            if (hl || hc || hr) {
                this.vy = 0;
                this.change_state(State.JUMP_HIT);
                return;
            }
        }
        if (this.vy > 0) {
            this.change_state(State.JUMP_DOWN);
            return;
        }
        this.count_move(this.vx, 0);
    }

    action_jump_down() {
        if (this.vy != 0) {
            this.count_move(this.vx, 0);
            return;
        }
        if (this.vx > 0) {
            if (input.right)
                this.change_state(State.MOVE_RIGHT);
            else
                this.change_state(State.BREAKING);
        } else if (this.vx < 0) {
            if (input.left)
                this.change_state(State.MOVE_LEFT);
            else
                this.change_state(State.BREAKING);
        } else {
            this.change_state(State.STOP);
        }
    }

    action_jump_hit() {
        if (this.count_move(this.vx, -this.vy).finished) {
            this.vy = 1;
            this.change_state(State.JUMP_DOWN);
        }
    }

    action_breaking() {
        if (!this.count_move(this.vx, 0).finished)
            return;
        this.vx = 0;
        this.vy = 0;
        this.change_state(State.STOP);
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
        this.prev_state = this.state;
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

