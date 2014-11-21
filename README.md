Neural Network
==============

A rudimentary javascript implementation of neural networks based on PyBrain.

A little less fancy for the imagination as the network is rigidly organized into layers and connections
and transfer signals instantaneously.


![Architecture](https://github.com/EricMok/neuralnetwork0/blob/master/architecture.png)


#### Recurrent Network
##### Not implemented

If extended to a neural network, histories would be saved.

![Architecture](https://github.com/EricMok/neuralnetwork0/blob/master/recurrentArchitecture.png)


## Installation

If using Node, then you'd want to require `nn.js`.

Run `npm test` to run mocha/chai tests.

If you want to use this for your website, you'll want to use browserify to build the node modules. There's a gulpfile included
that will compile it for you. Just run:

```
gulp
```


## Usage

```javascript
var nn = require('neuralnetwork0');
var Network = nn.Network,
    Layer = nn.Layer,
    FullConnection = nn.FullConnection,
    BiasNeuron = nn.BiasNeuron,
    SigmoidNeuron = nn.SigmoidNeuron,
    RectifiedLinearNeuron = nn.RectifiedLinearNeuron,
    IdentityNeuron = nn.IdentityNeuron;


var inputLayer = new Layer(IdentityNeuron, 4);
// Layer of [ <IdentityNeuron> x 4 ]

var hiddenLayer = new Layer(SigmoidNeuron, 16, RectifiedLinearNeuron, 16, BiasNeuron, 1);
// Layer of [ <SigmoidNeuron> x 16, <RectifiedLinearNeuron> x 16, <BiasNeuron> ]

var outputLayer = new Layer(SigmoidNeuron, 1);
// Layer of [ <SigmoidNeuron> x 1 ]


var ihConnection = new FullConnection(inputLayer, hiddenLayer);
var hoConnection = new FullConnection(hiddenLayer, outputLayer);


var network = new Network();

// Set the input and output layers
network.setRootLayer(inputLayer);
network.setOutputLayer(outputLayer);

/*
Register the connections between layers.
If you have hidden layers those will be explored in
a breadth-first fashion starting from the root layer.
*/
network.addConnection(ihConnection);
network.addConnection(hoConnection);


// Zero out the parameters
network.resetLayers();

// get output of network for given input. example: [1]
var output = network.forwardPropogate([1,2,3,4]);


// Train for 1000 epochs
for (var i = 0; i < 1000; i += 1) {

  // Train network a single step on single data point
  network.train([1,1,1,1], [1]);
  network.train([0,1,1,1], [0]);

  // Set the step (Default step is 0.21)
  network.train([0,0,1,1], [0], { step: 0.15 });

  // Train with momentum (Default momentum is 0.1)
  network.train([0,0,0,1], [0], { momentum: 0.09 });

  // Train with dropout (Default dropout probability is 0.2)
  network.train([0,0,0,0], [0], { dropout: 0.5 });
}


// TODO
// Not sure about this
// var recurrentConnection = new FullConnection(outputLayer, inputLayer);


// TODO
// var output = network.activate( [1,2,3,4,1] );


// TODO
// Train the network for 1000 epochs using backprop
//network.train( [ { in: [1,2,3,4,1], out: [1],
//                   in: [0,0,0,0,1], out: [0.1], // etc.
//                } ], 1000 );

// TODO
//ihConnection.parameters();
//hoConnection.parameters();

```


## Layers

Layers consist of an vector input buffer and vector output buffer of the same dimension.

A layer may be homogeneously made up of a single neuron types by using `Layer` or `GeneralLayer`.
Using `Layer`, each neuron can only operate on a single element scope of the input buffer and output buffer.

Using `GeneralLayer` will expose access to the underlying buffer allowing for more general transformations. (ie. Siblings
within the layer can influence each other.) However, whether you use `GeneralLayer` or `Layer`, the input and output
of the transformation will have to have the same dimensions.

If you desire that the input buffer and output buffer not be the same dimension,
use a connection between a larger layer and a smaller identity layer instead.

Layers contain the activation function for transferring values in the input buffer to the output buffer when forward propogating.
When training, layers backpropogate the error by undoing the forward propogation.


### Custom activation functions

```javascript

// Create 10 custom neurons with linear activation functions
var customNeuronExample = new Layer({
    forward: function(input) {
        return input;
    },
    backward: function(error) {
        return error;
    }
}, 10);
```

##### Not implemented yet
*Design Decision Needed*
Relevant: Recurrent Neural Network feature
Should neurons be functional or keep state trajectories and
activation histories?

```javascript
// Design Decision needed
var customNeuronExample = new Layer({
    forward: function(input, time) {
        return input[time];
    },
    backward: function(error, time) {
        return error[time];
    }
}, 10);
```


##### Not implemented yet

Connections can have full access to the input and output buffers.

```javascript

// Full control of input and output buffers of the layer
// Siblings can interact if you will.
var generalLayerExample = new GeneralLayer(function() {
    function sigmoid(x) {
        return 1.0 / (1 + Math.exp(-x);
    }
    function sigmoidPrime(x) {
        var s = sigmoid(x);
        return s * (1 - s);
    }

    this.forward = function(inputBuffer, outputBuffer, time) {
        outputBuffer.map(function(el, index) {
            return sigmoid( inputBuffer[index] );
        });
    };

    this.backward = function(inputBuffer, outputBuffer, inputError, outputError, time) {
        inputError.map(function(inErr, index) {
            return outputBuffer[index] * (1.0 - outputBuffer[index]) * outputError[index];
        });
    };
}, 4);

```

## Connections

Whereas layers map values, connections combine values.

##### Not yet implemented

```javascript

// Create a new connection
function ExampleConnection = Connection.create({
    forward: function(params, inputBuffer, outputBuffer) {
        outputBuffer = dotProduct(params, inputBuffer);
    },
    backward: function(params, inputError, outputError) {
        inputError = dotProduct( transpose(params), outputError );
    }, train: function(params, inputError, outputError) {

    }
});

network.addConnection(ExampleConnection, inputLayer, hiddenLayer);
network.addConnection(ExampleConnection, hiddenLayer, outputLayer);

```
