import {shake_camera} from "./index.js"
import {Chara} from "./Chara.js"
import {Snail} from "./Snail.js"
import {Pipe} from "./Pipe.js"
import {Block} from "./Block.js"
import {PowBlock} from "./PBlock.js"

const MAP_ELEM_SIZE = 8;

const GRAVITY = 0.2;

const Elem = {
    NONE: 0,
    PLAYER: 1,
    PIPE: 2,
    BLOCK: 3,
    POW: 4,
}

export class World {
    constructor(w,h, data) {
        this.w = w;
        this.h = h;
        this.map = this.create_objs_from_map_data(data);
        this.player = this.create_player(w,h,data);
        this.enemy_list = [Snail.create(5*MAP_ELEM_SIZE, 8*MAP_ELEM_SIZE, this)];
    }

    create_objs_from_map_data(m) {
        let dat = [];
        for (let y = 0; y < this.h; y++) {
            for (let x = 0; x < this.w; x++) {
                let id = m[x + y*this.w];
                const px = x*MAP_ELEM_SIZE;
                const py = y*MAP_ELEM_SIZE;
                switch(id) {
                case Elem.PIPE: dat.push(Pipe.create(px, py, this)); break;
                case Elem.BLOCK: dat.push(Block.create(px, py, this)); break;
                case Elem.POW: dat.push(PowBlock.create(px, py, this)); break;
                }
            }
        }
        return dat;
    }

    create_player(w, h, data) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (data[x + y*w] == Elem.PLAYER)
                    return Chara.create(x*MAP_ELEM_SIZE, y*MAP_ELEM_SIZE, this);
            }
        }
    }

    pushUpObj(src) {
        let ht = false;
        for (let o of this.map) {
            if (o.push_up(src))
                ht = true;
        }
        return ht;
    }

    pushUpEnemy(src) {
        for (let o of this.enemy_list) {
            o.push_up(src);
        }
    }

    pushUpAllEnemy() {
        shake_camera();
        for (let o of this.enemy_list) {
            if (o.is_on_obj(1)) 
                o.push_up(o);
        }
    }

    hitEnemy(src) {
        for (let o of this.enemy_list) {
            o.hit(src);
        }
    }

    warp_if_outside(obj) {
        if (obj.x <= 0) obj.x = (this.w)* MAP_ELEM_SIZE-MAP_ELEM_SIZE;
        if (obj.x > (this.w-1)* MAP_ELEM_SIZE) obj.x = 1 
    }

    warp_if_outside2(obj) {
        if (obj.x <= 0) {
            obj.x = (this.w)* MAP_ELEM_SIZE-MAP_ELEM_SIZE;
            if (obj.y == 26*MAP_ELEM_SIZE)
                obj.y = 8*MAP_ELEM_SIZE;
        }
        if (obj.x > (this.w-1)* MAP_ELEM_SIZE) {
            obj.x = 1 
            if (obj.y == 26*MAP_ELEM_SIZE)
                obj.y = 8*MAP_ELEM_SIZE;
        }
    }

    checkHitObj(src) {
        for (let o of this.map) {
            if (o.hit(src)) {
                return true;
            }
        }
        return false;
    }

    update() {
        this.player.affectForce(0, GRAVITY);
        this.player.update();
        this.hitEnemy(this.player);
        this.warp_if_outside(this.player);

        for (let o of this.map) {
            o.affectForce(0, GRAVITY);
            o.update();
        }

        for (let e of this.enemy_list) {
            e.affectForce(0, GRAVITY);
            e.update();
            this.warp_if_outside2(e);
            if (e.y > this.h*MAP_ELEM_SIZE) {
                let x = Math.floor(Math.random()*this.w)+1;
                e.init(x*MAP_ELEM_SIZE, 0, x > this.w/2? true:false);
            }
        }
    }

    draw() {
        for (let o of this.map) {
            o.draw();
        }

        this.player.draw();

        for (let e of this.enemy_list) {
            e.draw();
        }
    }
}

