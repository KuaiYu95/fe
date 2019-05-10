import React, { PureComponent } from 'react'


class Dot extends PureComponent {
  render() {
    console.log('dot render')
    // return <td onClick={() => props.onClick(props.row, props.col)} style={{width: '5px', height: '5px', backgroundColor: props.color}}></td>
    return <td onClick={() => this.props.onClick(this.props.row, this.props.col)} 
               style={{width: '5px', height: '5px', backgroundColor: this.props.color}}>
           </td>
  }
}


export default Dot 