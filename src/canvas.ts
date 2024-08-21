const canvas = document.querySelector<HTMLCanvasElement>(
  '#graph',
) as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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
    allegedUnit: number;
    scaleIterationStep: number;
    scale: number;
    upperLimit: number;
    lowerLimit: number;
    factor: number;
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
      allegedUnit: 1,
      scaleIterationStep: 1,
      scale: 100,
      upperLimit: 150,
      lowerLimit: 50,
      factor: 2,
    };
    this.graphFunc = (x: number) => 0;
  }
}

const canvData = new CanvasData();

export { canvData, ctx, canvas };
