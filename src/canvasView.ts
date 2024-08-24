import { canvData } from './canvas';

const canvas = document.querySelector<HTMLCanvasElement>(
  '#graph',
) as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

ctx.font = '13px serif';

export function drawText(
  canvX: any,
  canvY: any,
  text: number,
) {
  ctx.fillText(text + '', canvX, canvY);
}

export function drawLine() {
  ctx.stroke();
}

export function setBegin(prevPoint: any) {
  ctx.beginPath();
  ctx.moveTo(prevPoint.canvX, prevPoint.canvY);
}

export function setPoint(canvX: number, canvY: number) {
  ctx.lineTo(canvX, canvY);
}

export function clearAxisY(canvX: number) {
  ctx.clearRect(canvX - 1, 0, 50, canvData.height / 2 - 1);
  ctx.clearRect(canvX - 1, canvData.height / 2 - 1, 50, canvData.height);
}

export function clearAxisX(canvY: number) {
  ctx.clearRect(0, canvY - 1, canvData.width / 2 + 1, 50);
  ctx.clearRect(canvData.width / 2 + 1, canvY - 1, canvData.width / 2, 50);
}
export function drawAxisLineX(canvY: number, canvwidth: number) {
  ctx.beginPath();
  ctx.moveTo(0, canvY);
  ctx.lineTo(canvwidth, canvY);
  ctx.stroke();
}
export function drawAxisLineY(canvX: number, canvHeight: number) {
  ctx.beginPath();
  ctx.moveTo(canvX, 0);
  ctx.lineTo(canvX, canvHeight);
  ctx.stroke();
}

export function clearCanvas() {
  ctx.clearRect(0, 0, canvData.width, canvData.height);
}
