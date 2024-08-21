import { canvData } from '../canvas';
import { drawLine, setBegin, setPoint } from '../canvasView';

function getCanvYCoordFromGraphY(y: number) {
  if (y > 0) {
    return canvData.height / 2 - y - canvData.axis.centerDifferenceY;
  } else {
    return canvData.height / 2 + y * -1 - canvData.axis.centerDifferenceY;
  }
}

export function drawGraph(func: (x) => number, startPoint = 0) {
  if (func === null) return;
  const startXCoord = 0;
  const startYCoord = getCanvYCoordFromGraphY(func(0));
  let prevPoint = { canvX: startXCoord, canvY: startYCoord };
  //render graph from startPoint to canvWidth + startPoint
  setBegin(prevPoint);
  for (let i = startPoint; i < canvData.width + startPoint; i++) {
    const x = (i - canvData.width / 2) / canvData.scale.scale;
    const y = func(x) * canvData.scale.scale;
    const onCanvasX = Math.floor(i - canvData.axis.centerDifferenceX);
    const onCanvasY = Math.floor(getCanvYCoordFromGraphY(y));
    setPoint(onCanvasX, onCanvasY);
    prevPoint = { canvX: onCanvasX, canvY: onCanvasY };
  }
  drawLine();
}
