const { readFileSync, readdirSync, statSync } = require('fs')
const { join } = require('path')
const { node, image, tensor1d, stack, dispose } = require('@tensorflow/tfjs-node')

class ObjectDetectionImageSynthesizer {

  async generateExampleBatch(batchSize, numCircles, numLines, triangleProbability) {
    if (triangleProbability == null) {
      triangleProbability = 0.5
    }
    const imageTensors = []
    const targetTensors = []
    const imagePath = join(__dirname, './data/cards')
    const filePaths = getFiles(imagePath);

    for (let i = 0; i < filePaths.length; ++i) {
      const imageRaw = readFileSync(filePaths[i])
      const boundingBox = [0, 224, 0, 224]
      const targetTensor = tensor1d([1].concat(boundingBox))
      const tfimage = node.decodeImage(imageRaw, 3)
      const resize = image.resizeBilinear(tfimage, [224, 224])


      imageTensors.push(resize)
      targetTensors.push(targetTensor)
    }
    const images = stack(imageTensors)
    const targets = stack(targetTensors)
    dispose([imageTensors, targetTensors])
    return { images, targets }
  }
}

module.exports = { ObjectDetectionImageSynthesizer }

function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a file, push the full path to the files array
      files.push(name);
    }
  }
  return files;
}