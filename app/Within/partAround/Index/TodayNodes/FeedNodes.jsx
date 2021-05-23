import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import FeedNodesEmpty from './FeedNodesEmpty.jsx';
import {_axios_get_nodesList} from '../utils.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class FeedNodes extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      nodesList: [],
      nextFetchBasedTime: null,
      scrolled: true,
      onBtn: null
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_nodesFeed = this._set_nodesFeed.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNodes = this._render_FeedNodes.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
    this._handleEnter_Btn = this._handleEnter_Btn.bind(this);
    this._handleLeave_Btn = this._handleLeave_Btn.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_nodesFeed();
    window.addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_FooterHint(){
    // by feed length, we gave users some message about the thing they could do
    if (this.state.nodesList.length> 0){
      return (
        <div>
          <span
            className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
            {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}
          </span>
        </div>
      );
    }
    else{ // most reason to:no feed at all
      return null;
    }
  }

  _render_FeedNodes(){
    let groupsDOM = [];
    const _nodesByGroup = (nodesGroup, groupIndex)=>{
      let nodesDOM = [];
      nodesGroup.forEach((nodeId, index) => {
        //render if there are something in the data
        if( !(nodeId in this.props.nounsBasic)) return; //skip if the info of the unit not yet fetch

        nodesDOM.push (
          <Link
            key={"key_NodeFeed_new_"+index}
            to={ "/cosmic/explore/node?nodeid=" + nodeId }
            nodeid={nodeId}
            className={classnames(
              "plainLinkButton", styles.boxModuleItem,
              {[styles.boxModuleItemMouseOn]: this.state.onBtn == nodeId}
            )}
            onTouchStart={this._handleEnter_Btn}
            onTouchEnd={this._handleLeave_Btn}
            onMouseEnter={this._handleEnter_Btn}
            onMouseLeave={this._handleLeave_Btn}>
            <span
              className={classnames(
                "fontSubtitle_h5", "weightBold", styles.spanModuleItem,
                {
                  [styles.spanModuleItemMouseOn]: this.state.onBtn == nodeId,
                  ["colorGrey"]: this.state.onBtn != nodeId,
                  ["colorEditBlack"]: this.state.onBtn == nodeId,
                  ["weightBold"]: this.state.onBtn == nodeId
                }
              )}>
              {this.props.nounsBasic[nodeId].name}
            </span>
            <span
              className={classnames(
                "fontSubtitle_h5", "weightBold", styles.spanModuleItem,
                {
                  [styles.spanModuleItemMouseOn]: this.state.onBtn == nodeId,
                  ["colorGrey"]: this.state.onBtn != nodeId,
                  ["colorEditBlack"]: this.state.onBtn == nodeId,
                  ["weightBold"]: this.state.onBtn == nodeId
                }
              )}>
              {
                (this.props.nounsBasic[nodeId].prefix.length > 0) &&
                (", " + this.props.nounsBasic[nodeId].prefix)
              }
            </span>
          </Link>
        );
      });

      return nodesDOM;
    };

    this.state.nodesList.forEach((nodesGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_PathProject_nodesGroup"+index}
          className={classnames(
            styles.boxModuleCenter,
          )}>
          {_nodesByGroup(nodesGroup, index)}
        </div>
      );
    });

    return groupsDOM;
  }

  render(){
    return (
      <div className={styles.comFocusBoardFeed}>
        {
          (this.state.nodesList.length > 0) &&
          <div
            className={classnames(
              styles.boxRow
            )}>
            {this._render_FeedNodes()}
          </div>
        }
        {
          ((this.state.nodesList.length == 0) &&
            !this.state.scrolled &&
            !this.state.axios
          ) &&
          <div
            className={classnames(
              styles.boxModuleCenter,
              styles.boxRow
            )}>
            <FeedNodesEmpty
              {...this.props}/>
          </div>
        }

        <div ref={this.refScroll}/>
        <div
          className={classnames(styles.boxRow, styles.boxFooter)}>
          {this._render_FooterHint()}
        </div>
      </div>
    )
  }

  _check_Position(){
    let boxScrollBottom = this.refScroll.current.getBoundingClientRect().bottom, //bottom related top of viewport of box Scroll
        windowHeightInner = window.innerHeight; //height of viewport
    //now, the bottom would change base on scroll, and calculate from the top of viewport
    //we set the threshould of fetch to the 2.5 times of height of viewport.
    //But! we only fetch if we are 'not' fetching--- check the axios status.
    if(!this.state.axios &&
      boxScrollBottom < (2.5*windowHeightInner) &&
      boxScrollBottom > windowHeightInner && // safety check, especially for the very beginning, or nothing in the list
      this.state.scrolled // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_nodesFeed();
    }
  }

  _set_nodesFeed(nextFetchBasedTime){
    // feeds was selected by the last unit get last round
    nextFetchBasedTime = !!this.state.nextFetchBasedTime ? this.state.nextFetchBasedTime : new Date();
    const self = this;
    this.setState({axios: true});
    let now = new Date();
    let dateString = now.toDateString();

    _axios_get_nodesList(this.axiosSource.token, {
      basedTime: nextFetchBasedTime,
      dateString: dateString
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nodesList);

      self.setState((prevState, props)=>{
        let copyList = prevState.nodesList.slice();
        if(resObj.main.nodesList.length > 0) copyList.push(resObj.main.nodesList);
        return {
          axios: false,
          nodesList: copyList,
          nextFetchBasedTime: resObj.main.nextFetchBasedTime,
          scrolled: resObj.main.scrolled
        }
      });
    })
    .catch(function (thrown) {
      self.setState({axios: false});
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
  }

  _handleEnter_Btn(e){
    let nodeId = e.currentTarget.getAttribute('nodeid');
    this.setState({onBtn: nodeId});
  }

  _handleLeave_Btn(e){
    this.setState({onBtn: false})
  }

}

const mapStateToProps = (state)=>{
  return {
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_NounsList_new: (arr) => { dispatch(handleNounsList(arr)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedNodes));
