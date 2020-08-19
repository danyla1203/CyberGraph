const drawButton = document.getElementById("drawBtn")
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d")
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const canvHeight = canvas.height;
const canvWidth = canvas.width;
let axisCoords = {
    yAxis: canvWidth / 2,
    xAxis: canvHeight / 2,
    centerDifferenceX: null,
    centerDifferenceY: null
}
axisCoords.centerDifferenceX = canvWidth / 2 - axisCoords.yAxis;
axisCoords.centerDifferenceY = canvHeight / 2 - axisCoords.xAxis;
console.log(axisCoords)

drawAxis();
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(20, 20);
ctx.stroke();

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
        let canvY = changedY;
        axisCoords.xAxis -= canvY
    } else if (changedY < 0) {
        let canvY = changedY * -1;
        axisCoords.xAxis += canvY
    }

    if (changedX < 0) {
        let canvX = changedX * -1;
        axisCoords.yAxis += canvX;  

    } else if (changedX > 0) {
        let canvX = changedX;
        axisCoords.yAxis -= canvX;   
    }

    drawAxisY(axisCoords.yAxis);
    drawAxisX(axisCoords.xAxis)
}

drawButton.onclick = () => {
    clearCanvas()

    let formula = document.getElementById("formula").value;
    getYFunc = parseFunc(formula);
    
    let prevPoint = getPrevPoint(-canvWidth + axisCoords.centerDifferenceX, getYFunc(-canvHeight - axisCoords.centerDifferenceY))
    
    for (let i = 1; i < canvWidth; i++) {
        let graphX = i - canvWidth / 2;
        let graphY = getYFunc(graphX);
       // debugger;
        let canvX = i - axisCoords.centerDifferenceX;
        let canvY = graphY > 0 ? (canvHeight / 2 - graphY) - axisCoords.centerDifferenceY : (canvHeight / 2 + (graphY * -1)) - axisCoords.centerDifferenceY
        drawLine(canvX, canvY, prevPoint);
        prevPoint = getPrevPoint(graphX - axisCoords.centerDifferenceX, graphY + axisCoords.centerDifferenceY)
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
        //calc difference between basic center ( canv width/height / 2 ) and center right now( axis coords )
        axisCoords.centerDifferenceX = canvWidth / 2 - axisCoords.yAxis;
        axisCoords.centerDifferenceY = canvHeight / 2 - axisCoords.xAxis;
    }
}

canvas.onmouseup = () => {
    console.log(axisCoords);
    canvas.onmousemove = null;
    canvas.style.cursor = "auto"
}