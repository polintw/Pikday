import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgLayerEditing from './ImgLayerEditing.jsx';

class ContentEditor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidth: "",
      imgHeight: "",
    };
  }

  componentDidMount(){

  }

  render(){
    return(
      <div
        className={classnames(styles.comContentEditor)}>
        <ImgLayerEditing
          imgSrc={this.props.imgSrc}/>
      </div>

    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentEditor));
