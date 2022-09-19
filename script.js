const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll('.tool');
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector('#size-slider');
const colorBtns = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');
const clearCanvas = document.querySelector('.clear-canvas');
const saveImg = document.querySelector('.save-img');
const EraserBtn = document.querySelector("#eraser");

const ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot;
let isDraw = false;
let selectedTool = 'brush';
let brushWidth = 5;
let selectedColor = "#000";
let bEraser = false;

// Set to background
const setCanvasBackground = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Style fill background again
    ctx.fillStyle = selectedColor;
};

window.addEventListener('load', () =>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Draw Rectangle
const drawRect = (e) =>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

// Draw Circle
const drawCircle = (e) =>{
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Draw Triangle
const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDrawing = (e) =>{
   isDraw = true;
   bEraser = true;
   prevMouseX = e.offsetX;
   prevMouseY = e.offsetY;
   ctx.beginPath();
   ctx.lineWidth = brushWidth;
   ctx.strokeStyle = selectedColor;
   ctx.fillStyle = selectedColor;
   snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Function to draw
const drawing = (e) =>{
    if(!isDraw) return;
    ctx.putImageData(snapshot, 0, 0);

    // Pencil function
    if(selectedTool === "brush"){
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        bEraser = false;
    // Eraser function
    }else if(selectedTool === "eraser"){
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushWidth;
        ctx.beginPath();
        if(bEraser === true){
            ctx.globalCompositeOperation = "destination-out";
        }else{
            ctx.globalCompositeOperation = "source-over";
        }
        ctx.moveTo(prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    // Draw Rectangle 
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    // Draw Circle
    } else if(selectedTool === "circle"){
        drawCircle(e);
    // Draw Triangle
    }else{
        drawTriangle(e);
    }
};

// Button to select tool to draw
toolBtns.forEach(btn => {
    btn.addEventListener("click", () =>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    })
});

// Button to adjust slider
sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value);

// Button to select color 
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add('selected');
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    })
});

// Button to choose color style
colorPicker.addEventListener("change", () =>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Button clear to clear Canvas
clearCanvas.addEventListener("click", () =>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    setCanvasBackground();
})

// Button to download image
saveImg.addEventListener("click", () =>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

EraserBtn.addEventListener("click", () => bEraser = true);

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {isDraw = false; bEraser = false});