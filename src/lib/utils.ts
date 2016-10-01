export type Vector = Array<number>;

export function dotProduct(v0: Vector, v1: Vector) : number {
    var sum = v0.reduce(function (sum, currentValue, index, array) {
        return sum + currentValue * v1[index];
    }, 0);

    return sum;
}

export function vectorSum(v0: Vector, v1: Vector) : Vector {
    var ret : Vector = [],
        longer = Math.max(v0.length, v1.length),
        longerVector : Vector | null = null,
        other : Vector | null = null,
        temp = 0;

    longerVector = (longer === v0.length) ? v0 : v1;
    other = (longerVector === v0) ? v1 : v0;

    longerVector.forEach(function (el, index) {

        // the other index might be empty since the other vector is shorter
        temp = other[index] || 0;

        ret[index] = el + temp;
    });

    return ret;
}

export function matrixVectorMultiplication(matrix : Vector, vec : Vector) : Vector {
    if (matrix.length % vec.length !== 0) {
        throw new Error('Matrix length should be multiple of vector length. Given: ' + matrix.length.toString() + ',' + vec.length.toString());
    }

    if (matrix.length < vec.length) {
        throw new Error('Matrix too short');
    }

    var ret : Vector = [];

    for (let i = 0; i < matrix.length / vec.length; i += 1) {
        ret.push(dotProduct(matrix.slice(i * vec.length, (i + 1) * vec.length), vec));
    }

    return ret;
}

export function transpose(matrix : Vector, numberColumns : number) : Vector {
    var numberRows = matrix.length / numberColumns;
    var ret : Vector = [];

    for (let i = 0; i < numberRows; i += 1) {
        for (let j = 0; j < numberColumns; j += 1) {
            ret[j * numberRows + i] = matrix[i * numberColumns + j];
        }
    }

    return ret;
}

/**
Zero's out a vector. But should this be pure?
*/
export function zero(vec : Vector) : Vector {
    vec.forEach(function (el, index) {
        vec[index] = 0;
    });

    return vec;
}

export function outerProduct(vec0 : Vector, vec1 : Vector) : Vector {
    var ret : Vector = [];

    vec0.forEach(function (v0, outerIndex) {
        vec1.forEach(function (v1, innerIndex) {
            ret[outerIndex * vec1.length + innerIndex] = v0 * v1;
        });
    });

    return ret;
}
