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
Zero's out a vector. But should this be pure?
*/
function zero(vec) {
    'use strict';
    
    vec.forEach(function (el, index) {
        vec[index] = 0;
    });
    
    return vec;
}

function outerProduct(vec0, vec1) {
    'use strict';
    
    var ret = [];
    
    vec0.forEach(function (v0, outerIndex) {
        vec1.forEach(function (v1, innerIndex) {
            ret[outerIndex * vec1.length + innerIndex] = v0 * v1;
        });
    });
        
    return ret;
}

/**
* Connects 2 layers together. Contains the parameters of the network
*/
function FullConnection(inputLayer, outputLayer) {
    'use strict';
    var i;
    
    this.parameters = [];
    this.derivatives = [];
    
    for (i = 0; i < inputLayer.neurons.length * outputLayer.neurons.length; i += 1) {
        this.parameters[i] = (Math.random() > 0.5 ? 1 : -1) * 2 * Math.random();
        this.derivatives[i] = 0;
    }
    
    this.inputLayer = inputLayer;
    this.outputLayer = outputLayer;
}

FullConnection.prototype.resetParameters = function (val) {
    'use strict';
    
    this.parameters = this.parameters.map(function (el) {
        return val || 0;
    });
};

FullConnection.prototype.resetDerivatives = function () {
    'use strict';
    
    zero(this.derivatives);
};

FullConnection.prototype.forward = function () {
    'use strict';
    
    this.outputLayer.inputBuffer = vectorSum(this.outputLayer.inputBuffer, matrixVectorMultiplication(this.parameters, this.inputLayer.outputBuffer));
};


FullConnection.prototype.backward = function () {
    'use strict';
    
    var self                    = this,
        prevActivationVector    = this.inputLayer.outputBuffer,
        parametersTransposed    = transpose(this.parameters, this.inputLayer.outputError.length),
        scaledErrors            = matrixVectorMultiplication(parametersTransposed, this.outputLayer.inputError);
    
    // The error multiplied by the parameter (aka weight)
    this.inputLayer.outputError = vectorSum(this.inputLayer.outputError, scaledErrors);
    
    // Not sure if it shouldbe transpose
    this.derivatives = outerProduct(this.outputLayer.inputError, this.inputLayer.outputBuffer);
    //console.log('Connection backward > deriv', this.derivatives);
    //console.log('Connection backward > in.outBuf', this.inputLayer.outputBuffer);
    //console.log('Connection backward > out.inErr', this.outputLayer.inputError);
};


module.exports = {
    'dotProduct': dotProduct,
    'vectorSum': vectorSum,
    'matrixVectorMultiplication': matrixVectorMultiplication,
    'transpose': transpose,
    'zero': zero,
    'outerProduct': outerProduct,
    'FullConnection': FullConnection
};