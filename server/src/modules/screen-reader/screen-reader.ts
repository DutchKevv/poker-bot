import screenshot from 'screenshot-desktop'
import { join } from 'path'
import { mkdirSync, readFileSync } from 'fs'
import { Rank, Tensor, node, loadLayersModel, image } from '@tensorflow/tfjs-node'

const FILE_DIR = join(__dirname, '../../../data/screenshots')
const MODEL_ROOT = join(__dirname, "./models");

const modelURL = join(MODEL_ROOT, '1', "model.json");
const metadataURL = join(MODEL_ROOT, '1', "metadata.json");

mkdirSync(FILE_DIR, { recursive: true })

export class AIScreenReader {
    constructor() {}

    startScreenshotInterval() {
        setInterval(async () => {
            const screenshot = await this.getScreenshot()
            this.predictCardsFromImg(screenshot)
        }, 10000)
    }

    async getScreenshot(): Promise<Uint8Array> {
        const now = Date.now()
        const filename = join(FILE_DIR, `${now}.png`)
        const displays = await screenshot.listDisplays()

        // TODO: returning IMG doesnt work
        const img = await screenshot({
            format: 'png',
            filename,
            screen: displays[displays.length - 1].id,
        })

        console.log(typeof readFileSync(filename))
        return readFileSync(filename)
    }

    async predictCardsFromImg(img: Uint8Array) {
        const tfimage = node.decodeImage(img, 3).expandDims()
        const model = await loadLayersModel(`file://${modelURL}`)
        const resize = image.resizeBilinear(tfimage as any, [224, 224])
        const predictions = model.predict(resize) as Tensor<Rank>
        // const saveResults = await model.save('./test.sdf');
        console.log(2222, predictions, predictions.print())
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