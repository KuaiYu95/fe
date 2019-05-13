import React, { Component } from 'react'
import io from 'socket.io-client'
import './App.css'
import './bootstrap.min.css'
import PixelGrid from './PixelGrid.js'
import ColorSelect from './ColorSelect.js'
import OnlineCount from './OnlineCount.js'
import ChatRoom from './ChatRoom.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: '#ff0000'
    }
    this.socket = io()
  }
  componentDidMount() { 
    
  }

  handlePixelClick = (row, col) => {
    
  }

  changeCurrentColor = (color) => {
    console.log(color)
    this.setState({
      currentColor: color
    })
  }

  render() {
    return (
      <div>
        <div className="pixel-grid">
          <PixelGrid onPickColor={this.changeCurrentColor} currentColor={this.state.currentColor} socket={this.socket} />
        </div>
        <div className="pick-color">
          <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor} />
          <span id="color-pick-placeholder"></span>
        </div>
        <div className="chat">
          <OnlineCount socket={this.socket} />
          <ChatRoom socket={this.socket} />
        </div>
      </div>
    )
  }
}

export default App
