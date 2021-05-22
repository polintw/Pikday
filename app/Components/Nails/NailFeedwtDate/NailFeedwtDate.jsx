import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../../ImgPreview.jsx';
import DateConverter from '../../DateConverter.jsx';
import {
  domain
} from '../../../../config/services.js';

class NailFeedwtDate extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
      onNodeLink: false
    };
    this.nailImgBox = React.createRef();
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
    this._render_nails_Date = this._render_nails_Date.bind(this);
    this._render_ContentBox = this._render_ContentBox.bind(this);
    this.style={

    }
  }

  _render_nails_Date(){
    let showedTime = new Date(this.props.assignedDate);
    return (
      <div
        className={classnames(styles.boxNodes)}>
        <span
          className={classnames( 'colorEditBlack', 'fontSubtitle_h5')}
          style={{marginRight:'5px'}}>
            {"on "}
        </span>
        <DateConverter
          styles={{fontSize: '1.6rem', lineHeight: '1.5', color: '#545454'}}
          datetime={showedTime}/>
      </div>
    );
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    return(
      <div
        className={classnames(
          'plainLinkButton',
          styles.frame,
          styles.frmaeSmall,
          {[styles.frameOnMouse]: this.state.onFrame}
        )}
        onClick={(e)=>{if( !this.props.linkPath ){e.preventDefault();};/*a optional control, mean the parent want to take the refer control*/ }}
        onTouchStart={this._handleEnter_nailFrame}
        onTouchEnd={this._handleLeave_nailFrame}
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        {this._render_ContentBox()}
      </div>
    )
  }

  _render_ContentBox(){
    let contentBoxDOM = [];
    contentBoxDOM.push(contentBoxImg(this));
    contentBoxDOM.push(contentBoxDate(this));
    return contentBoxDOM;
  }

  _handleEnter_nailFrame(e){
    this.setState({onFrame: true})
  }

  _handleLeave_nailFrame(e){
    this.setState({onFrame: false})
  }

}

const contentBoxImg = (self)=>{
  let urlParams = new URLSearchParams(self.props.location.search); //we need value in URL query
  urlParams.delete('unitId'); // make sure only 1 unitId remain
  urlParams.append('unitId', self.props.unitId);
  urlParams.append('unitView', "theater");
  let imgSrcCover = domain.protocol+ '://'+domain.name+'/router/img/'+self.props.unitBasic.pic_layer0+'?type=thumb';

  return (
    <div
      key={"key_NailBoxImg_"+self.props.unitId}
      className={classnames(
        styles.boxContent,
        {[styles.boxContentMouseOn]: self.state.onFrame}
      )}>
      <Link
        ref={self.nailImgBox}
        to={{
          pathname: self.props.linkPath,
          search: urlParams.toString(),
          state: {from: self.props.location}
        }}
        className={styles.boxImg}>
        <ImgPreview
          blockName={''}
          previewSrc={ imgSrcCover }
          _handleClick_ImgPreview_preview={()=>{}}/>
      </Link>
    </div>
  )
};
const contentBoxDate = (self)=>{
  return (
    <div
      key={"key_NailBoxMarks_"+self.props.unitId}
      className={classnames(styles.boxRowBottom)}>
      <div>
        {self._render_nails_Date()}
      </div>
    </div>
  )
};

const mapStateToProps = (state)=>{
  return {
    unitCurrent: state.unitCurrent,
    nounsBasic: state.nounsBasic,
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(NailFeedwtDate));
