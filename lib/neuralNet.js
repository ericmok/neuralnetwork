/*
This lets browserify squash everything into a single file
with easy access to frequently used dependencies.
*/

module.exports = {
    'network': require('./network'),
    'Network': require('./network').Network,
    'meanSquaredError': require('./network').meanSquaredError,

    'Layers': require('./layers'),
    'Layer': require('./layers').Layer,

    'Neurons': require('./neurons'),
    'SigmoidNeuron': require('./neurons').BiasNeuron,
    'SigmoidNeuron': require('./neurons').IdentityNeuron,
    'SigmoidNeuron': require('./neurons').SigmoidNeuron,
    'SigmoidNeuron': require('./neurons').RectifiedLinearNeuron,

    'Connections': require('./connections'),
    'FullConnection': require('./connections').FullConnection,

    'utils': require('./utils')
};