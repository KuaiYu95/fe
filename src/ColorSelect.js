import React from 'react'

var colors = ['#ffffff', '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#800080']
var ulStyle = {
  margin: 0,
  padding: 0, 
}
var liStyle = {
  float: 'left',
  listStyle: 'none'
}
var btnStyle = {
  width: '4em',
  height: '3em',
  margin: '10px',
}

var pickColor = {
  width: '180px',
  height: '40px',
}

function ColorSelect(props) {
  return (
    <div>
      <ul style={ulStyle}>
        {
          colors.map(color => (
            <li style={liStyle} key={color}>
              <button className="btn" onClick={() => props.onChange(color)} style={{...btnStyle, backgroundColor: color}}></button>
            </li>
          ))
        }
      </ul>
      <div style={{float: 'left'}}>
        <span style={{paddingLeft: '10px', color: props.color, fontWeight:"bolder"}}>选色：</span>
        <input className="btn" style={pickColor} type="color" value={props.color} onChange={(e) => {props.onChange(e.target.value)}} />
      </div>
    </div>
  )
}

export default ColorSelect