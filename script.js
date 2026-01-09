/*
 * Rabbit Animation Script V16 - Mobile Touch Support
 */

const ROWS = 12;
const COLS = 40;
const MS_TICK = 120;

// Assets
const RABBIT_SIDE = ["            |)|) ", "           (o )  ", '          /(")(")'];
const RABBIT_FRONT_IDLE = ["        (\\_/)    ", "        (o..o)   ", '        /(")(")  '];
const RABBIT_FRONT_EAT = ["        (\\_/)    ", "        (^..^)   ", '        /(")(")  '];

class RabbitAnimation {
    constructor(elementId) {
        this.element = document.getElementById(elementId);

        // State
        this.S = { IDLE: -1, EMERGE: 0, ENTER: 1, EAT: 2 };
        this.state = this.S.IDLE; // Start Idle
        this.tick = 0;
        this.START_X = 25;
        this.cx = this.START_X;
        this.RY = 5;
        this.GY = 7;

        // Grid
        this.cells = [];
        this.initGrid();

        // Loop
        setInterval(() => {
            this.update();
            this.draw();
        }, MS_TICK);
    }

    initGrid() {
        this.cells = [];
        for (let r = 0; r < ROWS; r++) {
            let row = [];
            for (let c = 0; c < COLS; c++) row.push({ c: " ", l: null });
            this.cells.push(row);
        }
    }

    put(y, x, str, color) {
        if (y < 0 || y >= ROWS) return;
        for (let i = 0; i < str.length; i++) {
            let tx = x + i;
            if (tx >= 0 && tx < COLS) this.cells[y][tx] = { c: str[i], l: color };
        }
    }

    clearGrid() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                this.cells[r][c] = { c: " ", l: null };
            }
        }
    }

    render() {
        return this.cells
            .map((row) => {
                let h = "";
                let lc = null;
                let ls = "";
                for (let c = 0; c < row.length; c++) {
                    let cell = row[c];
                    if (cell.l !== lc) {
                        if (ls.length > 0) h += lc ? `<span class="${lc}">${ls}</span>` : ls;
                        ls = cell.c;
                        lc = cell.l;
                    } else {
                        ls += cell.c;
                    }
                }
                if (ls.length > 0) h += lc ? `<span class="${lc}">${ls}</span>` : ls;
                return h;
            })
            .join("\n");
    }

    feed() {
        if (this.state === this.S.IDLE) {
            this.state = this.S.EMERGE;
            this.tick = 0;
            this.cx = this.START_X;
        }
    }

    update() {
        this.tick++;
        if (this.state === this.S.IDLE) {
            // Wait
        } else if (this.state === this.S.EMERGE) {
            if (this.tick > 12) {
                this.state = this.S.ENTER;
                this.cx = this.START_X;
            }
        } else if (this.state === this.S.ENTER) {
            this.cx -= 1;
            if (this.cx <= 12) {
                this.state = this.S.EAT;
                this.tick = 0;
            }
        } else if (this.state === this.S.EAT) {
            if (this.tick > 24) {
                this.state = this.S.IDLE;
                this.tick = 0;
            }
        }
    }

    draw() {
        this.clearGrid();

        // Draw Rabbit
        if (this.state === this.S.EAT) {
            for (let i = 0; i < RABBIT_FRONT_EAT.length; i++) this.put(this.RY + i, 0, RABBIT_FRONT_EAT[i], "c-white");

            let cy = this.RY + 1;
            let mc = "o";
            let ml = "c-white";

            if (this.tick <= 8) {
                this.put(cy, 13, "0", "c-white");
                this.put(cy, 14, "<", "c-green");
                this.put(cy, 15, "-", "c-green");
                mc = "<";
                ml = "c-orange";
            } else if (this.tick <= 16) {
                this.put(cy, 13, "<", "c-green");
                this.put(cy, 14, "-", "c-green");
                mc = "o";
                ml = "c-white";
            } else {
                this.put(cy, 13, "-", "c-green");
                mc = ">";
                ml = "c-green";
            }

            if (Math.floor(this.tick / 2) % 2 === 0) {
                this.put(this.RY + 1, 11, mc, ml);
                this.put(this.RY + 1, 9, "^", "c-white");
                this.put(this.RY + 1, 12, "^", "c-white");
            } else {
                this.put(this.RY + 1, 9, "-", "c-white");
                this.put(this.RY + 1, 12, "-", "c-white");
            }
        } else {
            for (let i = 0; i < RABBIT_FRONT_IDLE.length; i++)
                this.put(this.RY + i, 0, RABBIT_FRONT_IDLE[i], "c-white");

            if (this.state === this.S.ENTER || this.state === this.S.EMERGE) {
                this.put(this.RY + 1, 10, ".", "c-white");
                this.put(this.RY + 1, 11, ">", "c-white");
            }
        }

        // Draw Carrot
        let x = Math.floor(this.cx);
        if (this.state === this.S.EMERGE) {
            if (this.tick >= 2) {
                let y = this.GY - (this.tick >= 9 ? 2 : this.tick >= 6 ? 1 : 0);
                this.put(y, x, "↓", "c-green");
            }
            if (this.tick >= 6) {
                let y = this.GY - (this.tick >= 9 ? 1 : 0);
                this.put(y, x, "o", "c-white");
            }
            if (this.tick >= 9) this.put(this.GY, x, "V", "c-orange");
        } else if (this.state === this.S.ENTER) {
            this.put(this.GY, x, "<", "c-orange");
            this.put(this.GY, x + 1, "0", "c-white");
            this.put(this.GY, x + 2, "<", "c-green");
            this.put(this.GY, x + 3, "-", "c-green");
        }

        this.element.innerHTML = this.render();
    }
}

// Instantiate
const r1 = new RabbitAnimation("stage-left");
const r2 = new RabbitAnimation("stage-center");
const r3 = new RabbitAnimation("stage-right");

// Button Control
const btn = document.getElementById("feed-btn");

function handleFeed(e) {
    if (e && e.type === "touchstart") e.preventDefault(); // Prevent double-fire on mobile

    // Add small random delays
    setTimeout(() => r1.feed(), 0);
    setTimeout(() => r2.feed(), 200);
    setTimeout(() => r3.feed(), 400);

    // Optional: Visual feedback on button? CSS :active handles it.
}

btn.addEventListener("touchstart", handleFeed, { passive: false });
btn.addEventListener("click", handleFeed);
