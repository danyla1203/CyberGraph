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

function drawGraph(getYFunc) {
    if (getYFunc == null) {
        return;
    }
    //TODO: get correct prevPoint at start
    let prevPoint = getPrevPoint(-canvData.axis.centerDifferenceX, getYFunc(-canvWidth / 2));
    
    for (let i = 1; i < canvWidth; i++) {
        debugger
        let graphX = i - canvWidth / 2;
        let graphY = getYFunc(graphX);
        let canvX = i - canvData.axis.centerDifferenceX;
        let canvY = graphY > 0 ? (canvHeight / 2 - graphY) - canvData.axis.centerDifferenceY : (canvHeight / 2 + (graphY * -1)) - canvData.axis.centerDifferenceY;
        drawLine(canvX, canvY, prevPoint);
        prevPoint = getPrevPoint(canvX, canvY);
    }
    ctx.strokeStyle = "black";
}

drawButton.onclick = () => {
    clearCanvas();

    let formula = document.getElementById("formula").value;
    getYFunc = parseFunc(formula);
    drawGraph(getYFunc);
    canvData.graphFunc = getYFunc;
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
        
        clearCanvas();
        redrawAxis(changedX, changedY);
        drawGraph(canvData.graphFunc);
        //update pointer coords
        pointerCoords.x = afterMoveCoords.x;
        pointerCoords.y = afterMoveCoords.y;
        //calc difference between basic center ( canv width/height / 2 ) and center right now( axis coords )
        canvData.axis.centerDifferenceX = canvWidth / 2 - canvData.axis.yAxis;
        canvData.axis.centerDifferenceY = canvHeight / 2 - canvData.axis.xAxis;
    }
}

canvas.onmouseup = () => {
    console.log(canvData.axis);
    canvas.onmousemove = null;
    canvas.style.cursor = "auto";
}