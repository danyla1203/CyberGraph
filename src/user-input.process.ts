import { canvData } from "./canvas";
import { clearCanvas } from "./canvasView";
import { graphInput } from "./inputComponents";
import { drawAxis, redrawAxis } from "./services/axis.service";
import { drawGraph } from "./services/graph.service";

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

function nextScaleFactor(operation: string) {
  if (canvData.scale.factor == 2) {
    canvData.scale.factor = 5;
  } else if (canvData.scale.factor == 5) {
    canvData.scale.factor = 10;
  } else if (canvData.scale.factor == 10) {
    if (operation == 'mul') {
      canvData.scale.allegedUnit = canvData.scale.allegedUnit * 10;
    } else {
      canvData.scale.allegedUnit = canvData.scale.allegedUnit / 10;
    }
    canvData.scale.factor = 2;
  }
}
export function onWheel(e: any) {
  const newScale = e.wheelDelta / 10;
  if (newScale < 0 && newScale * -1 > canvData.scale.scale) {
    canvData.scale.scale = canvData.scale.scale / (newScale * -1);
  } else {
    canvData.scale.scale += newScale;
  }
  canvData.scale.scale = Math.round(canvData.scale.scale);
  if (canvData.scale.scale > canvData.scale.upperLimit) {
    canvData.scale.scaleIterationStep =
      canvData.scale.allegedUnit / canvData.scale.factor;
    canvData.scale.lowerLimit = canvData.scale.upperLimit;
    canvData.scale.upperLimit *= 2;
    nextScaleFactor('div');
  }
  if (canvData.scale.scale < canvData.scale.lowerLimit) {
    canvData.scale.scaleIterationStep =
      canvData.scale.allegedUnit * canvData.scale.factor;
    canvData.scale.upperLimit = canvData.scale.lowerLimit;
    canvData.scale.lowerLimit /= 2;
    nextScaleFactor('mul');
  }

  clearCanvas();
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
