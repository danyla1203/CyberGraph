const drawButton = document.getElementById("drawBtn")
const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d")

const center = {
    x: 249,
    y: 249  
}

function parseFunc(func) {
    return func.replace("abs(x)", "Math.abs(x)");
}

function drawAxis() {
    //draw y axis
    const x = canvas.width;
    const y = canvas.height
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

function drawPoint(x, y) {
    ctx.fillRect((center.x + x), (center.y - y), 2, 2);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxis();
}

drawButton.onclick = () => {
    clearCanvas()
    let formula = document.getElementById("formula").value;
    formula = parseFunc(formula);
    for (let x = -100; x < 100; x++) {
        let y = eval(formula);
        drawPoint(x, y)
    }
    
}
drawAxis()