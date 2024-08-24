import {
  drawText,
  clearAxisX,
  clearAxisY,
  drawAxisLineX,
  drawAxisLineY,
} from '../canvasView';
import { canvData } from '../canvas';

const axisData = canvData.axis;

function drawNumbersX() {
  for (const number in canvData.numberLine.xLeft) {
    drawText(
      canvData.axis.yAxis - canvData.numberLine.xLeft[number] *
        canvData.scale.viewMulti *
        canvData.scale.allegedUnit,
      axisData.xAxis + 13,
      parseInt(number),
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
    //drawNumbersY();
  }
}

export function redrawAxis(changedX: number, changedY: number) {
  clearAxisX(axisData.xAxis);
  clearAxisY(axisData.yAxis);
  axisData.xAxis -= changedY;
  axisData.yAxis -= changedX;
  drawAxis();
}
