Neural Network
==============


A Typescript implementation of rudimentary feed forward neural networks with inspirations taken from PyBrain.

![Architecture](https://github.com/EricMok/neuralnetwork/blob/master/architecture.png)


## Scripts

For development:
```
npm install
./node_modules/.bin/typings install
npm run gulp watch
```

To build only:
```
npm run build
```

To test only:
```
npm test
```
Caveats to testing: Some tests may fail from time to time due to usage of randomness.
You may have to run the tests several times to gauge how well the neural network learns under
the constraint of limited number of training cycles.


## Example Usage

```javascript
import * as nn from './src/lib/index';

// Also available:
import {Network} from './src/lib/network';
import {Layer} from './src/lib/layers';
import {FullConnection} from './src/lib/connections';
import {BiasNeuron, SigmoidNeuron, RectifiedLinearNeuron, IdentityNeuron} from './src/lib/neurons';

//
// Creating Layers
//

var inputLayer = new Layer([{kind: IdentityNeuron, amount: 4}]);
// Layer of [ <IdentityNeuron> x 4 ]

var hiddenLayer = new Layer([
    {kind: SigmoidNeuron, amount: 16},
    {kind: RectifiedLinearNeuron, amount: 16},
    {kind: BiasNeuron, amound: 1}
]);
// Layer of [ <SigmoidNeuron> x 16, <RectifiedLinearNeuron> x 16, <BiasNeuron> ]

var outputLayer = new Layer([kind: SigmoidNeuron, amount: 1}]);
// Layer of [ <SigmoidNeuron> x 1 ]


//
// Creating Connections
//

var ihConnection = new FullConnection(inputLayer, hiddenLayer);
var hoConnection = new FullConnection(hiddenLayer, outputLayer);


//
// Creating the Network
//

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

// Fires the network for given input
var output = network.forwardPropogate([1,2,3,4]);
```

## Training

```javascript
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
```


## Layers and Neurons

A Layer of neurons is constructed like so:

```javascript
var layer = new Layer([
    {kind: IdentityNeuron, amount: 4},
    {kind: RectifiedLinearNeuron, amount: 100},
    {kind: BiasNeuron, amount: 1},
    // etc...
]);
```

Neurons are laid out consecutively and contiguously within a layer.

Layers consist of an input buffer (Array<number>) and output buffer (Array<number>) of the same dimension.
Neurons store the activation function used to transform the input buffer into the output buffer by
calling each Neuron's forward() method serially for each number in the inputBuffer.
(Akin to mapping the values of input buffer to the values of the output buffer.)

When the network fires, layers will receive a vector to process.
Layers will send the output to all connecting Connections to it.

When training, Layers backpropogate the error, invoking its Neurons' backward() method.

Each neuron can only operate on a single element scope of the input buffer and output buffer.
Neurons do not have explicit access to the underlying buffer of the containing Layer.

If you desire that the input buffer and output buffer not be the same dimension,
use a connection between a larger layer and a smaller identity layer instead.


### Custom activation functions

Creating custom activation functions can be as simple as inheriting from Neuron and
overriding two methods.

```javascript
class MyCustomNeuron extends Neuron {
    forward(input: number): number {
        return 1.0 / (1.0 + Math.exp(-input));
    }

    // Output is the activation value created by forward
    backward(err: number, output: number): number {
      return output * (1 - output) * err;
    }
}
```


## Connections and Networks

Whereas layers "map" values, connections "reduce" values. Layers have to be added
to the network. The network will maintain forward connections between layers and connections
in a table so when the network fires, data will flow to all units in a breadth-first sort of way.

```javascript
var ihConnection = new FullConnection(inputLayer, hiddenLayer);
var hoConnection = new FullConnection(hiddenLayer, outputLayer);


network.addConnection(ExampleConnection);
network.addConnection(ExampleConnection);
```


## Can I build recurrent neural nets?

Currently neurons and layers are stateless.
To simulate RNN's you will have to consider expanding the network like so:

![Architecture](https://github.com/EricMok/neuralnetwork/blob/master/recurrentArchitecture.png)


```javascript
// Not implemented.
// var recurrentConnection = new FullConnection(outputLayer, inputLayer);
```

## Features to Add

- Exporting parameters
- Helper method for firing network
- Helper method for training network
- Non-stateless neurons and layers for RNN's
- Connections can have full access to the input and output buffers.
- Neural network testing should be made to run multiple times. Tests should pass upon reaching reasonable statistics.

```javascript
// Not implemented. Just an idea
class GeneralLayer implements L {
    forward(inputBuffer, outputBuffer, time) {
        outputBuffer.map(function(el, index) {
            return sigmoid( inputBuffer[index] );
        });
    }
}
```
