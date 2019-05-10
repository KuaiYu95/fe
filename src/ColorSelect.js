import React from 'react'

var colors = ['#ffffff', '#000000', '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#800080']
var ulStyle = {
  margin: 0,
  padding: 0, 
}
var liStyle = {
  float: 'left',
  listStyle: 'none'
}
var btnStyle = {
  width: '1em',
  height: '1em',
}

function ColorSelect(props) {
  return (
    <div>
      <input type="color" value={props.color} onChange={(e) => {props.onChange(e.target.value)}} />
      <ul style={ulStyle}>
        {
          colors.map(color => (
            <li style={liStyle} key={color}>
              <button onClick={() => props.onChange(color)} style={{...btnStyle, backgroundColor: color}}></button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ColorSelect