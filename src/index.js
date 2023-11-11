let container = document.querySelector(".container");
let createGridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

const gridRows = document.querySelectorAll('.gridRow');
const gridCols = document.querySelectorAll('.gridCol');


let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

let grid = [];

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

createGridButton.addEventListener("click", () => {
    createGrid(gridWidth.value, gridHeight.value);
});


clearGridButton.addEventListener("click", () => {
    // container.innerHTML = "";
    gridCols.forEach((col) => {
        col.style.backgroundColor = "white";
        col.innerHTML = '';
        col.removeAttribute('data-cell-state');
    });
});


gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value;
});


gridHeight.addEventListener("input", () => {
    heightValue.innerHTML = gridHeight.value;
});


window.onload = () => {
    gridHeight.value = 0;
    gridWidth.value = 0;
}


// Image Handling
const imageUpload = document.getElementById('image-upload');

let imageWidth, imageHeight;
let rows = [];
let cols = [];

imageUpload.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const image = new Image();
            image.src = './resource/images/casque.jpg';
            image.onload = function () {
                imageWidth = image.naturalWidth;
                imageHeight = image.naturalHeight;

                let blackCount = 0;
                gridRows.forEach((row) => {
                    if (row.style.backgroundColor === "#fff") {
                        rows.push(blackCount);
                        blackCount = 0;
                    }
                    else
                        blackCount += 1;
                });

                blackCount = 0;

                gridCols.forEach((col) => {
                    if (col.style.backgroundColor === "#fff") {
                        cols.push(blackCount);
                        blackCount = 0;
                    }
                    else
                        blackCount += 1;
                });

                createGrid(imageWidth, imageHeight);
            }
        };

        reader.readAsDataURL(file);
    }
});


let createGrid = ((width, height) => {
    container.innerHTML = "";
    grid = [];

    let isPressed = false;
    let lastModifiedCell = null;

    for (let i = 0; i < height; i++) {
        let row = [];

        let divRow = document.createElement("div");
        divRow.classList.add("gridRow");

        for (let j = 0; j < width; j++) {
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute('data-state-cell', 'white');

            col.addEventListener(events[deviceType].down, () => {
                isPressed = true;
                lastModifiedCell = col;
                updateCell(col);
            });

            col.addEventListener(events[deviceType].move, () => {
                if (isPressed && col !== lastModifiedCell) {
                    lastModifiedCell = col;
                    updateCell(col);
                }
            });

            col.addEventListener(events[deviceType].up, () => {
                isPressed = false;
                lastModifiedCell = null;
            });

            row.push(col);
            divRow.appendChild(col);
        }

        grid.push(row);
        container.appendChild(divRow);
    }
});


function updateCell(col) {
    if (col.style.backgroundColor === "white"  && col.getAttribute('data-cell-state') !== 'cross') {
        col.style.backgroundColor = "black";
        col.setAttribute('data-cell-state', 'black');
    }

    else if (col.style.backgroundColor === "black") {

        col.style.backgroundColor = "white";
        col.innerHTML = '<div class="cross"></div>';
        col.setAttribute('data-cell-state', 'cross');
    }

    else {
        col.style.backgroundColor = "white";
        col.innerHTML = '';
        col.setAttribute('data-cell-state', 'white');
    }
}