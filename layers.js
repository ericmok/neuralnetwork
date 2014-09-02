/*global module, require*/

/**
Constructor to create a new layer of neurons
*/
function Layer() {
    'use strict';
    var args = Array.prototype.slice(arguments, 0);
    
    // Sensible args should be multiples of 2, yet a single arg might pass 
    if ((args.length === 0) || ((args.length % 2) !== 0 && args.length > 1)) {
        throw new Error("Arguments must be 1 or multiples of 2." +
                            "Example: new Layer(IdentityNeuron, 2, BiasNeuron, 1)");
    }
    
}

module.exports = {
    'Layer': Layer
};