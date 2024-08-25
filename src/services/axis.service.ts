import {
  drawText,
  clearAxisX,
  clearAxisY,
  drawAxisLineX,
  drawAxisLineY,
} from '../canvasView';
import { canvData, ctx } from '../canvas';

const axisData = canvData.axis;
const zoomData = canvData.scale;

function drawNumbersX() {
  for (const number in canvData.numberLine) {
    const point = parseFloat(number) * zoomData.factorMult;
    const text = point.toFixed(('' + zoomData.factorMult).length);
    drawText(
      canvData.axis.yAxis -
        canvData.numberLine[number] *
          canvData.scale.viewMulti *
          canvData.scale.allegedUnit,
      axisData.xAxis + 15,
      text
    );
    drawText(
      canvData.axis.yAxis +
        canvData.numberLine[number] *
          canvData.scale.viewMulti *
          canvData.scale.allegedUnit,
      axisData.xAxis + 15,
      text
    );
  }
}
function drawNumbersY() {
  for (const number in canvData.numberLine) {
    if (number === '0') continue;
    const point = parseFloat(number) * zoomData.factorMult;
    const text = point.toFixed(( '' + zoomData.factorMult).length);
    drawText(
      axisData.yAxis - 15,
      axisData.xAxis -
        canvData.numberLine[number] *
          zoomData.viewMulti *
          zoomData.allegedUnit +
        4,
      text,
    );
    drawText(
      axisData.yAxis - 19,
      axisData.xAxis +
        canvData.numberLine[number] *
          zoomData.viewMulti *
          zoomData.allegedUnit +
        4,
      text,
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
