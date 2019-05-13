import React, { useRef } from 'react'

function ChatRoom({socket}) {
  var msgsRef = useRef()
  var inputRef = useRef()
  socket.on('chat-msg', msg => {
    if(msg) {
      msgsRef.current.innerHTML = new Date().toLocaleString() + '<br>' + msg + '<br>' + msgsRef.current.innerHTML
    }
  })
  function sendMsg() {
    var msg = inputRef.current.value
    inputRef.current.value = ''
    socket.emit('chat-msg', msg)
  }
  return (
    <div>
      <div style={{float: 'left', marginTop: '-20px', marginLeft: '10px', color: '#672200', fontWeight: 'bold'}}>聊天室</div>
      <input style={{display: 'inline-block', margin: '15px 10px 10px -75px'}} 
        className="form-control col-sm-3" ref={inputRef} type="text" />
      <button style={{display: 'inline-block'}} 
        className="btn btn-success" onClick={sendMsg}>发送</button>
      <div style={{
        textAlign: 'left',
        marginRight: '27px',
        padding: '20px',
        float: 'right', 
        border: '2px solid #ded', 
        width: '315px', 
        height: '338px',
        overflowY: 'auto',
        fontFamily: 'Roboto, sans-serif',}} 
        ref={msgsRef}></div>
    </div>
  )
}

export default ChatRoom