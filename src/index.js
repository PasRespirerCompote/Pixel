let container = document.querySelector(".container");
let createGridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");

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

let headers = [];
let grid = [];
let solution = [];

let isPressed = false;
let lastModifiedCell = null;

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
            image.src = './resource/images/carotte.jpg';
            image.onload = function () {
                imageWidth = image.naturalWidth;
                imageHeight = image.naturalHeight;

                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                let imageData = ctx.getImageData(0, 0, imageWidth, imageHeight).data;

                createHeadersAndSolution(imageData);
                createGrid();
            }
        };

        reader.readAsDataURL(file);
    }
});


let createHeadersAndSolution = (imageData) => {
    solution = Array.from({ length: imageHeight }, () => Array(imageWidth));

    headers = [];

    // Create solution
    for (let i = 0; i < imageData.length; i += 4) {
        let isBlack = imageData[i] < 100;

        let x = (i / 4) % imageWidth;
        let y = Math.floor(i / (4 * imageWidth));

        solution[y][x] = (isBlack) ? 1: 0;
    }

    // solution = cleanArray(solution);

    // LeftHeader
    let leftHeader = solution.map(row => {
        let headerRow = [];
        let blackCount = 0;

        row.forEach(cell => {
            if (cell === 0) {
                if (blackCount !== 0) {
                    headerRow.push(blackCount);
                    blackCount = 0;
                }
            }

            else if (cell === 1)
                blackCount++;
        });

        if (blackCount !== 0)
            headerRow.push(blackCount);

        return headerRow;
    });


    // UpHeader
    let reversedSolution = reverseArray(solution);
    let upHeader = reversedSolution.map(row => {
        let headerRow = [];
        let blackCount = 0;

        row.forEach(cell => {
            if (cell === 0) {
                if (blackCount !== 0) {
                    headerRow.push(blackCount);
                    blackCount = 0;
                }
            }

            else if (cell === 1)
                blackCount++;
        });

        if (blackCount !== 0)
            headerRow.push(blackCount);

        return headerRow;
    });


    headers.push(leftHeader);
    headers.push(upHeader);
};


let createGrid = () => {
    container.innerHTML = "";
    grid = [];

    // Grid
    for (let i = 0; i < imageHeight; i++) {
        let row = [];

        let divRow = document.createElement("div");
        divRow.classList.add("gridRow");

        for (let j = 0; j < imageWidth; j++) {
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute('data-state-cell', 'white');

            col.addEventListener(events[deviceType].down, () => {
                isPressed = true;
                updateCell(col);
            });

            col.addEventListener(events[deviceType].move, () => {
                if (isPressed && col !== lastModifiedCell) {
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

    displayHeaders();
};


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

    lastModifiedCell = col;
}


function displayHeaders() {
    // Up Headers
    let upHeaderContainer = document.getElementById("up-header-container");
    upHeaderContainer.innerHTML = '';

    headers[1].forEach((row, index) => {
        let headerRow = document.createElement("div");
        headerRow.classList.add('headerRow');

        row.forEach(value => {
            let headerCell = document.createElement("div");
            headerCell.classList.add("headerCell", "upHeaderCell");
            headerCell.textContent = value;
            headerRow.appendChild(headerCell);
        });

        upHeaderContainer.appendChild(headerRow);
    });


    // Left Headers
    let leftHeaderContainer = document.getElementById('left-header-container');
    headers[0].forEach((column, index) => {
        let headerCell = document.createElement("div");
        headerCell.classList.add("headerCell", "leftHeaderCell");
        headerCell.textContent = column.join('\n');
        leftHeaderContainer.appendChild(headerCell);
    });
}

function cleanArray(array) {
    let res = [];

    for (let i = 0; i < array.length; i++) {
        let headerRow = [];
        for (let j = 0; j < array[0].length; j++) {
            if (array[i][j] !== undefined)
                headerRow.push(array[i][j]);
        }

        res.push(headerRow);
    }

    return res;
}

function reverseArray(array) {
    let res = [];

    for (let i = 0; i < array[0].length; i++) {
        let headerRow = [];
        for (let j = 0; j < array.length; j++) {
            // if (array[j][i] !== undefined)
            headerRow.push(array[j][i]);
        }

        res.push(headerRow);
    }

    return res;
}