import {SpriteSheet} from "./SpriteSheet.js"
import {drawSprite} from "./index.js"
import { Chara } from "./Chara.js"

const MAP_ELEM_SIZE = 8;

const GRAVITY = 0.2;

const spsheet = new SpriteSheet(8, 8, "./assets/tilesheet.png");

const Elem = {
    NONE: 0,
    PLAYER: 1,
    PIPE: 2,
    BLOCK: 3,
}

class EPipe {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = MAP_ELEM_SIZE;
        this.h = MAP_ELEM_SIZE;
        this.o_y = y;
        this.vy = 0;
        this.sp_no = 1;
        this.pushed_up = false;
    }
    can_go_through(x,y) {
        return x < this.x || x > this.x+this.w || y < this.y || y > this.y+this.h;
    }
    hit(x,y, dx, dy) {
        if (!this.can_go_through(x,y)) {
            this.x += dx;
            this.vy = dy;
            this.pushed_up = true;
            return true;
        }
        return false;
    }
    sprite_no() { return this.sp_no; }
    update() {
        if (this.pushed_up) {
            this.y += this.vy;
            this.vy += GRAVITY;
            if (this.vy >= 0) {
                if (Math.floor(this.y) == this.o_y) {
                    this.y = this.o_y;
                    this.pushed_up = false;
                } 
            }
        }
    }
}

class EBlock {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = MAP_ELEM_SIZE;
        this.h = MAP_ELEM_SIZE;
        this.sp_no = 2;
    }
    can_go_through(x,y) {
        return x < this.x || x > this.x+this.w || y < this.y || y > this.y+this.h;
    }
    hit(x,y,dx,dy) { 
        return !this.can_go_through(x,y); 
    }
    sprite_no() { return this.sp_no; }
    update() { }
}

export class World {
    constructor(w,h, data) {
        this.w = w;
        this.h = h;
        this.map = this.createMap(data);
        this.player = this.createPlayer(w,h,data);
    }

    createMap(m) {
        let dat = [];
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                let id = m[x + y*this.w];
                switch(id) {
                case Elem.PIPE: dat.push(new EPipe(x*MAP_ELEM_SIZE, y*MAP_ELEM_SIZE)); break;
                case Elem.BLOCK: dat.push(new EBlock(x*MAP_ELEM_SIZE, y*MAP_ELEM_SIZE)); break;
                }
            }
        }
        return dat;
    }

    createPlayer(w, h, data) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (data[x + y*w] == Elem.PLAYER)
                    return new Chara(x*MAP_ELEM_SIZE, y*MAP_ELEM_SIZE, this);
            }
        }
    }

    get_obj(sx,sy) {
        const x = Math.floor(sx/MAP_ELEM_SIZE);
        const y = Math.floor(sy/MAP_ELEM_SIZE);
        const idx = x + y*this.w;
        if (idx < 0 || idx >= this.map.length) {
            return enone;
        }
        return this.map[idx];
    }

    canGoThrough(x,y) {
        for (let o of this.map) {
            if (!o.can_go_through(x, y)) {
                return false;
            }
        }
        return true;
    }

    hitObj(x,y,dx,dy) {
        for (let o of this.map) {
            if (o.hit(x,y, dx, dy)) {
                return true;
            }
        }
        return false;
    }

    warp_if_outside(obj) {
        if (obj.x <= 0) obj.x = (this.w)* MAP_ELEM_SIZE-MAP_ELEM_SIZE;
        if (obj.x > (this.w-1)* MAP_ELEM_SIZE) obj.x = 1 
    }

    do_fall(o) {
        if (o.vy > 0) {
            if (!this.canGoThrough(o.x+2, o.y + o.h + o.vy)
                || !this.canGoThrough(o.x+o.w-2, o.y + o.h + o.vy)) {
                o.vy = 0;
                return;
            }
        }
        if (o.vy == 0) {
            if (!this.canGoThrough(o.x+2, o.y + o.h)
                || !this.canGoThrough(o.x+o.w-2, o.y + o.h)) {
                return;
            }
        }
        o.vy += GRAVITY;
        o.y = Math.round(o.y+o.vy);
    }

    update() {
        this.player.update();
        this.warp_if_outside(this.player);
        this.do_fall(this.player);

        for (let o of this.map) {
            o.update();
        }
    }

    draw_map() {
        for (let o of this.map) {
            drawSprite(spsheet, o.sprite_no(), o.x, o.y);
        }
    }

    draw() {
        this.draw_map();
        this.player.draw();
    }
}

