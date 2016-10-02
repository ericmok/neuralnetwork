/*
This lets browserify squash everything into a single file
with easy access to frequently used dependencies.
*/
// function require(a: string) : any {}
//
// module.exports = {
//     'network': require('./network'),
//     'Network': require('./network').Network,
//     'meanSquaredError': require('./network').meanSquaredError,
//
//     'layers': require('./layers'),
//     'Layer': require('./layers').Layer,
//
//     'neurons': require('./neurons'),
//     'BiasNeuron': require('./neurons').BiasNeuron,
//     'IdentityNeuron': require('./neurons').IdentityNeuron,
//     'SigmoidNeuron': require('./neurons').SigmoidNeuron,
//     'RectifiedLinearNeuron': require('./neurons').RectifiedLinearNeuron,
//
//     'connections': require('./connections'),
//     'FullConnection': require('./connections').FullConnection,
//
//     'utils': require('./utils')
// };

import * as utils from './utils';
export { utils };

import * as neurons from './neurons';
export { neurons };

import * as layers from './layers';
export { layers };

import * as connections from './connections';
export { connections };

import * as network from './network';
export { network };
