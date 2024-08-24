import {
  drawText,
  clearAxisX,
  clearAxisY,
  drawAxisLineX,
  drawAxisLineY,
} from '../canvasView';
import { canvData, ctx } from '../canvas';

const axisData = canvData.axis;

function drawNumbersX() {
  for (const number in canvData.numberLine) {
    drawText(
      canvData.axis.yAxis -
        canvData.numberLine[number] *
          canvData.scale.viewMulti *
          canvData.scale.allegedUnit,
      axisData.xAxis + 15,
      -parseInt(number),
    );
    drawText(
      canvData.axis.yAxis +
        canvData.numberLine[number] *
          canvData.scale.viewMulti *
          canvData.scale.allegedUnit,
      axisData.xAxis + 15,
      parseInt(number),
    );
  }
}
function drawNumbersY() {
  for (const number in canvData.numberLine) {
    if (parseInt(number) === 0) continue;
    drawText(
      axisData.yAxis - 15,
      canvData.axis.xAxis -
        canvData.numberLine[number] *
          canvData.scale.viewMulti *
          canvData.scale.allegedUnit + 4,
      parseInt(number),
    );
    drawText(
      axisData.yAxis - 19,
      canvData.axis.xAxis +
        canvData.numberLine[number] *
          canvData.scale.viewMulti *
          canvData.scale.allegedUnit + 4,
      -parseInt(number),
    );
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
