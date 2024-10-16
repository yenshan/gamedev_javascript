import {SpriteSheet} from "./SpriteSheet.js"
import {drawSprite} from "./index.js"
import { Chara } from "./Chara.js"

const MAP_ELEM_SIZE = 8;

const GRAVITY = 0.2;

const spsheet = new SpriteSheet(8, 8, "./assets/tilesheet.png");

const Elem = {
    NONE: 0,
    PLAYER: 1,
    BLOCK: 2,
}

class ENone {
    can_go_through() { return true; }
    can_pick_up() { return false; }
    sprite_no() { return 0; }
    update() {}
}

class EBlock {
    can_go_through() { return false; }
    can_pick_up() { return false; }
    sprite_no() { return 1; }
    update() {}
}

const enone = new ENone();

function createElem(id) {
    switch(id) {
    case Elem.NONE: return new ENone();
    case Elem.BLOCK: return new EBlock();
    default: return new ENone();
    }
}

function createMap(m) {
    let dat = [];
    for (let i = 0; i < m.length; i++) {
        dat[i] = createElem(m[i]);
    }
    return dat;
}

export class World {
    constructor(w,h, data) {
        this.w = w;
        this.h = h;
        this.map = createMap(data);
        this.player = this.createPlayer(w,h,data);
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
        return this.get_obj(x,y).can_go_through();
    }

    warp_if_outside(obj) {
        if (obj.x <= 0) obj.x = (this.w-1)* MAP_ELEM_SIZE-obj.w;
        if (obj.x > (this.w-1)* MAP_ELEM_SIZE) obj.x = 1 
    }

    can_not_go_through(o, dy) {
        return !this.canGoThrough(o.x+2, o.y + dy) || !this.canGoThrough(o.x+o.w-2, o.y + dy);
    }

    do_fall(o) {
        if (o.vy == 0 && this.can_not_go_through(o, o.h)) {
            return;
        }
        if (o.vy > 0 && this.can_not_go_through(o, o.h + o.vy)) {
            o.vy = 0;
            return;
        }
        if (o.vy < 0 && this.can_not_go_through(o, 4)) {
            o.vy = 0;
            return;
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
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
               let sno = this.map[x+y*this.w].sprite_no();
               drawSprite(spsheet, sno, x*MAP_ELEM_SIZE, y*MAP_ELEM_SIZE);
            }
        }
    }

    draw() {
        this.draw_map();
        this.player.draw();
    }
}

