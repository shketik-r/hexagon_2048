import {moveDown, moveLeftDown, moveLeftTop, moveRightDown, moveRightTop, moveTop} from "./move";

let point = document.getElementById('point');
let app = document.getElementById('app');
let level = document.getElementById('level');

let SIZE = 2
let sizeCell = 50
let sizeGrid = (SIZE * 2 - 1) * sizeCell
let url

const getArrayCells = () => {
    let arrayCells = []
    for (let x = -(SIZE - 1); x < SIZE; x++) {
        for (let y = -(SIZE - 1); y < SIZE; y++) {
            for (let z = -(SIZE - 1); z < SIZE; z++) {
                if (x + y + z === 0) {
                    arrayCells.push({x: x, y: y, z: z, value: 0})
                }
            }
        }
    }
    return arrayCells
}

const getBlankMatrix = (size) => {
    let array = new Array(2 * size - 1);
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(2 * size - 1);
    }
    for (let i = 0; i < 2 * size - 1; i++) {
        for (let j = 0; j < 2 * size - 1; j++) {
            if ((i + j > size - 2) && ((i + j) < 3 * size - 2)) {
                array[i][j] = 0;
            } else {
                array[i][j] = null;
            }
        }
    }
    return array;
}
let completedMatrix = getBlankMatrix(SIZE)

const updateArray = (data) => {
    data.forEach((el) => {
        completedMatrix[el.z + (SIZE - 1)][el.x + (SIZE - 1)] = el.value;
    });
    getCounter(completedMatrix)
}

const updateData = () => {
    let updateArrayData = []
    for (let i = 0; i < 2 * SIZE - 1; i++) {
        for (let j = 0; j < 2 * SIZE - 1; j++) {
            if (completedMatrix[i][j] > 0 && completedMatrix[i][j] !== null) {
                let updateGrid = {
                    x: j - (SIZE - 1),
                    y: 0 - ((j - (SIZE - 1)) + (i - (SIZE - 1))),
                    z: i - (SIZE - 1),
                    value: completedMatrix[i][j]
                }
                updateArrayData.push(updateGrid)
            }
        }
    }
    return updateArrayData

}

const getGrid = (data) => {
    let arrayCells = getArrayCells()
    app.innerHTML = null
    arrayCells.map(el => {
        let div = document.createElement('div')
        let img = document.createElement('img')
        let posX = (40 * el.x) + sizeCell * (SIZE - 1)
        let y = el.z - el.y
        let posY = ((sizeGrid + 50) / 2 + ((sizeCell - 29) * y)) - 50
        let filteredArray = data.filter(f => f.x === el.x && f.y === el.y && f.z === el.z)
        let styleCell = `left:${posX}px; top:${posY}px;`;
        let styleHexagon = `width:${sizeGrid}px; height:${sizeGrid}px`
        div.setAttribute("style", styleCell)
        div.setAttribute("data-x", el.x)
        div.setAttribute("data-y", el.y)
        div.setAttribute("data-z", el.z)
        div.setAttribute("data-value", filteredArray.length !== 0 ? filteredArray[0].value : 0)
        div.classList.add('cell');
        div.textContent = filteredArray.length !== 0 ? filteredArray[0].value : ''
        img.setAttribute('src', './free-icon-hexagon-462061.png')
        div.append(img)
        app.setAttribute("style", styleHexagon)
        app.append(div)
    })
}

document.addEventListener("keydown", e => key(e.keyCode))

const key = async (e) => {
    let check = true
    switch (e) {
        case 87:
            check = await moveTop(completedMatrix, SIZE);
            break
        case 83:
            check = await moveDown(completedMatrix, SIZE);
            break
        case 81:
            check = await moveLeftTop(completedMatrix, SIZE);
            break
        case 69:
            check = await moveRightTop(completedMatrix, SIZE);
            break
        case 65:
            check = await moveLeftDown(completedMatrix, SIZE);
            break
        case 68:
            check = await moveRightDown(completedMatrix, SIZE);
            break
        default:
            return;
    }
    if (check) {
        await server(url, SIZE)
    }
    if (gameOver()) {
        let status = document.getElementById('status')
        status.setAttribute("data-status", "game-over");
        status.innerHTML = "game-over";
        status.classList.remove("status_green")
        status.classList.add("status_red")
    }
}

const gameOver = () => {
    for (let i = 0; i < completedMatrix.length; i++) {
        for (let j = 0; j < completedMatrix.length; j++) {
            if (completedMatrix[i][j] !== null) {
                if (completedMatrix[i][j] === 0) {
                    return false;
                }
            }
        }
    }
    for (let i = 0; i < completedMatrix.length - 1; i++) {
        for (let j = 0; j < completedMatrix.length - 1; j++) {
            if (completedMatrix[i][j] !== null) {
                let number = completedMatrix[i][j]
                if (completedMatrix[i][j] !== 0 && (completedMatrix[i + 1][j] === number || completedMatrix[i][j + 1] === number)) {
                    return false
                }
            }
        }
    }
    for (let i = 1; i < completedMatrix.length; i++) {
        for (let j = 0; j < completedMatrix.length - 1; j++) {
            if (completedMatrix[i][j] !== null) {
                let number = completedMatrix[i][j]
                if (completedMatrix[i][j] !== 0 && completedMatrix[i - 1][j + 1] === number) {
                    return false
                }
            }
        }
    }
    return true;
}

const selectLevel = async (event) => {
    SIZE = Number(event.target.getAttribute("data-level"))
    sizeGrid = (SIZE * 2 - 1) * sizeCell
    completedMatrix = getBlankMatrix(SIZE)
    await startGame(url, SIZE)
    return SIZE
}
level.addEventListener("click", selectLevel)

const getCounter = (completedMatrix) => {
    let sum = 0
    for (let i = 0; i < completedMatrix.length; i++) {
        for (let j = 0; j < completedMatrix.length; j++) {
            if (completedMatrix[i][j] !== null) {
                sum = completedMatrix[i][j] + sum
            }

        }
    }
    point.textContent = "points: " + sum
}

let selectUrl = document.getElementById('urlServer');
selectUrl.addEventListener("change", geturl)

async function geturl() {
    url = selectUrl.value;
    completedMatrix = getBlankMatrix(SIZE)
    await startGame(url, SIZE)
    return url
}

async function server(url, size) {
    let data = updateData()
    console.log('data', data)
    let promise = await fetch(`${url}${size}`, {
        method: "POST",
        body: JSON.stringify(data),
        referrerPolicy: "unsafe-url",
        credentials: "omit",
        mode: "cors",
        headers: {"Content-Type": "application/json"}
    })
    let result = await promise.json()
    console.log('result', result)
    let update = data.concat(result)
    console.log('update', update)
    updateArray(result)
    getGrid(update)
    console.log('completedMatrix', completedMatrix)
}

url = selectUrl.selectedOptions[0].getAttribute("value");
startGame(url, SIZE)

async function startGame(url, size) {

     let data = updateData()
    let promise = await fetch(`${url}${size}`, {
        method: "POST",
        body: JSON.stringify(data),
        referrerPolicy: "unsafe-url",
        credentials: "omit",
        mode: "cors",
        headers: {"Content-Type": "application/json"}
    })
    let result = await promise.json()
    let update = data.concat(result)
    updateArray(result)
    getGrid(update)
}


