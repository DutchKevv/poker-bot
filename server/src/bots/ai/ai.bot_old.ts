import { MachinePokerGame } from '../../_vendor/machine-poker/machine-poker.intefaces'
import { Bot } from '../bot'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-wasm'
import {
  DataSMAvec,
  TrainedModel,
  ITensorflowOptions,
  TensorFlowOutput,
  ITensorflowRunResult,
  ITensorFlowWorkerMessage,
  ITensorFlowWorkerMessageProgress,
} from './ai.interfaces'
import { TENSORFLOW_WORKER_ACTION } from './ai.util'
import { System } from '../../modules/system/system'

export class AIBot extends Bot {
  trainedModel: TrainedModel

  constructor() {
    super({})
    this.options = {}
  }

  async init() {
    console.log(234343)

    const inputs: any = []
    // const inputs = this.dataSmaVec.map((input) => input.set.map((val) => val[CANDLE_FIELD.CLOSE]))
    const outputs = [] as any
    // const outputs = this.dataSmaVec.map((output) => output.avg)

    const options: ITensorflowOptions = Object.assign({}, this.options, {
      inputs,
      outputs,
    }) as any

    this.trainedModel = await this.trainModel(options, this.logEpochs.bind(this))
  }

  async update(game: MachinePokerGame) {
    if (game.state !== 'complete') {
        // const prediction = this.makePredictions(x, this.trainedModel.model)
      return game.betting.call
    //   return game.betting.call
    }
  }

  /***************** TENSORFLOW STUFF ****************************/


  async trainModel(options: ITensorflowOptions, callback: any): Promise<TrainedModel> {
    const input_layer_shape = options.SMALength
    const input_layer_neurons = 50
    const rnn_input_layer_features = 10
    const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features
    const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps]
    const rnn_output_neurons = 20
    const rnn_batch_size = options.SMALength
    const output_layer_shape = rnn_output_neurons
    const output_layer_neurons = 1

    // 1. Create the model
    const X = options.inputs
    // let X = options.inputs.slice(0, Math.floor((options.trainingSize / 100) * options.inputs.length))

    // 2. Create the output data
    const Y = options.outputs
    // let Y = options.outputs.slice(0, Math.floor((options.trainingSize / 100) * options.outputs.length))

    // 3. Normalize the data
    const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10))

    // 4. Convert the output data to a 2d tensor
    const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]).div(tf.scalar(10))

    // 5. Create the model's topology
    const model = tf.sequential()

    // 6. Add the first layer
    model.add(
      tf.layers.dense({
        units: input_layer_neurons,
        inputShape: [input_layer_shape as any],
      })
    )

    // 7. Add the RNN layer
    model.add(tf.layers.reshape({ targetShape: rnn_input_shape }))

    // 8. Add the LSTM layer
    const lstm_cells = []
    for (let index = 0; index < (options.hiddenLayers || 1); index++) {
      lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }))
    }

    // 9. Add the output layer
    model.add(
      tf.layers.rnn({
        cell: lstm_cells,
        inputShape: rnn_input_shape,
        returnSequences: false,
      })
    )

    // 10. Add the output layer
    model.add(
      tf.layers.dense({
        units: output_layer_neurons,
        inputShape: [output_layer_shape],
      })
    )

    // 11. Compile the model
    model.compile({
      optimizer: tf.train.adam(options.learningRate),
      loss: 'meanSquaredError',
    })

    let bestLoss = Infinity
    let patienceCounter = 0
    const patienceLimit = 3

    // 12. Fit the model
    const stats = await model.fit(xs, ys, {
      batchSize: rnn_batch_size,
      epochs: options.epochs,
      callbacks: {
        onEpochEnd: async (epoch, log: any) => {
          this.emitProgress(epoch, log.loss)

          // if (log.loss < 1) {
          //   // loss of 1 when divided by 10 as per your normalization
          //   console.log('Loss is under 1, stopping training')
          //   model.stopTraining = true
          // }

          // Custom early stopping
          if (log.loss < bestLoss) {
            bestLoss = log.loss
            patienceCounter = 0
          } else {
            patienceCounter++
            if (patienceCounter >= patienceLimit) {
              console.log('No improvement for 3 epochs, stopping training')
              model.stopTraining = true
            }
          }

          // Your callback function
          callback(epoch, log, options)
        },
      },
    })

    // 13. Convert the data to a form we can use for plotting
    return { model, stats }
  }

  //   async validate(): Promise<ITensorflowRunResult['data']> {
  //     const inputs = this.dataSmaVec.map((input) => input.set.map((val: any) => val[0]))
  //     // const inputs = this.dataSmaVec.map((input) => input.set.map((val) => val[CANDLE_FIELD.CLOSE]))
  //     const predX = inputs.slice(inputs.length - this.options.predictionSize, inputs.length)
  //     const predY = this.makePredictions(predX, this.trainedModel.model)

  //     return {
  //       inputs: {
  //         predX,
  //         predY,
  //         sma: this.dataSmaVec.map((val) => val.avg as any),
  //       },
  //     }
  //   }

  // makePredictions(x: number[][], model: tf.Sequential): Float32Array {
  //   const prediction = model.predict(tf.tensor2d(x, [x.length, x[0].length]).div(tf.scalar(10))) as tf.Tensor<tf.Rank>
  //   const predictedResults = prediction.mul(10)
  //   return predictedResults.dataSync() as Float32Array
  // }

  private logEpochs(epoch: number, log: { loss: number }) {
    console.log(`Epoch ${epoch + 1}/${this.options?.epochs} | loss: ${log.loss}`)
  }

  private emitProgress(epoch: number, loss: number): void {
    const message: ITensorFlowWorkerMessage<ITensorFlowWorkerMessageProgress> = {
      action: TENSORFLOW_WORKER_ACTION.PROGRESS,
      data: {
        epoch: epoch + 1,
        totalEpoch: this.options?.epochs as number,
        loss,
      },
    }
    // workerEmit(message)
    // TODO - post to parent process
    // postMessage(message)
  }
}

export default function () {
  return new AIBot()
}
