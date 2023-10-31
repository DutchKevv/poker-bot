const { join } = require('path')
const { node, image, tensor1d, stack, dispose, loadLayersModel } = require('@tensorflow/tfjs-node')
const fs = require('fs')
const modelPath = 'file://' + join(__dirname, './dennis-model/model.json')
const imagePath = join(__dirname, './project/data/table.png')

const tf = require('@tensorflow/tfjs-node') // Use '@tensorflow/tfjs' for the browser

async function predictObjectDetection(model, imagePath) {
  // Load the image
  const imgData = fs.readFileSync(imagePath)
  const img = tf.node.decodeImage(imgData)

  //   const img = readFileSync(screenshotPath)
  // turn .png data to usable tfjs tensor
  //   const tfimage = node.decodeImage(img, 3).expandDims()
  // var img = tf.browser.fromPixels(video.elt);

  var smallimg = image.resizeBilinear(img, [224, 224], true)

  // Preprocess the image
  //   const preprocessedImg = img.resizeBilinear([224, 224]).div(255)

  // Make a prediction using the model
  const predictions = model.predict(smallimg.expandDims(0))

  // Process the predictions
  const labels = ['cat', 'dog'] // Define your class labels
  const maxPredictions = 10 // Maximum number of predictions to consider

  const [scores, boxes] = tf.tidy(() => {
    const scores = predictions.slice([0, 0, 0, 0], [1, -1, -1, 2])
    const boxes = predictions.slice([0, 0, 0, 2], [1, -1, -1, -1])

    return [scores.squeeze(), boxes.squeeze()]
  })

  const indices = await tf.image.nonMaxSuppressionAsync(boxes, scores, maxPredictions, 0.5, 0.5)

  if (indices == null) {
    return []
  }

  const detectionResults = indices.map((i) => ({
    label: labels[i],
    score: scores[i],
  }))

  return detectionResults
}

// Load the trained custom object detection model
tf.loadLayersModel(modelPath).then((customModel) => {
  // Use the model to perform object detection on an image
  // const imagePath = 'path_to_image_to_detect.jpg'
  predictObjectDetection(customModel, imagePath)
    .then((detectionResults) => {
      console.log('Object Detection Results:')
      detectionResults.forEach((result) => {
        console.log(`Label: ${result.label}, Score: ${result.score}`)
      })
    })
    .catch((error) => {
      console.error('Error during object detection:', error)
    })
})

// ;(async () => {
//   console.log(imagePath)
//   const model = await loadLayersModel(imagePath)
//   model.summary()
//   const img = readFileSync(screenshotPath)
//   // turn .png data to usable tfjs tensor
//   const tfimage = node.decodeImage(img, 3).expandDims()
//   // var img = tf.browser.fromPixels(video.elt);

//   var smallimg = image.resizeBilinear(tfimage, [224, 224])
//   // var resized = tf.cast(smallimg, 'float32');
//   // img = tf.reshape(resized, ([-1, 224, 224, 3]));
//   // const resize = image.resizeBilinear(tfimage, [224, 224])
//   const prediction = await model.predict(smallimg).data()

//   console.log(prediction, 'prediction')

//   const targetTensors = []
//   const boundingBox = [0, 224, 0, 224]
//   const targetTensor = tensor1d([1].concat(boundingBox))
//   const targets = stack([targetTensors])

//   const targetsArray = Array.from(await targets.data())
//   const boundingBoxArray = targetsArray.slice(1)
//   console.log(boundingBoxArray)
// })()
