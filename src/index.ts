const canvas = document.querySelector(".my_canvas") as HTMLCanvasElement;
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ctx = canvas.getContext("2d");

class Point {
    x: number;
    y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    start: Point;
    end: Point;

    public constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
}

class RgbColor {
    r: number;
    g: number;
    b: number;

    public constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public toStyleColorString() {
        let col: string = "rgb(" + this.r.toString() + " " + this.g.toString() + " " + this.b.toString() + ")";
        return col;

    }
}

class LinSpace {
    low: number;
    high: number;
    sample_number: number;

    public constructor(low: number, high: number, sample_count: number) {
        this.low = low;
        this.high = high;
        this.sample_number = sample_count;
    }

    public get_vals(): number[] {
        let result: number[] = [];
        let step_size = (this.high - this.low) / this.sample_number;
        for (let i = 0; i < this.sample_number; i += 1) {
            result.push(i * step_size + this.low);
        }
        return result;
    }
}

class Graph2d {
    fn: (x: number) => number;
    linespace: LinSpace;

    public constructor(fn: (x: number) => number, l: LinSpace) {
        this.fn = fn;
        this.linespace = l;
    }

    public get_points(): Point[] {
        let result: Point[] = [];
        let vals = this.linespace.get_vals();
        for (let x in vals) {
            result.push(new Point(vals[x], this.fn(vals[x])));
        }
        return result;
    }

    public graph(top_left: Point, bot_right: Point): void {
        let points: Point[] = this.get_points();
        let max_x = points[0].x;
        let min_x = points[0].x;
        let max_y = points[0].y;
        let min_y = points[0].y;
        for (let i in points) {
            let x = points[i].x;
            let y = points[i].y;
            if (x > max_x) {
                max_x = x;
            }
            if (x < min_x) {
                min_x = x;
            }
            if (y > max_y) {
                max_y = y;
            }
            if (y < min_y) {
                min_y = y;
            }
        }
        if (ctx == null) {
            return;
        }
        ctx.beginPath();
        let w = bot_right.x - top_left.x;
        let h = top_left.y - bot_right.y;
        ctx.moveTo(top_left.x + w * ((points[0].x - min_x) / (max_x - min_x)), bot_right.y + h * ((points[0].y - min_y) / (max_y - min_y)));
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(top_left.x + w * ((points[i].x - min_x) / (max_x - min_x)), bot_right.y + h * ((points[i].y - min_y) / (max_y - min_y)));
        }
        ctx.stroke();
    }
}

function draw_line(line: Line, color: RgbColor, width: number): void {
    if (ctx == null) {
        console.log("ctx is null");
        return;
    }
    console.log(line.start.x);
    ctx.strokeStyle = color.toStyleColorString();
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
}

let black = new RgbColor(0, 0, 0);
if (ctx != null) {
    ctx.strokeStyle = black.toStyleColorString();
    ctx.lineWidth = 2;
    function f(x: number): number { return x * x};
    let g = new Graph2d(f, new LinSpace(-4, 4, 200));
    for (let i = 100; i < width + 100; i += 100) {
        for (let j = 100; j < height + 100; j += 100) {
            g.graph(new Point(i - 100, j - 100), new Point(i, j));
        }
    }
}
