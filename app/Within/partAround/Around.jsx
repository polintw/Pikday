import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import IndexWrapper from './Index/Wrapper.jsx';

class Around extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.style={
      withinCom_Around_: {
        maxWidth: '99vw',
        boxSizing: 'border-box'
      },
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    <div
      style={this.style.withinCom_Around_}>
      <IndexWrapper {...this.props}/>
    </div>
  }
}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Around));
