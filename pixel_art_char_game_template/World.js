import {drawSprite} from "./index.js"
import { Chara } from "./Chara.js"

const MAP_ELEM_SIZE = 8;

const Elem = {
    NONE: 0,
    PLAYER: 1,
}

class ENone {
    can_go_through() { return true; }
    can_up() { return false; }
    can_stand_on() { return false; }
    can_hang() { return false; }
    is_dig_hole() { return false;}
    can_pick_up() { return false; }
    sprite_no() { return 0; }
    dig() {}
    update() {}
}

function createElem(id) {
    switch(id) {
    case Elem.NONE: return new ENone();
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
        let x = Math.floor(sx/MAP_ELEM_SIZE);
        let y = Math.floor(sy/MAP_ELEM_SIZE);
        return this.map[x + y*this.w];
    }

    canGoThrough(x,y) {
        return this.get_obj(x,y).can_go_through();
    }

    update() {
        this.player.update();

        for (let o of this.map) {
            o.update();
        }
    }

    draw_map() {
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
               let sno = this.map[x+y*this.w].sprite_no();
               drawSprite(sno, x*MAP_ELEM_SIZE, y*MAP_ELEM_SIZE);
            }
        }
    }

    draw() {
        this.draw_map();
        this.player.draw();
    }
}

