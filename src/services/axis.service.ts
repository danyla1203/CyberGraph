import {
  drawText,
  clearAxisX,
  clearAxisY,
  drawAxisLineX,
  drawAxisLineY,
} from '../canvasView';
import { canvData } from '../canvas';

const axisData = canvData.axis;

function drawNumbersY() {
  let iterationCount =
    (Math.abs(axisData.xAxis) + Math.abs(axisData.centerDifferenceY)) /
    canvData.scale.scale;
  for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    let textY = Math.floor(axisData.xAxis - i * canvData.scale.scale);
    if (textY < 0 || textY > 1100) {
      continue;
    }
    drawText(Math.floor(axisData.yAxis + 3), textY, i);
  }
  iterationCount += Math.abs(axisData.centerDifferenceY) / canvData.scale.scale;
  for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    let textY = Math.floor(axisData.xAxis + i * canvData.scale.scale);
    drawText(Math.floor(axisData.yAxis + 3), textY, -i);
  }
}
function drawNumbersX() {
  let iterationCount =
    (Math.abs(axisData.yAxis) + Math.abs(axisData.centerDifferenceX)) /
    canvData.scale.scale;
  for (let i = 1; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    const textX = Math.floor(axisData.yAxis - i * canvData.scale.scale);
    if (textX < 0 || textX > 1900) continue;
    drawText(textX, axisData.xAxis + 10, -i);
  }
  iterationCount += Math.abs(axisData.centerDifferenceX) / canvData.scale.scale;
  for (let i = 1; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    let textX = Math.floor(axisData.yAxis + i * canvData.scale.scale);
    drawText(textX, axisData.xAxis + 10, i);
  }
}

export function drawAxis() {
  if (axisData.xAxis > 0 && axisData.xAxis < canvData.height) {
    drawAxisLineX(axisData.xAxis, canvData.width);
    drawNumbersX();
  }
  if (axisData.yAxis > 0 && axisData.yAxis < canvData.width) {
    drawAxisLineY(axisData.yAxis, canvData.height);
    drawNumbersY();
  }
}

export function redrawAxis(changedX: number, changedY: number) {
  clearAxisX(axisData.xAxis);
  clearAxisY(axisData.yAxis);
  axisData.xAxis -= changedY;
  axisData.yAxis -= changedX;
  drawAxis();
}
