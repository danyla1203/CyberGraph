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
    scale: {
        scale: 50,
        upperLimit: 150,
        lowerLimit: 0,
        scaleIterationStep: 1,
    },
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

function drawText(canvX, canvY, text) {
    ctx.strokeText(text, canvX, canvY);
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
    ctx.clearRect(canvX - 1, 0, 50, canvHeight / 2 -1);
    ctx.clearRect(canvX -1, canvHeight / 2 - 1, 50, canvHeight);
}
function clearAxisX(canvY) {
    ctx.clearRect(0, canvY - 1, canvWidth / 2 + 1, 50);
    ctx.clearRect(canvWidth / 2 + 1, canvY - 1, canvWidth / 2, 50);
}

function drawAxisY(canvX) {
    ctx.beginPath();
    ctx.moveTo(canvX, 0);
    ctx.lineTo(canvX, canvHeight);
    ctx.stroke();

    ctx.font = "10px serif";
    let iterationCount = (Math.abs(canvData.axis.xAxis) + Math.abs(canvData.axis.centerDifferenceY)) / canvData.scale.scale;
    for (let i = 0 + canvData.scale.scaleIterationStep; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
        let halfNumLen = Math.ceil((("" + i).length / 2) + 1);
        let text = ("" + i).substring(0, halfNumLen);
        debugger;
        drawText(canvData.axis.yAxis + 3, canvData.axis.xAxis - i * canvData.scale.scale, text);
    }
    for (let i = 0 + canvData.scale.scaleIterationStep; i <= iterationCount + Math.abs(canvData.axis.centerDifferenceY); i += canvData.scale.scaleIterationStep) {
        let halfNumLen = Math.ceil((("" + i).length / 2) + 1);
        let text = ("" + i).substring(0, halfNumLen);
        drawText(canvData.axis.yAxis + 3, canvData.axis.xAxis + i * canvData.scale.scale, text * -1)
    }
}
function drawAxisX(canvY) {
    ctx.beginPath();
    ctx.moveTo(0, canvY);
    ctx.lineTo(canvWidth, canvY);
    ctx.stroke();

    ctx.font = "10px serif";
    let iterationCount = (Math.abs(canvData.axis.yAxis) + Math.abs(canvData.axis.centerDifferenceX)) / canvData.scale.scale;
    for (let i = 0; i <= iterationCount; i += canvData.scale.scaleIterationStep) {
        let halfNumLen = Math.ceil((("" + i).length / 2) + 1);
        let text = ("" + i).substring(0, halfNumLen);
        drawText(canvData.axis.yAxis - i * canvData.scale.scale, canvData.axis.xAxis + 10, i * -1);
    }
    for (let i = 0 + canvData.scale.scaleIterationStep; i <= iterationCount + Math.abs(canvData.axis.centerDifferenceX); i += canvData.scale.scaleIterationStep) {
        let halfNumLen = Math.ceil((("" + i).length / 2) + 1);
        let text = ("" + i).substring(0, halfNumLen);
        drawText(canvData.axis.yAxis + i * canvData.scale.scale, canvData.axis.xAxis + 10, i);
    }
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
    let canvXOnStart = 0
    let canvYOnStart = getCanvYCoordFromGraphY(getYFunc(0 - canvWidth / 2))
    let prevPoint = getPrevPoint(canvXOnStart, canvYOnStart);
    //render graph from startPoint to canvWidth + startPoint
    for (let i = startPoint; i < canvWidth + startPoint; i += 2) {
        let graphX = (i - canvWidth / 2) / canvData.scale.scale;
        let graphY = getYFunc(graphX) * canvData.scale.scale;  
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
    drawGraph(getYFunc, canvData.axis.centerDifferenceX);
    canvData.graphFunc = getYFunc;
}

canvas.onwheel = (e) => {
    let newScale = e.wheelDelta / 10;

    if(newScale < 0 && (newScale * -1) > canvData.scale.scale) {
        canvData.scale.scale = canvData.scale.scale / (newScale * -1);
    } else {
        canvData.scale.scale += newScale;
    }
    canvData.scale.scale = parseInt(canvData.scale.scale);
    console.log(canvData.scale);

    if(canvData.scale.scale > canvData.scale.upperLimit) {
        canvData.scale.scaleIterationStep = canvData.scale.scaleIterationStep / 2;
        canvData.scale.upperLimit += 150 + canvData.scale.lowerLimit;
        canvData.scale.lowerLimit += 150;
    }
    if (canvData.scale.scale < canvData.scale.lowerLimit) {
        canvData.scale.scaleIterationStep = canvData.scale.scaleIterationStep * 2;
        canvData.scale.upperLimit -= 150
        canvData.scale.lowerLimit -= 150
    }

    clearCanvas();
    drawGraph(canvData.graphFunc, canvData.axis.centerDifferenceX);
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