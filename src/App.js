import React, { Component } from 'react'
import io from 'socket.io-client'
import './App.css'
import PixelGrid from './PixelGrid.js'
import ColorSelect from './ColorSelect.js'
import OnlineCount from './OnlineCount.js'
import ChatRoom from './ChatRoom.js'
// import { produce } from 'immer'

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
        <PixelGrid onPickColor={this.changeCurrentColor} currentColor={this.state.currentColor} socket={this.socket} />
        <span id="color-pick-placeholder"></span>
        <ColorSelect onChange={this.changeCurrentColor} color={this.state.currentColor} />
        <OnlineCount socket={this.socket} />
        <ChatRoom socket={this.socket} />
      </div>
    )
  }
}

export default App
