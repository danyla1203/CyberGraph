const canvas = document.querySelector<HTMLCanvasElement>(
  '#graph',
) as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvHeight = canvas.height;
const canvWidth = canvas.width;

class CanvasData {
  height: number;
  width: number;
  axis: {
    yAxis: number;
    xAxis: number;
    centerDifferenceX: number;
    centerDifferenceY: number;
  };
  graphFunc: (x: number) => number;
  scale: {
    factor: number;
    factorMult: number;
    allegedUnit: number;
    viewMulti: number;
    scale: number;
  };
  numberLine: {
    xLeft: {};
  };
  constructor() {
    this.height = canvHeight;
    this.width = canvWidth;

    this.axis = {
      yAxis: canvWidth / 2,
      xAxis: canvHeight / 2,
      centerDifferenceX: 0,
      centerDifferenceY: 0,
    };
    this.scale = {
      scale: 100,
      factor: 1,
      factorMult: 1,
      allegedUnit: 1,
      viewMulti: 20,
    };
    this.graphFunc = (x: number) => 0;
    this.numberLine = { xLeft: {} };
    for (let i = 0; i < 40; i++) {
      this.numberLine.xLeft[i] = i * 5;
    }
  }
}

const canvData = new CanvasData();

export { canvData, ctx, canvas };
