import { canvData } from './canvas';
import { clearCanvas } from './canvasView';
import { graphInput } from './inputComponents';
import { drawAxis, redrawAxis } from './services/axis.service';
import { drawGraph } from './services/graph.service';

function redrawCanvas() {
  clearCanvas();
  drawAxis();
}

export function onMove(event: any, pointerCoords: { x: number; y: number }) {
  const afterMoveCoords = {
    y: event.screenY || event.changedTouches[0].clientY,
    x: event.screenX || event.changedTouches[0].clientX,
  };
  let changedX = pointerCoords.x - afterMoveCoords.x;
  let changedY = pointerCoords.y - afterMoveCoords.y;

  redrawCanvas();

  redrawAxis(changedX, changedY);
  //update pointer coords
  pointerCoords.x = afterMoveCoords.x;
  pointerCoords.y = afterMoveCoords.y;
  //calc difference between basic center ( canv width/height / 2 ) and center right now( axis coords )
  canvData.axis.centerDifferenceX = canvData.width / 2 - canvData.axis.yAxis;
  canvData.axis.centerDifferenceY = canvData.height / 2 - canvData.axis.xAxis;
  drawGraph(canvData.graphFunc, canvData.axis.centerDifferenceX);
}

function nextFactor() {
  const zoomData = canvData.scale;
  switch (zoomData.factor) {
    case 1:
      zoomData.factor = 2;
      break;
    case 2:
      zoomData.factor = 5;
      break;
    case 5:
      zoomData.factor = 1;
      zoomData.factorMult *= 10;
      break;
  }
}

function generateNumRow() {
  let obj = {};
  for (let i = 0; i < 10; i += 1) {
    obj[i * canvData.scale.factor] = i * 5;
  }
  return obj;
}

export function onWheel(e: any) {
  const zoomData = canvData.scale;
  const delta = e.wheelDelta / 1000;
  canvData.scale.scale += e.wheelDelta / 10 * -1;
  zoomData.allegedUnit -= delta;

  if (
    (zoomData.allegedUnit <= 0.5 && zoomData.factor === 1) ||
    (zoomData.allegedUnit <= 0.4 && zoomData.factor === 2)
  ) {
    zoomData.allegedUnit = 1;
    nextFactor();
    canvData.numberLine = generateNumRow();
  }

  clearCanvas();
  drawAxis();
  drawGraph(canvData.graphFunc, canvData.axis.centerDifferenceX);
}

function parseFunc(func: string) {
  return (x: number) => {
    return eval(func.replace('abs(x)', 'Math.abs(x)'));
  };
}
export function buttonClick() {
  redrawCanvas();
  const func = parseFunc(graphInput?.value);
  drawGraph(func, canvData.axis.centerDifferenceX);
  canvData.graphFunc = func;
}
