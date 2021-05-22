import React from 'react';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';

class ImgLayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      imgWidthHeight: false
    };
    this.Com_ImgLayer_box = React.createRef();
    this.Com_ImgLayer_img = React.createRef();
    this._set_imgSize = ()=>{this.setState({imgWidthHeight:true})};
  }

  render(){
    return(
      <div
        ref={this.Com_ImgLayer_box}
        className={classnames(styles.comImgLayer)}>
        {
          this.state.imgWidthHeight &&
          <div
            className={classnames(styles.boxSmallRelative)}
            style={{height: this.Com_ImgLayer_img.current.clientHeight}}/>
        }
        <img
          className={classnames(
            'boxImgPosition', styles.boxImg)}
          ref={this.Com_ImgLayer_img}
          src={this.props.imgSrc}
          onLoad={this._set_imgSize}/>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    unitCurrent: state.unitCurrent,
  }
}

export default connect(
  mapStateToProps,
  null
)(ImgLayer);
