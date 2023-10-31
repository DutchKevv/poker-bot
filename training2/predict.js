const { join } = require('path')
const { node, image, tensor1d, stack, dispose, loadLayersModel } = require('@tensorflow/tfjs-node')
const { readFileSync } = require('fs')
const imagePath = 'file://' + join(__dirname, './dennis-model/model.json')
const screenshotPath = join(__dirname, './project/data/table.png')

;(async () => {
  console.log(imagePath)
  const model = await loadLayersModel(imagePath)
  model.summary()
  const img = readFileSync(screenshotPath)
  // turn .png data to usable tfjs tensor
  const tfimage = node.decodeImage(img, 3).expandDims()
  // var img = tf.browser.fromPixels(video.elt);

  var smallimg = image.resizeBilinear(tfimage, [224, 224])
  // var resized = tf.cast(smallimg, 'float32');
  // img = tf.reshape(resized, ([-1, 224, 224, 3]));
  // const resize = image.resizeBilinear(tfimage, [224, 224])
  const prediction = await model.predict(smallimg).data()

  console.log(prediction, 'prediction')

  const targetTensors = []
  const boundingBox = [0, 224, 0, 224]
  const targetTensor = tensor1d([1].concat(boundingBox))
  const targets = stack([targetTensors])

  const targetsArray = Array.from(await targets.data())
  const boundingBoxArray = targetsArray.slice(1)
  console.log(boundingBoxArray)
})()
