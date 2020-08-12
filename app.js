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
    ctx.beginPath()
    ctx.moveTo(250, 0);
    ctx.lineTo(250, 500);
    ctx.stroke();
    //draw x axis
    ctx.beginPath()
    ctx.moveTo(0, 250);
    ctx.lineTo(500, 250);
    ctx.stroke();
}

function drawPoint(x, y) {
    ctx.fillRect((center.x + x), (center.y - y), 2, 2);
}

drawButton.onclick = () => {
    let formula = document.getElementById("formula").value;
    formula = parseFunc(formula);
    for (let x = -100; x < 100; x++) {
        let y = eval(formula);
        drawPoint(x, y)
    }
    console.log(formula);
}
drawAxis()