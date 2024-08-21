import {
  drawText,
  clearAxisX,
  clearAxisY,
  drawAxisLineX,
  drawAxisLineY,
} from '../canvasView';
import { canvData } from '../canvas';

const canvWidth = window.innerWidth;
const canvHeight = window.innerHeight;

let axisData = {
  yAxis: canvWidth / 2,
  xAxis: canvHeight / 2,
  centerDifferenceX: 0,
  centerDifferenceY: 0,
};


function makeAxisY(canvX: number) {
  drawAxisLineY(canvX, canvHeight);
  let iterationCount =
    (Math.abs(axisData.xAxis) + Math.abs(axisData.centerDifferenceY)) /
    canvData.scale.scale;
  if (axisData.xAxis > 0) {
    for (
      let i = 0;
      i <= iterationCount;
      i += canvData.scale.scaleIterationStep
    ) {
      let text = i.toFixed(4);
      let textY = Math.floor(axisData.xAxis - i * canvData.scale.scale);
      if (textY < 0 || textY > 1100) {
        continue;
      }
      drawText(Math.floor(axisData.yAxis + 3), textY, text);
    }
  }
  if (axisData.xAxis > 1000) {
    return;
  }
  iterationCount += Math.abs(axisData.centerDifferenceY) / canvData.scale.scale;
  for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    let text = i.toFixed(6);
    let textY = Math.floor(axisData.xAxis + i * canvData.scale.scale);
    if (textY < 0 || textY > 1100) {
      continue;
    }
    drawText(Math.floor(axisData.yAxis + 3), textY, `-${text}`);
  }
}
function makeAxisX(canvY: number) {
  drawAxisLineX(canvY, canvWidth);
  let iterationCount =
    (Math.abs(axisData.yAxis) + Math.abs(axisData.centerDifferenceX)) /
    canvData.scale.scale;
  for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    if (i == 0) continue;
    const text = i.toFixed(6);
    const textX = Math.floor(axisData.yAxis - i * canvData.scale.scale);
    if (textX < 0 || textX > 1900) continue;
    drawText(textX , axisData.xAxis + 10, `-${text}`);
  }
  if (canvData.axis.yAxis > 0) return;
  iterationCount += Math.abs(axisData.centerDifferenceX) / canvData.scale.scale;
  for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
    if (i == 0) continue;
    let text = i.toFixed(6);
    let textX = Math.floor(axisData.yAxis + i * canvData.scale.scale);
    if (textX > 1900) continue;
    drawText(textX, axisData.xAxis + 10, text);
  }
}

export function drawAxis() {
  makeAxisX(axisData.xAxis);
  makeAxisX(axisData.yAxis);
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
