import React from 'react';

export default class SvgIcon_Close extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383.01 407.01"
        style={Object.assign({}, {
          height: '100%',
          maxWidth: '100%',
          position: 'relative',
          boxSizing: 'border-box'
        })}>
        <g id="圖層_2" data-name="圖層 2">
          <g id="圖層_1-2" data-name="圖層 1">
            <rect
              x="167.05" y="-64.06" width="48.91" height="535.14" rx="21.37" transform="translate(190.24 -75.94) rotate(43)"
              fill={this.props.style.fill}/>
            <rect
              x="167.05" y="-64.06" width="48.91" height="535.14" rx="21.37" transform="translate(-87.34 185.28) rotate(-43)"
              fill={this.props.style.fill}/>
          </g>
        </g>
      </svg>
    )
  }
}
