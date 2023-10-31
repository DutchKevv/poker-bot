const tf = require('@tensorflow/tfjs-node'); // Use '@tensorflow/tfjs' for the browser
const fs = require('fs');
const cocoSsd = require('@tensorflow-models/coco-ssd'); // For object detection
const {join} = require('path'); // For object detection

const bal = join(__dirname, 'project/data/cards/224.png');
// const bal = join(__dirname, 'project/data/cards/card_j_diamond.png');
// Step 1: Load and Preprocess Data (Simplified)
const dataset = [
  { image: bal, objects: [{ label: 'cat', boundingBox: { x: 100, y: 150, width: 50, height: 40 } }] },
  { image: bal, objects: [{ label: 'dog', boundingBox: { x: 200, y: 100, width: 60, height: 55 } }] },
  // Add more images and objects
];

const numClasses = 2; // Number of classes in your dataset
const learningRate = 0.001;
const batchSize = 16;
const numEpochs = 50;

// Step 2: Load MobileNetV2 as the Base Model
async function createCustomModel() {
  const baseModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json');
  return tf.model({ inputs: baseModel.inputs, outputs: baseModel.layers[22].output });
}

// Step 3: Create and compile the custom object detection model
async function buildAndCompileModel(baseModel) {
  const model = tf.sequential();
  model.add(baseModel);

  // Add custom layers on top of the base model
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

// Step 4: Load and preprocess the dataset and labels
function loadAndPreprocessData(dataset) {
  const data = [];
  const labels = [];

  for (const sample of dataset) {
    const imgData = fs.readFileSync(sample.image);
    const img = tf.node.decodeImage(imgData);
    const expandedImageTensor = tf.expandDims(img, 0); 

    // const img2 = tf.image.resizeBilinear(expandedImageTensor, [224,224])
    // const img3 = tf.reshape(img2, [224,224])
    data.push(img);

    for (const obj of sample.objects) {
      labels.push(obj.label);
    }
  }

  const x = tf.stack(data);
  const y = tf.oneHot(tf.tensor1d(labels.map(label => labelToClassIndex(label)), 'int32'), numClasses);

  return { x, y };
}

function labelToClassIndex(label) {
  // Map label strings to class indices
  if (label === 'cat') return 0;
  if (label === 'dog') return 1;
  return -1; // Handle other labels accordingly
}

// Step 5: Train the custom object detection model
async function trainCustomModel() {
  const baseModel = await createCustomModel();
  const model = await buildAndCompileModel(baseModel);
  const { x, y } = loadAndPreprocessData(dataset);

  await model.fit(x, y, {
    batchSize,
    epochs: numEpochs,
  });

  return model;
}

trainCustomModel()
  .then(model => {
    console.log('Training completed.');
    // You can use the trained model for inference or save it for later use
  })
  .catch(error => {
    console.error('Error during training:', error);
  });
