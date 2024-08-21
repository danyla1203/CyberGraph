import {
  drawText,
  clearAxisX,
  clearAxisY,
  drawAxisLineX,
  drawAxisLineY,
} from '../canvasView';
import { canvData } from '../canvas';

const axisData = canvData.axis;

function makeAxisY(canvX: number) {
  drawAxisLineY(canvX, canvData.width);
  let iterationCount =
    (Math.abs(axisData.xAxis) + Math.abs(axisData.centerDifferenceY)) /
    canvData.scale.scale;
  if (axisData.xAxis > 0) {
    for (
      let i = 0;
      i <= iterationCount;
      i += canvData.scale.scaleIterationStep
    ) {
      let textY = Math.floor(axisData.xAxis - i * canvData.scale.scale);
      if (textY < 0 || textY > 1100) {
        continue;
      }
      drawText(Math.floor(axisData.yAxis + 3), textY, i);
    }
  }
  if (axisData.xAxis > 1000) {
    return;
  }
  iterationCount += Math.abs(axisData.centerDifferenceY) / canvData.scale.scale;
  for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    let textY = Math.floor(axisData.xAxis + i * canvData.scale.scale);
    if (textY < 0 || textY > 1100) {
      continue;
    }
    drawText(Math.floor(axisData.yAxis + 3), textY, i);
  }
}
function makeAxisX(canvY: number) {
  drawAxisLineX(canvY, canvData.width);
  let iterationCount =
    (Math.abs(axisData.yAxis) + Math.abs(axisData.centerDifferenceX)) /
    canvData.scale.scale;
  for (let i = 1; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    const textX = Math.floor(axisData.yAxis - i * canvData.scale.scale);
    if (textX < 0 || textX > 1900) continue;
    drawText(textX , axisData.xAxis + 10, i);
  }
  iterationCount += Math.abs(axisData.centerDifferenceX) / canvData.scale.scale;
  for (let i = 1; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    let textX = Math.floor(axisData.yAxis + i * canvData.scale.scale);
    if (textX > 1900) continue;
    drawText(textX, axisData.xAxis + 10, i);
  }
}

export function drawAxis() {
  makeAxisX(axisData.xAxis);
  makeAxisY(axisData.yAxis);
}

export function redrawAxis(changedX: number, changedY: number) {
  clearAxisX(axisData.xAxis);
  clearAxisY(axisData.yAxis);

  //update axisData fields by changeX, changeY
  if (changedY > 0) {
    let canvY = changedY;
    axisData.xAxis -= canvY;
  } else if (changedY < 0) {
    let canvY = changedY * -1;
    axisData.xAxis += canvY;
  }

  if (changedX < 0) {
    let canvX = changedX * -1;
    axisData.yAxis += canvX;
  } else if (changedX > 0) {
    let canvX = changedX;
    axisData.yAxis -= canvX;
  }
  makeAxisY(axisData.yAxis);
  makeAxisX(axisData.xAxis);
}
