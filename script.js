const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll('.tool');
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector('#size-slider');
const colorBtns = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');
const clearCanvas = document.querySelector('.clear-canvas');
const saveImg = document.querySelector('.save-img');

const ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot;
let isDraw = false;
let selectedTool = 'brush';
let brushWidth = 5;
let selectedColor = "#000";

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

const drawRect = (e) =>{
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}