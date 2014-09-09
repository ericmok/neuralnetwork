Neural Network
==============

A rudimentary javascript implementation of neural networks based on PyBrain.

A little less fancy for the imagination as the network is rigidly organized into layers and connections
and transfer signals instantaneously.


![Architecture](https://github.com/EricMok/neuralnetwork0/blob/master/architecture.png)
![Architecture](https://github.com/EricMok/neuralnetwork0/blob/master/recurrentArchitecture.png)


##Todo:

```javascript
var inputLayer = new Layer(IdentityNeuron, 4);
// Layer of [ <IdentityNeuron> x 4 ]

var hiddenLayer = new Layer(SigmoidNeuron, 16, RectifiedLinearNeuron, 16, BiasNeuron, 1); 
// Layer of [ <SigmoidNeuron> x 16, <RectifiedLinearNeuron> x 16, <BiasNeuron> ]

var outputLayer = new Layer(SigmoidNeuron, 1);
// Layer of [ <SigmoidNeuron> x 1 ]



var ihConnection = new FullConnection(inputLayer, hiddenLayer);
var hoConnection = new FullConnection(hiddenLayer, outputLayer);


// Not sure about this
// var recurrentConnection = new FullConnection(outputLayer, inputLayer);


var network = new NeuralNetwork();

network.setRootLayer(inputLayer);
network.setOutputLayer(outputLayer);

network.addConnection(ihConnection);
network.addConnection(hoConnection);
    
var output = network.activate( [1,2,3,4,1] );


// Train the network for 1000 epochs using backprop
network.train( [ { in: [1,2,3,4,1], out: [1],
                   in: [0,0,0,0,1], out: [0.1], // etc.
                } ], 1000 ); 


ihConnection.parameters();
hoConnection.parameters();

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
    forward: function(input, time) {
        return input[time];
    },
    backward: function(error, time) {
        return error[time];
    }
}, 10);


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

Technically more general than layers. They allow many to many relationships as opposed to `Layer`'s one to one relationship.



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


