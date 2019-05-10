import React, { Component } from 'react'
import ReactDom from 'react-dom'

var canvasStyle = {
  display: 'block',
  transformOrigin: 'top left',
  boxShadow: '0px 0px 3px black',
  isPickingColor: false
}

function getMousePosition(e) {
  var layerX = e.layerX
  var layerY = e.layerY
  var zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1]
  return [Math.floor(layerX / zoom), Math.floor(layerY / zoom)]
}

function createImageFromArrayBuffer(buf) {
  return new Promise(resolve => {
    var blob = new Blob([buf], {type: 'image/png'}) 
    var url = URL.createObjectURL(blob)
    var image = new Image()
    image.onload = function () {
      resolve(image)
    }
    image.src = url
  })
}

class PixelGrid extends Component {
  constructor(props) {
    super(props)
    this.socket = this.props.socket
    this.canvas = null
    this.state = {
      zoomLevel: 1,
      dotHoverX: -1, 
      dotHoverY: -1,
      width: 0,
      height: 0,
    }
  }

  setUpZoomHandler = () => {
    this.canvas.addEventListener('mousewheel', e => {
      var mouseLayerX = e.layerX
      var mouseLayerY = e.layerY
      var oldZoomLevel = this.state.zoomLevel
      var newZoomLevel
      if (e.deltaY < 0) {
        newZoomLevel = this.state.zoomLevel + 1
      } else {
        newZoomLevel = this.state.zoomLevel - 1
      }

      var a = oldZoomLevel
      var b = newZoomLevel
      var x = mouseLayerX
      var y = mouseLayerY
      
      var l1 = parseFloat(this.canvasWrapper.style.left)
      var t1 = parseFloat(this.canvasWrapper.style.top)

      var l2 = l1 - (b / a - 1) * x  // 用transform放大
      var t2 = t1 - (b / a - 1) * y

      // var l2 = (l1 * a - (b / a - 1) * x) / b // 用zoom属性放大
      // var t2 = (t1 * a - (b / a - 1) * y) / b
      
      if(newZoomLevel < 1) {  // 缩放级别小于1时复位
        newZoomLevel = 1
        l2 = 0
        t2 = 0
      }

      this.canvasWrapper.style.left = l2 + 'px'
      this.canvasWrapper.style.top = t2 + 'px'

      this.setState({
        zoomLevel: newZoomLevel
      })
      e.preventDefault()
    })
  }

  setUpDragHandler = () => {
    var initialLeft 
    var initialTop
    var mouseInitialX
    var mouseInitialY
    var mouseMoveX
    var mouseMoveY
    var dragging = false
    this.canvasWrapper.addEventListener('mousedown', e => {
      initialLeft = parseFloat(this.canvasWrapper.style.left)
      initialTop = parseFloat(this.canvasWrapper.style.top)
      mouseInitialX = e.clientX
      mouseInitialY = e.clientY
      dragging = true
    })
    this.canvas.addEventListener('mousemove', e => {
      var y = Math.floor(e.layerY / this.state.zoomLevel)
      var x = Math.floor(e.layerX / this.state.zoomLevel)
      this.setState({
        dotHoverX: x,
        dotHoverY: y,
      })
    })
    window.addEventListener('mousemove', e => {
      if (dragging) {
        var mouseX = e.clientX
        var mouseY = e.clientY
        mouseMoveX = mouseX - mouseInitialX
        mouseMoveY = mouseY - mouseInitialY

        var left = initialLeft + mouseMoveX
        var top = initialTop + mouseMoveY
        // var left = initialLeft + mouseMoveX / this.state.zoomLevel
        // var top = initialTop + mouseMoveY / this.state.zoomLevel
        this.canvasWrapper.style.left = left + 'px'
        this.canvasWrapper.style.top = top + 'px'
      } else {

      }
    })
    window.addEventListener('mouseup', e => {
      dragging = false
    })
    this.canvasWrapper.addEventListener('mouseup', e => {
      dragging = false
      var mouseMoveDistance = Math.sqrt(mouseMoveX * mouseMoveX + mouseMoveY * mouseMoveY)
      if (mouseMoveDistance < 3 && !this.state.isPickingColor) {
        this.handleDotClick(e)
      }
    })
  }

