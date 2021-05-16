import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ImgPreview from '../../ImgPreview.jsx';
import SvgPin from '../../Svg/SvgPin.jsx';
import {
  domain
} from '../../../../config/services.js';

class NailFeedwtNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onFrame: false,
      onNodeLink: false
    };
    this.nailImgBox = React.createRef();
    this._handleEnter_nailFrame = this._handleEnter_nailFrame.bind(this);
    this._handleLeave_nailFrame = this._handleLeave_nailFrame.bind(this);
    this._handleEnter_nailNode = this._handleEnter_nailNode.bind(this);
    this._handleLeave_nailNode = this._handleLeave_nailNode.bind(this);
    this._render_nails_nouns = this._render_nails_nouns.bind(this);
    this._render_ContentBox = this._render_ContentBox.bind(this);
    this.style={

    }
  }

  _render_nails_nouns(){
    /*
    this hidden part, was the original from Cornerth.
    let customNodesTitle = !!this.props.customNodesTitle ? this.props.customNodesTitle : null;
    let nodesDOM = [];
    if(!!customNodesTitle){ nodesDOM = renderNodesRowsCustom(this.props, customNodesTitle)} // currently only GuideNails using, so render without check
    else nodesDOM = renderNodesRows(this.props, styles);*/

    return (
      <div
        className={classnames(styles.boxNodes)}>
        <span
          className={classnames( 'colorEditLightBlack', 'fontSubtitle_h5')}>
          {this.props.i18nUIString.catalog['text_at']}
        </span>
        <div
          className={classnames(styles.boxTitlePin)}>
          <div
            style={{width: "11px", height: "16px"}}>
            <SvgPin
              mouseOn={this.state.onNodeLink}/>
          </div>
        </div>
        <Link
          to={"/cosmic/explore/node?nodeid=" + this.props.unitBasic.nounsList[0]}
          className={classnames('plainLinkButton')}
          eventkey={"mouseEvKey_node_" + this.props.unitId + "_" + this.props.unitBasic.nounsList[0]}>
          {(this.props.unitBasic.nounsList[0] in this.props.nounsBasic) &&
            <span
              className={classnames(
                "fontNodesEqual", "weightBold", "colorEditBlack",
                styles.spanBaseNode,
                { [styles.spanBaseNodeMouse]: this.state.onNodeLink }
              )}>
              {this.props.nounsBasic[this.props.unitBasic.nounsList[0]].name}</span>
          }
        </Link>
        <span
          className={classnames("fontNodesEqual", "colorEditBlack", "weightBold")}>
          {this.props.unitBasic.nounsList[0] in this.props.nounsBasic ? (
            (this.props.nounsBasic[this.props.unitBasic.nounsList[0]].prefix.length > 0) &&
            (", ")) : (null)
          }
        </span>
        <br/>
        {
          (this.props.unitBasic.nounsList[0] in this.props.nounsBasic &&
            this.props.nounsBasic[this.props.unitBasic.nounsList[0]].prefix.length > 0) &&
          <div
            className={classnames('plainLinkButton')}
            style={{display: 'inline-block'}}
            eventkey={"mouseEvKey_node_" + this.props.unitId + "_prefix_" + this.props.nounsBasic[this.props.unitBasic.nounsList[0]].parentId}>
              <span
                className={classnames("fontSubtitle", "weightBold", "colorEditBlack")}>
                {this.props.nounsBasic[this.props.unitBasic.nounsList[0]].prefix}</span>
          </div>
        }
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
        onMouseEnter={this._handleEnter_nailFrame}
        onMouseLeave={this._handleLeave_nailFrame}>
        {this._render_ContentBox()}
      </div>
    )
  }

  _render_ContentBox(){
    let contentBoxDOM = [];
    contentBoxDOM.push(contentBoxImg(this));
    contentBoxDOM.push(contentBoxMarks(this));
    return contentBoxDOM;
  }

  _handleEnter_nailFrame(e){
    this.setState({onFrame: true})
  }

  _handleLeave_nailFrame(e){
    this.setState({onFrame: false})
  }

  _handleEnter_nailNode(e){
    this.setState({onNodeLink: true})
  }

  _handleLeave_nailNode(e){
    this.setState({onNodeLink: false})
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
      className={classnames(styles.boxContent)}
      style={{minWidth: "30.8vw"}}>
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
const contentBoxMarks = (self)=>{
  return (
    <div
      key={"key_NailBoxMarks_"+self.props.unitId}
      className={classnames(styles.boxContentMobile)}>
      <div
        className={classnames(styles.boxTitle)}>
        {self._render_nails_nouns()}
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
)(NailFeedwtNodes));
