import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Layers from './Layers.jsx';
import LayersSmall from './LayersSmall.jsx';

class Theater extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.unitInit = this.props._construct_UnitInit(this.props.match, this.props.location);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    let params = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = params.get('unitId');
    // modification for small screen
    let cssVW = window.innerWidth; // px of vw in pure integer

    return(
      <div
        className={classnames(styles.comTheater)}>
        <div
          className={classnames(styles.boxTheaterLayers, styles.boxTheaterLayersSmall)}
          onClick={(event) => { event.stopPropagation(); }}>
          <LayersSmall
            {...this.props}
            initStatus={this.unitInit}/>
        </div>
        <div
          className={classnames(styles.boxTheaterLayers, styles.boxTheaterLayersRegular)}
          onClick={(event) => { event.stopPropagation(); }}>
          <Layers
            {...this.props}
            initStatus={this.unitInit}/>
        </div>
        <div
          className={classnames(styles.boxLayerSwitch)}
          onClick={(event) => { if(cssVW > 860 ) event.stopPropagation(); }}>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Theater));
