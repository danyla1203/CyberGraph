const drawButton = document.getElementById("drawBtn")
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d")

const canvHeight = canvas.height;
const canvWidth = canvas.width;

let axisCoords = {
    yAxis: canvWidth / 2,
    xAxis: canvHeight / 2
}

drawAxis();

function parseFunc(func) {
    return (x) => {
        return eval(func.replace("abs(x)", "Math.abs(x)"));
    }
}

function drawAxis() {
    drawAxisX(axisCoords.xAxis);
    drawAxisY(axisCoords.yAxis);
}

function drawLine(canvX, canvY, prevPoint) {    
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(prevPoint.canvX, prevPoint.canvY);
    ctx.lineTo(canvX, canvY);
    ctx.stroke();
}

function getPrevPoint(graphX, graphY) {
    return {
        canvX: graphX + canvWidth / 2,
        canvY: graphY > 0 ? canvHeight / 2 - graphY : canvHeight / 2 + (graphY * -1)
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvWidth, canvHeight);
    drawAxis();
}

function clearAxisY(canvX) {
    ctx.clearRect(canvX - 1, 0, 2, canvHeight / 2 -1);
    ctx.clearRect(canvX -1, canvHeight / 2 - 1, 2, canvHeight)
}
function clearAxisX(canvY) {
    ctx.clearRect(0, canvY - 1, canvWidth / 2 + 1, 2);
    ctx.clearRect(canvWidth / 2 + 1, canvY - 1, canvWidth / 2, 2);;
}

function drawAxisY(canvX) {
    ctx.beginPath();
    ctx.moveTo(canvX, 0);
    ctx.lineTo(canvX, canvHeight);
    ctx.stroke();
}
function drawAxisX(canvY) {
    ctx.beginPath();
    ctx.moveTo(0, canvY)
    ctx.lineTo(canvWidth, canvY);
    ctx.stroke();
}

function redrawAxis(changedX, changedY, axisCoords) {
    clearAxisX(axisCoords.xAxis)
    clearAxisY(axisCoords.yAxis);

    if (changedY > 0) {
        let canvY = changedY / 4;
        axisCoords.xAxis -= canvY
    } else if (changedY < 0) {
        let canvY = changedY * -1 / 4;
        axisCoords.xAxis += canvY
    }

    if (changedX < 0) {
        let canvX = changedX * -1 / 4
        axisCoords.yAxis += canvX;  

    } else if (changedX > 0) {
        let canvX = changedX / 4;
        axisCoords.yAxis -= canvX;   
    }

    drawAxisY(axisCoords.yAxis);
    drawAxisX(axisCoords.xAxis)
}

drawButton.onclick = () => {
    clearCanvas()

    let formula = document.getElementById("formula").value;
    getYFunc = parseFunc(formula);
    
    let prevPoint = getPrevPoint(-canvWidth, getYFunc(-canvHeight))
    for (let i = 1; i < canvWidth; i++) {
        let graphX = i - canvWidth / 2;
        let graphY = getYFunc(graphX);

        let canvX = i;
        let canvY = graphY > 0 ? (canvHeight / 2 - graphY) : (canvHeight / 2 + (graphY * -1))
        drawLine(canvX, canvY, prevPoint);
        prevPoint = getPrevPoint(graphX, graphY)
    }
    ctx.strokeStyle = "black";
    
}

canvas.onmousedown = (e) => {
    //cords, where mouse button is downed
    const pointerCoords = {
        x: e.screenX,
        y: e.screenY
    }
    canvas.style.cursor = "move"
    canvas.onmousemove = (e) => {
        const afterMoveCoords = { x: e.screenX, y: e.screenY }
        let changedX = pointerCoords.x - afterMoveCoords.x;
        let changedY = pointerCoords.y - afterMoveCoords.y;

        redrawAxis(changedX, changedY, axisCoords);
        pointerCoords.x = afterMoveCoords.x;
        pointerCoords.y = afterMoveCoords.y;
    }
}

canvas.onmouseup = () => {
    canvas.onmousemove = null;
    canvas.style.cursor = "auto"
}