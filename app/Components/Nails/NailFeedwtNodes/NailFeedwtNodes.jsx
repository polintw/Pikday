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
          className={classnames( 'colorEditBlack', 'fontSubtitle_h5')}>
          {this.props.i18nUIString.catalog['text_at']}
        </span>
        <div
          className={classnames(styles.boxTitlePin)}>
          <div
            style={{ height: "16px"}}>
            <SvgPin
              customStyles={{fillColor: '#ff8168'}}
              mouseOn={this.state.onNodeLink}/>
          </div>
        </div>
        <div>
          <Link
            to={"/cosmic/explore/node?nodeid=" + this.props.unitBasic.nounsList[0]}
            nodeid={this.props.unitBasic.nounsList[0]}
            className={classnames('plainLinkButton')}
            onTouchStart={this._handleEnter_nailNode}
            onTouchEnd={this._handleLeave_nailNode}
            onMouseEnter={this._handleEnter_nailNode}
            onMouseLeave={this._handleLeave_nailNode}>
            {(this.props.unitBasic.nounsList[0] in this.props.nounsBasic) &&
              <span
                className={classnames(
                  "fontNodesEqual", "weightBold", "colorEditBlack",
                  styles.spanBaseNode,
                  { [styles.spanBaseNodeMouse]: this.state.onNodeLink == this.props.unitBasic.nounsList[0] }
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
                style={{display: 'inline-block'}}>
                <span
                  className={classnames("fontSubtitle", "weightBold", "colorEditBlack")}>
                  {this.props.nounsBasic[this.props.unitBasic.nounsList[0]].prefix}</span>
              </div>
            }
        </div>
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
    contentBoxDOM.push(contentRowBottom(this));
    return contentBoxDOM;
  }

  _handleEnter_nailFrame(e){
    this.setState({onFrame: true})
  }

  _handleLeave_nailFrame(e){
    this.setState({onFrame: false})
  }

  _handleEnter_nailNode(e){
    let nodeID = e.currentTarget.getAttribute('nodeid');
    this.setState({onNodeLink: nodeID})
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
const contentRowBottom = (self)=>{
  return (
    <div
      key={"key_NailBoxMarks_"+self.props.unitId}
      className={classnames(styles.boxRowBottom)}>
      <div>
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
