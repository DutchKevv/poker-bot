import { join } from 'path'
import { Rank, Tensor, node, loadLayersModel, image, tensor1d, stack, dispose, Tensor1D } from '@tensorflow/tfjs-node'
import { getScreenshot } from './screen-reader.util';
import { Base } from '../base';
import { readFileSync } from 'fs';

const imagePath = 'file://' + join(__dirname, '../../../../training/data/models/cards/model.json');

const SCREEN_READER_INTERVAL = 10000
const MODEL_ROOT = join(__dirname, "./models");

export class AIScreenReader extends Base {

    start() {
        setInterval(async () => {
            const screenshotImg = await getScreenshot()
            this.predictPlayersFromImg(screenshotImg)
        }, SCREEN_READER_INTERVAL)
    }   

    async predictPlayersFromImg(img: Uint8Array) {
        const model = await loadLayersModel(imagePath);
        model.summary();
        // turn .png data to usable tfjs tensor
        const tfimage = node.decodeImage(img, 3).expandDims()
        // var img = tf.browser.fromPixels(video.elt);
    
        var smallimg = image.resizeBilinear(tfimage as any, [224, 224]);
        // var resized = tf.cast(smallimg, 'float32');
        // img = tf.reshape(resized, ([-1, 224, 224, 3]));
        // const resize = image.resizeBilinear(tfimage, [224, 224])
        const prediction = await model.predict(smallimg)
        let predictionData
        if (Array.isArray(prediction)) {
            predictionData = await prediction[0].data()
        } else {
            predictionData = await prediction.data()
        }
    
        const targetTensors: Tensor1D[] = []

        for (let i = 0; i < 10; i++) {
            const boundingBox = [0, 1224, 0, 1224]
            const targetTensor = tensor1d([1].concat(boundingBox))
            targetTensors.push(targetTensor)
        }

        const targets = stack(targetTensors)
    
        const targetsArray = Array.from(await targets.data());
        const boundingBoxArray = targetsArray.slice(1);
        const data = (await (prediction as Tensor<Rank>).data())
        console.log('boundingBoxArray', new Int8Array(data.buffer, data.byteOffset, data.length))
        this.system.api.io.emit('screen-reader-update', { data: data.buffer })
    }

    async predictPlayersFromImg2(img: Uint8Array) {
        // load tensorflow model
        const modelURL = join(MODEL_ROOT, '1', "model.json");
        const metadataURL = join(MODEL_ROOT, '1', "metadata.json");     
        const model = await loadLayersModel(`file://${modelURL}`)

        // turn .png data to usable tfjs tensor
        const tfimage = node.decodeImage(img, 3).expandDims()
        const resize = image.resizeBilinear(tfimage as any, [224, 224])

        // perform prediction
        const predictions = model.predict(resize) as Tensor<Rank>
        let highestIndex = predictions.argMax().arraySync();
        let predictionArray = predictions.arraySync();

        console.log(2323, predictionArray)

 
        // const saveResults = await model.save('./test.sdf');
        // console.log(2222, predictions, predictions.print())
        // const model = await tf.loadLayersModel(`file://${modelURL}`)

        // const tfimage = tf.node.decodeImage(img);
        // const model = await tf.loadLayersModel(`file://${modelURL}`)
        // // const model = await tmImage.load(modelURL, metadataURL);
        // // // predict can take in an image, video or canvas html element
        // const prediction = await model.predict(tfimage);
        // for (let i = 0; i < maxPredictions; i++) {
        //   const classPrediction =
        //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        //   labelContainer.childNodes[i].innerHTML = classPrediction;
        // }
    }

    // async predictWebcam(img: Uint8Array) {
    //     console.log(img)
    //     const tfimage = tf.node.decodeImage(img)
    //     // Load the model.
    //     const model = await cocoSsd.load()
    //     var buffer = Buffer.from(new Uint8Array(img))
    //     let ui32 = new Uint32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint32Array.BYTES_PER_ELEMENT)
    //     // Now let's start classifying a frame in the stream.
    //     model.detect(tfimage).then(function (predictions) {
    //         // Remove any highlighting we did previous frame.
    //         for (let i = 0; i < children.length; i++) {
    //             liveView.removeChild(children[i])
    //         }
    //         children.splice(0)

    //         console.log(23434)

    //         // Now lets loop through predictions and draw them to the live view if
    //         // they have a high confidence score.
    //         for (let n = 0; n < predictions.length; n++) {
    //             // If we are over 66% sure we are sure we classified it right, draw it!
    //             if (predictions[n].score > 0.66) {
    //                 // const p = document.createElement('p');
    //                 // p.innerText = predictions[n].class  + ' - with '
    //                 //     + Math.round(parseFloat(predictions[n].score) * 100)
    //                 //     + '% confidence.';
    //                 // p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
    //                 //     + (predictions[n].bbox[1] - 10) + 'px; width: '
    //                 //     + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';
    //                 // const highlighter = document.createElement('div');
    //                 // highlighter.setAttribute('class', 'highlighter');
    //                 // highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
    //                 //     + predictions[n].bbox[1] + 'px; width: '
    //                 //     + predictions[n].bbox[2] + 'px; height: '
    //                 //     + predictions[n].bbox[3] + 'px;';
    //                 // liveView.appendChild(highlighter);
    //                 // liveView.appendChild(p);
    //                 // children.push(highlighter);
    //                 // children.push(p);
    //             }
    //         }

    //         console.log(2323, predictions)
    //     })
    // }
}
