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
    //draw y axis
    const x = canvWidth
    const y = canvHeight
    ctx.strokeStyle = "black"
    ctx.lineWidth = "1"
    ctx.beginPath()
    ctx.moveTo(x / 2, 0);
    ctx.lineTo(x / 2, y);
    ctx.stroke();
    //draw x axis
    ctx.beginPath()
    ctx.moveTo(0, y / 2);
    ctx.lineTo(x, y / 2);
    ctx.stroke();
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

function clearYAxis(canvX) {
    ctx.clearRect(canvX - 1, 0, 2, canvHeight / 2 -1);
    ctx.clearRect(canvX -1, canvHeight / 2 - 1, 2, canvHeight)
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
    if (changedX == 0) {
        //if only y

    } else if (changedY == 0) {
        //if only x
        clearYAxis(axisCoords.yAxis);
        if (changedX < 0) {
            let canvX = changedX * -1 / 2
            axisCoords.yAxis += canvX;  

        } else if (changedX > 0) {
            let canvX = changedX / 2;
            axisCoords.yAxis -= canvX;   
        }
        drawAxisY(axisCoords.yAxis);
        drawAxisX(axisCoords.xAxis)
    } else {
        //x and y changed
    }
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
       
        //debugger;
    }
}

canvas.onmouseup = () => {
    canvas.onmousemove = null;
    canvas.style.cursor = "auto"
}