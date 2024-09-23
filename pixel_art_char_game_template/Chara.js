import {drawSprite, input} from "./index.js"

const State = {
    STOP: 'STOP',
    MOVE_LEFT : 'MOVE_LEFT',
    MOVE_RIGHT: 'MOVE_RIGHT',
    MOVE_UP : 'MOVE_UP',
    MOVE_DOWN : 'MOVE_DOWN',
}

const anime_table =  {
    STOP: {move_count: 0, frames: [16], frame_interval: 60},
    MOVE_LEFT: {move_count: 8, frames: [16,17], frame_interval: 2},
    MOVE_RIGHT: { move_count: 8, frames: [16,17], frame_interval: 2},
    MOVE_UP: {move_count: 8, frames: [18,19], frame_interval: 2},
    MOVE_DOWN: {move_count: 8, frames: [20,21], frame_interval: 2},
};

export class Chara {

    constructor(x,y, world) {
        this.x = x;
        this.y = y;
        this.w = 8;
        this.h = 8;
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
        let action_func = `action_${this.state.toLowerCase()}`;

        if (!this[action_func]()) {
            this.check_stop();
            if (input.left) {
                this.check_move_left();
            }
            if (input.right) {
                this.check_move_right();
            }
            if (input.up) {
                this.check_move_up();
            }
            if (input.down) {
                this.check_move_down();
            }
        }

        this.anime_update();
    }
    check_stop() {
        this.change_state(State.STOP);
    }

    check_move_right() {
        this.change_state(State.MOVE_RIGHT);
        this.flip = false;
    }

    check_move_left() {
        this.change_state(State.MOVE_LEFT);
        this.flip = true;
    }

    check_move_up() {
        this.change_state(State.MOVE_UP);
    }

    check_move_down() {
        this.change_state(State.MOVE_DOWN);
    }

    action_stop() {
    }

    action_move_left() {
        return this.count_move(-1, 0);
    }

    action_move_right() {
        return this.count_move(1, 0);
    }
    action_move_up() {
        return this.count_move(0, -1);
    }

    action_move_down() {
        return this.count_move(0, 1);
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
            return false; // 動作が終わったらfalseを返す
        }
        this.x += dx;
        this.y += dy;
        return true;
    }

    draw() {
        drawSprite(this.sprite, this.x, this.y, this.flip);
    }

}