  setUpPickColorHandler = () => {
    function makeCursor(color) {
      var cursor = document.createElement('canvas')
      var ctx = cursor.getContext('2d')

      cursor.width = 41
      cursor.height = 41
  
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#000000'
      ctx.moveTo(0, 6)
      ctx.lineTo(12, 6)
      ctx.moveTo(6, 0)
      ctx.lineTo(6, 12)
      ctx.stroke()
  
      ctx.beginPath()
      ctx.arc(25, 25, 14, 0, 2 * Math.PI, false)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#000000'
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(25, 25, 13.4, 0, 2 * Math.PI, false)
      ctx.fillStyle = color
      ctx.fill()
      return cursor.toDataURL()
      // document.getElementById('canvas').style.cursor = 'crosshair';
      // document.getElementById('canvas').style.cursor = 'url(' + cursor.toDataURL() + ') 6 6, crosshair';
    }
    this.canvas.addEventListener('mousemove', e => {
      if (this.state.isPickingColor) {
         var [x, y] = getMousePosition(e)
         var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data)
         var pixelColorCss = 'rgba(' + pixelColor + ')'
         var cursorUrl = makeCursor(pixelColorCss)
         var temp = `url(${cursorUrl}) 6 6, crosshair`
         this.canvas.style.cursor = temp
      }
    })
    this.canvas.addEventListener('click', e => {
      if(this.state.isPickingColor) {
        var [x, y] = getMousePosition(e)
        var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data)
        var hexColor = '#' + pixelColor.slice(0, 3).map(it => {return it.toString(16).padStart(2, '0')}).join('')
        this.props.onPickColor(hexColor)
        this.setState({
          isPickingColor: false
        })
        this.canvas.style.cursor = ''
      }
    })
  }

  handleDotClick = (e) => {
    // 找到元素的坐标发回去
    console.log(e)
    var layerX = e.layerX
    var layerY = e.layerY
    var row = Math.floor(layerY / this.state.zoomLevel)
    var col = Math.floor(layerX / this.state.zoomLevel)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }

  componentDidMount() {
    this.setUpZoomHandler()
    this.setUpDragHandler()
    this.setUpPickColorHandler()

    console.log('pixel grid did mound')
    this.canvas.style.imageRendering = 'pixelated'
    this.ctx = this.canvas.getContext('2d')

    this.socket.on('initial-pixel-data', async pixelData => {
      console.log(pixelData.byteLength)
      var image = await createImageFromArrayBuffer(pixelData)
      this.canvas.width = image.width
      this.canvas.height = image.height
      this.setState({
        width: image.width,
        height: image.height,
      })
      this.ctx.drawImage(image, 0, 0)
      this.forceUpdate()
    })

    this.socket.on('update-dots', (dots) => {
      dots.forEach(({row, col, color}) => {
        this.draw(row, col, color)
      })
    })
  }

  draw = (row, col, color) => {
    this.ctx.fillStyle = color
    this.ctx.fillRect(col, row, 1, 1)
  }

  setPickColor = () => {
    this.setState({
      isPickingColor: true,
    })
  }

  renderPickColorBtn() {
    var el = document.getElementById('color-pick-placeholder')
    if (!el) {
      return null
    } else {
      return ReactDom.createPortal((
        <button onClick={this.setPickColor}>
          {this.state.isPickingColor ? '正在取色' : '取色'}
        </button>
      ), el)
    }
  }

  render() {
    // console.log('pixel grid render')
    return (
      <div style={{
        position: 'relative', 
        overflow: 'hidden', 
        width: this.state.width, 
        height: this.state.height, 
        display: 'inline-block', 
        border: '1px solid'
      }}>
        {this.renderPickColorBtn()}
        <div ref={el => this.canvasWrapper = el} className="canvas-wrapper" style={{position:'absolute', top: 0, left: 0}}>
          <span className="dot-hover-box" style={{
            zIndex: 5,
            position: 'absolute',
            boxShadow: '0 0 1px black', 
            pointerEvents: 'none', 
            width: this.state.zoomLevel + 'px', 
            height: this.state.zoomLevel + 'px', 
            top: this.state.dotHoverY * this.state.zoomLevel + 'px',
            left: this.state.dotHoverX * this.state.zoomLevel + 'px',
          }}></span>
          <canvas
            style={{...canvasStyle, transform: 'scale(' + this.state.zoomLevel + ')'}} 
            // style={{...canvasStyle, zoom: this.state.zoomLevel}}
            ref={el => this.canvas = el}>
          </canvas>
        </div>
      </div>
    )
  }
}

export default PixelGrid