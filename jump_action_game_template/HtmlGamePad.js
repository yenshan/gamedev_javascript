
// controls.js
export class HtmlGamePad {
    constructor(document) {
        this.document = document;
        this.buttons = this.document.querySelectorAll('.button');
        this.dpad_buttons = this.document.querySelectorAll('.dpad-button');
        this.isJoystickActive = false;
        this.joystickCenter = { x: 0, y: 0 };
        this.eventListeners = {};
        this.initButtons();
    }

    initButtons() {
        this.buttons.forEach(button => {
            button.addEventListener('mousedown', (e) => this.dispatchEvent('buttonPress', e.currentTarget.getAttribute('value')));
            button.addEventListener('mouseup', (e) => this.dispatchEvent('buttonRelease', e.currentTarget.getAttribute('value')));
            button.addEventListener('touchstart', (e) => { 
                this.dispatchEvent('buttonPress', e.currentTarget.getAttribute('value'));
                e.preventDefault();
            });
            button.addEventListener('touchend', (e) => this.dispatchEvent('buttonRelease', e.currentTarget.getAttribute('value')));
        });
        this.dpad_buttons.forEach(button => {
            button.addEventListener('mousedown', (e) => this.dispatchEvent("buttonPress", e.currentTarget.getAttribute('value')));
            button.addEventListener('mouseup', (e) => this.dispatchEvent("buttonRelease", e.currentTarget.getAttribute('value')));
            button.addEventListener('touchstart', (e) => {
                this.dispatchEvent('buttonPress', e.currentTarget.getAttribute('value'));
                e.preventDefault();
            });
            button.addEventListener('touchend', (e) => this.dispatchEvent("buttonRelease", e.currentTarget.getAttribute('value')));
        });
    }

    dispatchEvent(eventName, detail) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => callback({ detail }));
        }
    }

    addEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
}
