import { canvData } from "../canvas";
import { drawLine, setBegin, setPoint } from "../canvasView";

function getCanvYCoordFromGraphY(graphY: number) {
  if (graphY > 0) {
    return canvData.height / 2 - graphY - canvData.axis.centerDifferenceY;
  } else {
    return canvData.height / 2 + graphY * -1 - canvData.axis.centerDifferenceY;
  }
}

function getPrevPoint(canvX: any, canvY: any) {
  return {
    canvX: canvX,
    canvY: canvY,
  };
}

export function drawGraph(getYFunc: any, startPoint = 0) {
  if (getYFunc == null) {
    return;
  }
  let canvXOnStart = 0;
  let canvYOnStart = getCanvYCoordFromGraphY(getYFunc(0 - canvData.width / 2));
  let prevPoint = getPrevPoint(canvXOnStart, canvYOnStart);
  //render graph from startPoint to canvWidth + startPoint
  setBegin(prevPoint);
  for (let i = startPoint; i < canvData.width + startPoint; i++) {
    let graphX = (i - canvData.width / 2) / canvData.scale.scale;
    let graphY = getYFunc(graphX) * canvData.scale.scale;
    let canvX = Math.floor(i - canvData.axis.centerDifferenceX);
    let canvY = Math.floor(getCanvYCoordFromGraphY(graphY));

    setPoint(canvX, canvY);
    prevPoint = getPrevPoint(canvX, canvY);
  }
  drawLine();
}
