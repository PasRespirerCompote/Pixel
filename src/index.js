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

// const colorSwatchesContainer = document.querySelector(".color-swatches");

// let selectedColor = null;

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


// predefinedColors.forEach((color) => {
//     const colorSwatch = document.createElement("div");
//     colorSwatch.classList.add("color-swatch");
//     colorSwatch.style.backgroundColor = color;
//     colorSwatch.addEventListener("click", () => {
//        colorInput.value = color;
//     });
//
//     colorSwatchesContainer.appendChild(colorSwatch);
// });


// let updateSelectedColor = () => {
//     selectedColor = colorInput.value;
//     if (selectedColor) {
//         colorSwatchesContainer.querySelectorAll(".color-swatch").forEach((swatch) => {
//             swatch.classList.remove("selected");
//             if (swatch.style.backgroundColor === selectedColor)
//                 swatch.classList.add("selected");
//         });
//     }
// }
//
// colorInput.addEventListener("input", updateSelectedColor);

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
    container.innerHTML = "";
    // let count = 0;

    for (let i = 0; i < gridHeight.value; i++) {
        // count += 2;
        let divRow = document.createElement("div");
        divRow.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            // count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            // col.setAttribute("id", `gridCol${count}`);

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

            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            divRow.appendChild(col);
        }
        
        container.appendChild(divRow);
    }
});


clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
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