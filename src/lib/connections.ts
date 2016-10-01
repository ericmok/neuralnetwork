/*globals module, require*/

import {dotProduct, vectorSum, matrixVectorMultiplication, transpose, zero, outerProduct} from './utils.ts';
import {Layer} from './layers.ts';

/**
* Connects 2 layers together. Contains the parameters of the network
*/
export class FullConnection {
    parameters: Array<number>;
    derivatives: Array<number>;
    inputLayer: Layer;
    outputLayer: Layer;

    constructor(inputLayer: Layer, outputLayer: Layer) {
        this.parameters = [];
        this.derivatives = [];

        for (let i = 0; i < inputLayer.neurons.length * outputLayer.neurons.length; i += 1) {
            this.parameters[i] = (Math.random() > 0.5 ? 1 : -1) * 2 * Math.random();
            this.derivatives[i] = 0;
        }

        this.inputLayer = inputLayer;
        this.outputLayer = outputLayer;
    }

    resetParameters(val: number) {
        this.parameters = this.parameters.map((el) => {
            return val || 0;
        });
    }

    resetDerivatives() {
        zero(this.derivatives);
    }

    forward() {
        this.outputLayer.inputBuffer = vectorSum(this.outputLayer.inputBuffer, matrixVectorMultiplication(this.parameters, this.inputLayer.outputBuffer));
    }

    backward() {
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
    }
}
