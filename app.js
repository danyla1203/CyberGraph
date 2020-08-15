const drawButton = document.getElementById("drawBtn")
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d")


function parseFunc(func) {
    return (x) => {
        return eval(func.replace("abs(x)", "Math.abs(x)"));
    }
}

function drawAxis() {
    //draw y axis
    const x = canvas.width;
    const y = canvas.height
    ctx.strokeStyle = "black"
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
        canvX: graphX + 250,
        canvY: graphY > 0 ? 250 - graphY : 250 + (graphY * -1)
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxis();
}

drawButton.onclick = () => {
    clearCanvas()

    let formula = document.getElementById("formula").value;
    getYFunc = parseFunc(formula);
    
    let prevPoint = getPrevPoint(-250, getYFunc(-250))
    for (let i = 1; i < 500; i++) {
        let graphX = i - 250;
        let graphY = getYFunc(graphX);

        let canvX = i;

        //if point went out from graph
        if (graphY > 250 || graphY < -250) {
            continue;
        } else {
            let canvY = graphY > 0 ? (250 - graphY) : (250 + (graphY * -1))
            drawLine(canvX, canvY, prevPoint);
            prevPoint = getPrevPoint(graphX, graphY)
        }
    }
    
}   
drawAxis()