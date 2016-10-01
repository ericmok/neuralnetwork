/*globals module, require*/

var utils = require('./utils');
var dotProduct = utils.dotProduct;
var vectorSum = utils.vectorSum;
var matrixVectorMultiplication = utils.matrixVectorMultiplication;
var transpose = utils.transpose;
var zero = utils.zero;
var outerProduct = utils.outerProduct;

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
    
    this.derivatives = outerProduct(this.outputLayer.inputError, this.inputLayer.outputBuffer);
    //console.log('Connection backward > deriv', this.derivatives);
    //console.log('Connection backward > in.outBuf', this.inputLayer.outputBuffer);
    //console.log('Connection backward > out.inErr', this.outputLayer.inputError);
};


module.exports = {
    'FullConnection': FullConnection
};