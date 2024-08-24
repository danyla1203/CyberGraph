import { drawGraphBtn } from './inputComponents';
import { buttonClick, onMove, onWheel } from './user-input.process';
import { canvas } from './canvas';
import { drawAxis } from './services/axis.service';
import '../assets/style.css';

drawAxis();

drawGraphBtn.addEventListener('click', buttonClick);

canvas.onwheel = (e: any) => onWheel(e);

canvas.onmousedown = (e) => {
  const pointerCoords = {
    x: e.screenX,
    y: e.screenY,
  };
  canvas.style.cursor = 'move';
  canvas.onmousemove = (e: any) => {
    onMove(e, pointerCoords);
  };
};

canvas.ontouchstart = (e) => {
  const pointerCoords = {
    x: e.changedTouches[0].clientX,
    y: e.changedTouches[0].clientY,
  };

  canvas.ontouchmove = (e: any) => {
    onMove(e, pointerCoords);
  };
};
canvas.ontouchend = () => {
  canvas.ontouchmove = null;
};

canvas.onmouseup = () => {
  canvas.onmousemove = null;
  canvas.style.cursor = 'auto';
};
