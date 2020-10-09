const drawButton = document.getElementById("drawBtn");
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const canvHeight = canvas.height;
const canvWidth = canvas.width;

let canvData = {
    axis: {
        yAxis: canvWidth / 2,
        xAxis: canvHeight / 2,
        centerDifferenceX: 0,
        centerDifferenceY: 0
    },
    graphFunc: null,
    scale: 50,
}

let axisCoords = {
    yAxis: canvWidth / 2,
    xAxis: canvHeight / 2,
    centerDifferenceX: 0,
    centerDifferenceY: 0
}

drawAxis();

function parseFunc(func) {
    return (x) => {
        return eval(func.replace("abs(x)", "Math.abs(x)"));
    }
}

function drawAxis() {
    drawAxisX(canvData.axis.xAxis);
    drawAxisY(canvData.axis.yAxis);
}

function drawLine(canvX, canvY, prevPoint) {    
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(prevPoint.canvX, prevPoint.canvY);
    ctx.lineTo(canvX, canvY);
    ctx.stroke();
}

function getPrevPoint(canvX, canvY) {
    return {
        canvX: canvX,
        canvY: canvY
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvWidth, canvHeight);
    drawAxis();
}

function clearAxisY(canvX) {
    ctx.clearRect(canvX - 1, 0, 2, canvHeight / 2 -1);
    ctx.clearRect(canvX -1, canvHeight / 2 - 1, 2, canvHeight);
}
function clearAxisX(canvY) {
    ctx.clearRect(0, canvY - 1, canvWidth / 2 + 1, 2);
    ctx.clearRect(canvWidth / 2 + 1, canvY - 1, canvWidth / 2, 2);
}

function drawAxisY(canvX) {
    ctx.beginPath();
    ctx.moveTo(canvX, 0);
    ctx.lineTo(canvX, canvHeight);
    ctx.stroke();
}
function drawAxisX(canvY) {
    ctx.beginPath();
    ctx.moveTo(0, canvY);
    ctx.lineTo(canvWidth, canvY);
    ctx.stroke();
}

function redrawAxis(changedX, changedY) {
    clearAxisX(canvData.axis.xAxis);
    clearAxisY(canvData.axis.yAxis);

    //update canvData.axis fields by changeX, changeY
    if (changedY > 0) {
        let canvY = changedY;
        canvData.axis.xAxis -= canvY
    } else if (changedY < 0) {
        let canvY = changedY * -1;
        canvData.axis.xAxis += canvY;
    }

    if (changedX < 0) {
        let canvX = changedX * -1;
        canvData.axis.yAxis += canvX;  

    } else if (changedX > 0) {
        let canvX = changedX;
        canvData.axis.yAxis -= canvX;   
    }

    //draw new axis
    drawAxisY(canvData.axis.yAxis);
    drawAxisX(canvData.axis.xAxis);
}

function getCanvYCoordFromGraphY(graphY) {
    if (graphY > 0) {
        return canvHeight / 2 - graphY - canvData.axis.centerDifferenceY
    } else {
        return (canvHeight / 2 + (graphY * -1)) - canvData.axis.centerDifferenceY;
    }
}

function drawGraph(getYFunc, startPoint = 0) {
    if (getYFunc == null) {
        return;
    }
    let canvXOnStart = 0 - canvData.axis.centerDifferenceX;
    let canvYOnStart = getCanvYCoordFromGraphY(getYFunc(0 - canvWidth / 2))
    let prevPoint = getPrevPoint(canvXOnStart, canvYOnStart);
    //render graph from startPoint to canvWidth + startPoint
    for (let i = startPoint; i < canvWidth + startPoint; i++) {
        let graphX = (i - canvWidth / 2) / canvData.scale;
        let graphY = getYFunc(graphX) * canvData.scale;  
        let canvX = i - canvData.axis.centerDifferenceX ;
        let canvY = getCanvYCoordFromGraphY(graphY);
        drawLine(canvX, canvY, prevPoint);
        prevPoint = getPrevPoint(canvX, canvY);
    }
    ctx.strokeStyle = "black";
}

function onMove(event, pointerCoords) {
    const afterMoveCoords = {
        x: event.screenX || event.changedTouches[0].clientX,
        y: event.screenY || event.changedTouches[0].clientY, 
    }
    let changedX = pointerCoords.x - afterMoveCoords.x;
    let changedY = pointerCoords.y - afterMoveCoords.y;

    clearCanvas();
    redrawAxis(changedX, changedY);

    //update pointer coords
    pointerCoords.x = afterMoveCoords.x;
    pointerCoords.y = afterMoveCoords.y;
    //calc difference between basic center ( canv width/height / 2 ) and center right now( axis coords )
    canvData.axis.centerDifferenceX = canvWidth / 2 - canvData.axis.yAxis;
    canvData.axis.centerDifferenceY = canvHeight / 2 - canvData.axis.xAxis;
    drawGraph(canvData.graphFunc, canvData.axis.centerDifferenceX);
}

drawButton.onclick = () => {
    clearCanvas();  
    let formula = document.getElementById("formula").value;
    getYFunc = parseFunc(formula);
    drawGraph(getYFunc);
    canvData.graphFunc = getYFunc;
}

canvas.onwheel = (e) => {
    let newScale = e.wheelDelta / 10;
    
    if(newScale < 0 && (newScale * -1) > canvData.scale) {
        canvData.scale = canvData.scale / (newScale * -1);
    } else {
        canvData.scale += newScale;
    }

    clearCanvas();
    drawGraph(canvData.graphFunc);
}

canvas.onmousedown = (e) => {
    //cords, where mouse button is downed
    const pointerCoords = {
        x: e.screenX,
        y: e.screenY
    }
    canvas.style.cursor = "move"
    canvas.onmousemove = (e) => {
        onMove(e, pointerCoords);
    }
}

canvas.ontouchstart = (e) => {
    //cords, where mouse button is downed
    const pointerCoords = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
    }
    
    canvas.ontouchmove = (e) => {
        onMove(e, pointerCoords);
    }
}
canvas.ontouchend = () => {
    canvas.ontouchmove = null;
}

canvas.onmouseup = () => {
    canvas.onmousemove = null;
    canvas.style.cursor = "auto";
}