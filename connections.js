/*globals module, require*/

function dotProduct(v0, v1) {
    'use strict';
    
    var sum = v0.reduce(function (sum, currentValue, index, array) {
        return sum + currentValue * v1[index];
    }, 0);
    
    return sum;
}

function matrixVectorMultiplication(matrix, vec) {
    'use strict';
    
    if (matrix.length % vec.length !== 0) {
        throw new Error('Matrix length should be multiple of vector length. Given: ', matrix.length, ',', vec.length);
    }
    
    if (matrix.length < vec.length) {
        throw new Error('Matrix too short');
    }
    
    var i, ret = [];
    
    for (i = 0; i < matrix.length / vec.length; i += 1) {
        ret.push(dotProduct(matrix.slice(i * vec.length, (i + 1) * vec.length), vec));
    }
    
    return ret;
}

function transpose(matrix, numberColumns) {
    'use strict';
    
    var i, j, 
        numberRows = matrix.length / numberColumns,
        ret = [];
    
    for (i = 0; i < numberRows; i += 1) {
        for (j = 0; j < numberColumns; j += 1) {
            ret[j * numberRows + i] = matrix[i * numberColumns + j];
        }
    }
    
    return ret;
}

/**
* Connects 2 layers together. Contains the parameters of the network
*/
function FullConnection(inputLayer, outputLayer) {
    'use strict';
    
    this.parameters = [];
    this.inputLayer = inputLayer;
    this.outputLayer = outputLayer;
}

FullConnection.prototype.forward = function () {
    'use strict';
    
    this.outputLayer.inputBuffer = dotProduct(this.inputLayer.outputBuffer, this.parameters);
};

FullConnection.prototype.backward = function () {
    'use strict';
    
    this.inputLayer.outputError = dotProduct(this.outputLayer.inputError, transpose(this.params));
};


module.exports = {
    'dotProduct': dotProduct,
    'matrixVectorMultiplication': matrixVectorMultiplication,
    'transpose': transpose,
    'FullConnection': FullConnection
};