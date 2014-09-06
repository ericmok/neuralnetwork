/*globals module, require*/

function dotProduct(v0, v1) {
    'use strict';
    
    var sum = v0.reduce(function (sum, currentValue, index, array) {
        return sum + currentValue * v1[index];
    }, 0);
    
    return sum;
}

function vectorSum(v0, v1) {
    'use strict';
    
    var ret = [],
        longer = Math.max(v0.length, v1.length),
        other = null,
        temp = 0;
    
    longer = (longer === v0.length) ? v0 : v1;
    other = (longer === v0) ? v1 : v0;
    
    longer.forEach(function (el, index) {
        
        // the other index might be empty since the other vector is shorter
        temp = other[index] || 0;
        
        ret[index] = el + temp;
    });
    
    return ret;
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
    var i;
    
    this.parameters = [];
    
    for (i = 0; i < inputLayer.neurons.length * outputLayer.neurons.length; i += 1) {
        this.parameters[i] = (Math.random() > 0.5 ? 1 : -1) * 2 * Math.random();
    }
    
    this.inputLayer = inputLayer;
    this.outputLayer = outputLayer;
}

FullConnection.prototype.zeroParameters = function (val) {
    'use strict';
    
    this.parameters = this.parameters.map(function (el) {
        return val ? val : 0;
    });
};

FullConnection.prototype.forward = function () {
    'use strict';
    
    this.outputLayer.inputBuffer = vectorSum(this.outputLayer.inputBuffer, matrixVectorMultiplication(this.parameters, this.inputLayer.outputBuffer));
};

FullConnection.prototype.backward = function () {
    'use strict';
    
    var scaledError = transpose(this.parameters, this.inputLayer.outputError.length);

    this.inputLayer.outputError = vectorSum(this.inputLayer.outputError, matrixVectorMultiplication(scaledError, this.outputLayer.inputError));
};


module.exports = {
    'dotProduct': dotProduct,
    'vectorSum': vectorSum,
    'matrixVectorMultiplication': matrixVectorMultiplication,
    'transpose': transpose,
    'FullConnection': FullConnection
};