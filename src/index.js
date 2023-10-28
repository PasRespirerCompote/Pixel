let container = document.querySelector(".container");
let createGridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorInput = document.getElementById("color-input");
let eraseButton = document.getElementById("erase-btn");
let paintButton = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");
let number = document.querySelectorAll(".number");

const gridRows = document.querySelectorAll('.gridRow');
const gridCols = document.querySelectorAll('.gridCol');


// const predefinedColors = [
//     "#000000",
//     "#FFFFFF",
//     "#FF5733",
//     "#FF9966",
//     "#FFC3A0",
//     "#FFECB3",
//     "#F4D03F",
//     "#FDEBD0",
//     "#FFDB58",
//     "#FFC300",
//     "#FFD700",
//     "#FFD800",
//     "#FFEA4C",
//     "#FFEF96",
//     "#FFFE7A",
//     "#FCF3CF",
//     "#F7DC6F",
//     "#F1C40F",
//     "#FFA07A",
//     "#FF6F61",
//     "#FF5733",
//     "#E74C3C",
//     "#FF4500",
//     "#FF6E40",
//     "#FF6037",
//     "#FFAA1D",
//     "#FFA500",
//     "#FF8C00",
//     "#FF7F50",
//     "#FF7256",
//     "#FF6347",
//     "#FF6B6B",
//     "#FF4500",
//     "#20B2AA",
//     "#48D1CC",
//     "#00CED1",
//     "#1E90FF",
//     "#87CEEB",
//     "#6495ED",
//     "#4169E1",
//     "#0000FF",
//     "#0000CD",
//     "#00008B",
//     "#000080",
//     "#8A2BE2",
//     "#4B0082",
//     "#9932CC",
//     "#8B008B",
//     "#800080",
//     "#8B4513",
//     "#A0522D",
//     "#D2691E",
//     "#CD853F",
//     "#FFD700",
//     "#FFA500",
//     "#FF8C00",
//     "#FF7F50",
//     "#FF6347",
//     "#FF4500",
//     "#DC143C",
//     "#FF69B4",
//     "#FF1493",
//     "#C71585",
//     "#DB7093",
//     "#FFB6C1",
//     "#FFC0CB",
//     "#FF69B4",
//     "#FF1493",
//     "#C71585",
//     "#DB7093",
//     "#FFB6C1",
//     "#FFC0CB",
//     "#3CB371",
//     "#2E8B57",
//     "#228B22",
//     "#008000",
//     "#006400",
//     "#32CD32",
//     "#90EE90",
//     "#00FF7F",
//     "#00FF00",
//     "#ADFF2F",
//     "#7FFF00",
//     "#7CFC00",
//     "#00FA9A",
//     "#00FF7F",
//     "#00FF00",
//     "#ADFF2F",
//     "#7FFF00",
//     "#7CFC00",
//     "#00FA9A",
//     "#6B8E23",
//     "#808000",
//     "#556B2F",
//     "#2E8B57",
//     "#228B22",
//     "#008000",
//     "#006400",
//     "#32CD32",
//     "#90EE90",
//     "#00FF7F",
//     "#00FF00",
//     "#ADFF2F",
//     "#7FFF00",
//     "#7CFC00",
//     "#00FA9A",
// ];

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

let draw = false;
let erase = false;

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
        col.style.backgroundColor = "transparent";
    });
});


eraseButton.addEventListener("click", () => {
    erase = true;
});


paintButton.addEventListener("click", () => {
    erase = false;
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

    for (let i = 0; i < height; i++) {
        let row = [];

        let divRow = document.createElement("div");
        divRow.classList.add("gridRow");

        for (let j = 0; j < width; j++) {
            let col = document.createElement("div");
            col.classList.add("gridCol");

            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorInput.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                );

                if (elementId && elementId.classList.contains("gridCol")) {
                    if (draw && !erase)
                        elementId.style.backgroundColor = colorInput.value;
                    else if (draw && erase)
                        elementId.style.backgroundColor = "transparent";
                }

                // elementId.textContent = "6"
                // number.forEach((n) => {
                //     n.style.display = "block";
                // });

            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            row.push(col);
            divRow.appendChild(col);
        }

        grid.push(row);
        container.appendChild(divRow);
    }
});