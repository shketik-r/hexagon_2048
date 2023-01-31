const transposel = (arr, size) => {
    for (let i = 0; i < 2 * size - 1; i++) {
        for (let j = 0; j < i; j++) {
            swap(i, j, arr)
        }
    }
    return arr
}

const shiftDiagonal = (array, size) => {
    array = filterArray(array);
    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== null) {
                if (array[i] === array[i + 1]) {
                    array[i] *= 2
                    array[i + 1] = 0
                }
            }
        }
    }
    array = filterArray(array);
    while (array.length < size) {
        array.push(0)
    }
    return array
}

const shiftAndSplice = (array, size) => {
    array = filterArray(array);
    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== null) {
                if (array[i] === array[i + 1]) {
                    array[i] *= 2
                    array[i + 1] = 0
                }
            }
        }
    }
    array = filterArray(array);
    while (array.length < size * 2 - 1) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === null) {
                array.splice(i, 0, 0);
                break
            }
        }
    }
    return array
}

const shift = (array, size) => {
    array = filterArray(array);
    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== null) {
                if (array[i] === array[i + 1]) {
                    array[i] *= 2
                    array[i + 1] = 0
                }
            }
        }
    }
    array = filterArray(array);
    while (array.length < size * 2 - 1) {
        array.push(0)
    }
    return array
}

const swap = (y, x, arr) => {
    let number = arr[y][x]
    arr[y][x] = arr[x][y]
    arr[x][y] = number
    return arr
}

const filterArray = (arr) => {
    return arr.filter(el => el !== 0)
}

export const moveTop =async (matrix, size) => {
    let check = false
    transposel(matrix, size)
    for (let i = 0; i < size * 2 - 1; i++) {
        let oldMatrix = Array.from(matrix[i])
        if (i < size) {
            matrix[i] = shift(matrix[i], size)
        } else {
            matrix[i] = shiftAndSplice(matrix[i], size)
        }
        check = check || (matrix[i].join(',') !== oldMatrix.join(','))
    }
    transposel(matrix, size)
    return check
}

export const moveLeftDown = async(matrix, size) => {
    let check = false
    let sizeArray = size * 2 - 1
    let diagonalArray = []
    let oldMatrix = []
    for (let k = 0; k < sizeArray * 2; k++) {
        diagonalArray = []
        for (let j = 0; j <= k; j++) {
            let i = k - j;
            if (i < sizeArray && j < sizeArray) {
                let temp = matrix[i][j];
                diagonalArray.push(temp)
                oldMatrix = Array.from(diagonalArray)
            }
        }
        diagonalArray = shiftDiagonal(diagonalArray, diagonalArray.length)
        if (diagonalArray.length > 0) {
            let n = 0
            for (let j = 0; j <= k; j++) {
                let i = k - j;
                if (i < sizeArray && j < sizeArray) {
                    matrix[i][j] = diagonalArray[n];
                    n++
                }
            }
        }
        check = check || (diagonalArray.join(',') !== oldMatrix.join(','))
    }
    return check
}

export const moveRightTop = async(matrix, size) => {
    let check = false
    let sizeArray = size * 2 - 1
    let diagonalArray = []
    let oldMatrix = []
    for (let k = 0; k < sizeArray * 2; k++) {
        diagonalArray = []
        for (let j = 0; j <= k; j++) {
            let i = k - j;
            if (i < sizeArray && j < sizeArray) {
                let temp = matrix[i][j];
                diagonalArray.push(temp)
                oldMatrix = Array.from(diagonalArray)
            }
        }
        let reverseMatrix = diagonalArray.reverse()
        reverseMatrix = shiftDiagonal(diagonalArray, diagonalArray.length)
        diagonalArray = reverseMatrix.reverse()
        if (diagonalArray.length > 0) {
            let n = 0
            for (let j = 0; j <= k; j++) {
                let i = k - j;
                if (i < sizeArray && j < sizeArray) {
                    matrix[i][j] = diagonalArray[n];
                    n++
                }
            }
        }
        check = check || (diagonalArray.join(',') !== oldMatrix.join(','))
    }
    return check
}

export const moveLeftTop =async (matrix, size) => {
    let check = false
    for (let i = 0; i < size * 2 - 1; i++) {
        let oldMatrix = Array.from(matrix[i])
        if (i < size) {
            matrix[i] = shift(matrix[i], size)
        } else {
            matrix[i] = shiftAndSplice(matrix[i], size)
        }
        check = check || (matrix[i].join(',') !== oldMatrix.join(','))
    }
    return check
}

export const moveRightDown =async (matrix, size) => {
    let check = false
    for (let i = 0; i < size * 2 - 1; i++) {
        let oldMatrix = Array.from(matrix[i])
        let reverseMatrix = matrix[i].reverse()
        if (i < size - 1) {
            reverseMatrix = shiftAndSplice(reverseMatrix, size)
            matrix[i] = reverseMatrix.reverse()
        } else {
            reverseMatrix = shift(reverseMatrix, size)
            matrix[i] = reverseMatrix.reverse()
        }
        check = check || (matrix[i].join(',') !== oldMatrix.join(','))
    }
    return check
}

export const moveDown =async (matrix, size) => {
    let check = false
    transposel(matrix, size)
    for (let i = 0; i < size * 2 - 1; i++) {
        let oldMatrix = Array.from(matrix[i])
        let reverseMatrix = matrix[i].reverse()
        if (i < size - 1) {
            reverseMatrix = shiftAndSplice(reverseMatrix, size)
            matrix[i] = reverseMatrix.reverse()
        } else {
            reverseMatrix = shift(reverseMatrix, size)
            matrix[i] = reverseMatrix.reverse()
        }
        check = check || (matrix[i].join(',') !== oldMatrix.join(','))
    }
    transposel(matrix, size)
    return check
}

