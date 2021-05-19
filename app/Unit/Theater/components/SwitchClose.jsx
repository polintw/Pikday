import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import SvgIconClose from '../../../Components/Svg/SvgIcon_Close.jsx';

class SwitchClose extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onIconClose: false
    };
    this._handleEnter_Icon = this._handleEnter_Icon.bind(this);
    this._handleLeave_Icon = this._handleLeave_Icon.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div
        style={{display: 'inline-block', width: '20px'}}
        onClick={(event)=>{ event.stopPropagation(); event.preventDefault(); this.props._handle_Close();}}
        onTouchStart={this._handleEnter_Icon}
        onTouchEnd={this._handleLeave_Icon}
        onMouseEnter={this._handleEnter_Icon}
        onMouseLeave={this._handleLeave_Icon}>
        <SvgIconClose
          style={{
            fill: this.state.onIconClose ? "#FFFFFF" : "#b8b8b8"
          }}/>
      </div>
    )
  }

  _handleEnter_Icon(event){
    this.setState({
      onIconClose: true
    })
  }

  _handleLeave_Icon(event){
    this.setState({
      onIconClose: false
    })
  }
}

const mapStateToProps = (state)=>{
  return {

  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchClose));
