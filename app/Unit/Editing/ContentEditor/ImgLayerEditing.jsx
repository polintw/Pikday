import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class ImgLayerEditing extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidthHeight: false
    };
    this._set_imgSize = this._set_imgSize.bind(this);
  }


  render(){
    return(
      <div
        ref={this.Com_ImgLayer_box}>
        <img
          className={classnames('boxImgPosition', styles.boxImg)}
          ref={this.Com_ImgLayer_img}
          src={this.props.imgSrc}
          onLoad={this._set_imgSize}/>

      </div>
    )
  }

  _set_imgSize(){
    this.setState({imgWidthHeight:true});
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    unitSubmitting: state.unitSubmitting
  }
}

export default connect(
  mapStateToProps,
  null
)(ImgLayerEditing);
