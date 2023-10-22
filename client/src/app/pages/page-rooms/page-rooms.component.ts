import { Component, ElementRef, OnInit } from '@angular/core'
import { util } from '@tensorflow/tfjs'
import { GameService } from '../../services/game/game.service'
import { Game } from '../../services/game/game'
import { SocketService } from '../../services/socket/socket.service'

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
var vidWidth = 0
var vidHeight = 0
var xStart = 0
var yStart = 0

const canvas = document.getElementById('data-canvas')
const status = document.getElementById('status')
const testModel = document.getElementById('test')
const loadHostedModel = document.getElementById('load-hosted-model')
const inferenceTimeMs = document.getElementById('inference-time-ms')
const trueObjectClass = document.getElementById('true-object-class')
const predictedObjectClass = document.getElementById('predicted-object-class')

const TRUE_BOUNDING_BOX_LINE_WIDTH = 2
const TRUE_BOUNDING_BOX_STYLE = 'rgb(255,0,0)'
const PREDICT_BOUNDING_BOX_LINE_WIDTH = 2
const PREDICT_BOUNDING_BOX_STYLE = 'rgb(0,0,255)'

@Component({
  selector: 'app-page-rooms',
  templateUrl: './page-rooms.component.html',
  styleUrls: ['./page-rooms.component.scss'],
})
export class PageRoomsComponent implements OnInit {
  constructor(public gameService: GameService, private socketService: SocketService, private elementRef: ElementRef) {}

  ngOnInit() {
    this.socketService.socket.on('screen-reader-update', (data: any) => {
      console.log(data)

      for (let i = 0; i < 99; i++) {
        //If we are over 66% sure we are sure we classified it right, draw it!
        const minY = data.data[i * 4] * vidHeight + yStart
        const minX = data.data[i * 4 + 1] * vidWidth + xStart
        const maxY = data.data[i * 4 + 2] * vidHeight + yStart
        const maxX = data.data[i * 4 + 3] * vidWidth + xStart
        const score = data.data[i * 3] * 100

        const width_ = (maxX - minX).toFixed(0)
        const height_ = (maxY - minY).toFixed(0)

        console.log(score)
        //If confidence is above 70%
        if (score > 70 && score < 100) {
          const highlighter = document.createElement('div') as any
          highlighter.setAttribute('class', 'highlighter')
          highlighter['style'] = 'left: ' + minX + 'px; ' + 'top: ' + minY + 'px; ' + 'width: ' + width_ + 'px; ' + 'height: ' + height_ + 'px;'
          highlighter.innerHTML = '<p>' + Math.round(score) + '% ' + 'Your Object Name' + '</p>'
          this.elementRef.nativeElement.appendChild(highlighter)
          // children.push(highlighter);
        }
      }

      // const boundingBoxArray = targetsArray.slice(1);
      // this.drawBoundingBoxes(canvas, boundingBoxArray, modelOut.slice(1));
    })
  }

  drawBoundingBoxes(canvas, trueBoundingBox, predictBoundingBox) {
    util.assert(trueBoundingBox != null && trueBoundingBox.length === 4, `Expected boundingBoxArray to have length 4, ` + `but got ${trueBoundingBox} instead` as any)
    util.assert(
      predictBoundingBox != null && predictBoundingBox.length === 4,
      `Expected boundingBoxArray to have length 4, ` + `but got ${trueBoundingBox} instead` as any
    )

    let left = trueBoundingBox[0]
    let right = trueBoundingBox[1]
    let top = trueBoundingBox[2]
    let bottom = trueBoundingBox[3]

    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = TRUE_BOUNDING_BOX_STYLE
    ctx.lineWidth = TRUE_BOUNDING_BOX_LINE_WIDTH
    ctx.moveTo(left, top)
    ctx.lineTo(right, top)
    ctx.lineTo(right, bottom)
    ctx.lineTo(left, bottom)
    ctx.lineTo(left, top)
    ctx.stroke()

    ctx.font = '15px Arial'
    ctx.fillStyle = TRUE_BOUNDING_BOX_STYLE
    ctx.fillText('true', left, top)

    left = predictBoundingBox[0]
    right = predictBoundingBox[1]
    top = predictBoundingBox[2]
    bottom = predictBoundingBox[3]

    ctx.beginPath()
    ctx.strokeStyle = PREDICT_BOUNDING_BOX_STYLE
    ctx.lineWidth = PREDICT_BOUNDING_BOX_LINE_WIDTH
    ctx.moveTo(left, top)
    ctx.lineTo(right, top)
    ctx.lineTo(right, bottom)
    ctx.lineTo(left, bottom)
    ctx.lineTo(left, top)
    ctx.stroke()

    ctx.font = '15px Arial'
    ctx.fillStyle = PREDICT_BOUNDING_BOX_STYLE
    ctx.fillText('predicted', left, bottom)
  }

  add() {
    this.gameService.create().subscribe((game: Game) => {
      this.gameService.start(game.id).subscribe((data: any) => {})
    })
  }

  stopAll() {
    this.gameService.removeAll().subscribe()
  }
}
