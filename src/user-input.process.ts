import { canvData } from './canvas';
import { clearCanvas } from './canvasView';
import { graphInput } from './inputComponents';
import { drawAxis, redrawAxis } from './services/axis.service';
import { drawGraph } from './services/graph.service';

export function onMove(event: any, pointerCoords: { x: number; y: number }) {
  const afterMoveCoords = {
    y: event.screenY || event.changedTouches[0].clientY,
    x: event.screenX || event.changedTouches[0].clientX,
  };
  let changedX = pointerCoords.x - afterMoveCoords.x;
  let changedY = pointerCoords.y - afterMoveCoords.y;

  clearCanvas();

  redrawAxis(changedX, changedY);
  //update pointer coords
  pointerCoords.x = afterMoveCoords.x;
  pointerCoords.y = afterMoveCoords.y;
  //calc difference between basic center ( canv width/height / 2 ) and center right now( axis coords )
  canvData.axis.centerDifferenceX = canvData.width / 2 - canvData.axis.yAxis;
  canvData.axis.centerDifferenceY = canvData.height / 2 - canvData.axis.xAxis;
  drawGraph(canvData.graphFunc, canvData.axis.centerDifferenceX);
}

function nextFactor(op: 'up' | 'down') {
  const zoomData = canvData.scale;
  switch (Math.abs(zoomData.factor)) {
    case 1:
      zoomData.factor += op === 'up' ? 1 : -3;
      break;
    case 2:
      zoomData.factor += op === 'up' ? 3 : -3;
      break;
    case 5:
      if (zoomData.factor === -5 && op === 'up') {
        zoomData.factor = -2;
      } else if (zoomData.factor === -5 && op === 'down') {
        zoomData.factor = 1;
        zoomData.factorMult *= -0.1;
        break;
      } else if (zoomData.factor === 5 && op === 'up') {
        zoomData.factor = 1;
        zoomData.factorMult *= 10;
      } else if (zoomData.factor === 5 && op === 'down') {
        zoomData.factor = 2;
      }
  }
}

function generateNumRow() {
  let obj = {};
  for (let i = 0; i < 10; i += 1) {
    const num =
      canvData.scale.factor < 0
        ? i / canvData.scale.factor
        : i * canvData.scale.factor;
    obj[num] = i * 5;
  }
  return obj;
}

export function onWheel(e: any) {
  const zoomData = canvData.scale;
  const delta = e.wheelDelta / 1000;
  let newScale = e.wheelDelta / 10;

  if (newScale < 0 && newScale * -1 > canvData.scale.scale) {
    canvData.scale.scale = canvData.scale.scale / newScale;
  } else {
    canvData.scale.scale += -newScale;
  }

  zoomData.allegedUnit -= delta;
  if (
    (zoomData.allegedUnit <= 0.5 && Math.abs(zoomData.factor) === 5) ||
    (zoomData.allegedUnit <= 0.5 && Math.abs(zoomData.factor) === 1) ||
    (zoomData.allegedUnit <= 0.4 && Math.abs(zoomData.factor) === 2)
  ) {
    zoomData.allegedUnit = 1;
    nextFactor('up');
    canvData.numberLine = generateNumRow();
  }
  if (
    (zoomData.allegedUnit >= 1.5 && Math.abs(zoomData.factor) === 5) ||
    (zoomData.allegedUnit >= 1.5 && Math.abs(zoomData.factor) === 1) ||
    (zoomData.allegedUnit >= 1.4 && Math.abs(zoomData.factor) === 2)
  ) {
    zoomData.allegedUnit = 1;
    nextFactor('down');
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
  clearCanvas();
  drawAxis();
  const func = parseFunc(graphInput?.value);
  drawGraph(func, canvData.axis.centerDifferenceX);
  canvData.graphFunc = func;
}
