import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import FeedEmpty from './FeedEmpty.jsx';
import NailFeedwtNone from '../../../../Components/Nails/NailFeedwtNone/NailFeedwtNone.jsx';
import {_axios_get_accumulatedList} from '../axios.js';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";

class Feed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      feedList: [],
      unitsBasic: {},
      scrolled: true
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    this._set_feedUnits();
    window.addEventListener("scroll", this._check_Position);
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    window.removeEventListener("scroll", this._check_Position);
  }

  _render_FeedNails(){
    const _render_Nail = (loopDate, loopMonth)=>{
      let targetUnitId = this.state.feedList[latestUnitInfo.groupIndex][latestUnitInfo.indexInGroup].unitId;
      if( !(targetUnitId in this.state.unitsBasic)) return null; //skip if the info of the unit not yet fetch
      return (
        <div
          key={"key_Calendar_Feed_"+targetUnitId}
          className={classnames(styles.boxDateandNail)}>
          <div
            className={classnames(styles.boxCalendarNailDate)}>
            <span
              className={classnames("fontNodesEqual", "weightBold", "colorEditBlack")}>
              {loopMonth}
            </span>
            <span
              className={classnames("fontNodesEqual", "weightBold", "colorEditBlack")}>
              {". "}</span>
            <span
              className={classnames("fontNodesEqual", "weightBold", "colorEditBlack")}>
              {loopDate}
            </span>
          </div>
          <div
            className={classnames(stylesNail.boxNail)}
            style={{margin: '8px 0 0'}}>
            <NailFeedwtNone
              {...this.props}
              unitId={targetUnitId}
              linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
              unitBasic={this.state.unitsBasic[targetUnitId]} />
          </div>
        </div>
      );
    };

    let groupsDOM = [];
    const currentTime = new Date(); // start from 'now'
    let currentTimeWeekEarly = new Date();
    currentTimeWeekEarly.setDate(currentTime.getDate() -7);
    let currentLoopDate = new Date(currentTime.toDateString());
    let latestUnitDate = false; // default a bool 'false' to control while() loop
    let latestUnitInfo = { // count info inside loop
      groupIndex: 0,
      indexInGroup: 0
    };
    // before all start, set the first one to the latestUnitDate
    if(this.state.feedList.length > 0){
      latestUnitDate = new Date(this.state.feedList[0][0].assignedDate); // 'assignedDate' is a time obj directly from db
    };
    while(
      (latestUnitDate && (latestUnitDate.getTime() - 86400000) < currentLoopDate.getTime()) || // we have unit can render
      currentLoopDate > currentTimeWeekEarly // at least 7 day even no unit at all
    ){
      let loopDate = currentLoopDate.getDate();
      let loopMonth = currentLoopDate.getMonth() + 1;
      if(latestUnitDate.toDateString() == currentLoopDate.toDateString()){
        groupsDOM.push(
          <div
            key={"key_Shareds_FeedGroup_"+latestUnitInfo.groupIndex + '_'+ latestUnitInfo.indexInGroup}>
            {_render_Nail(loopDate, loopMonth)}
          </div>
        );
      }
      else if( currentLoopDate.getDate() > currentTime.getDate() - 30 ){ // 30 day the most for blank date
        groupsDOM.push(
          <div
            key={"key_Shareds_FeedGroup_"+ loopMonth + "_" + loopDate}>
            <div
              className={classnames(
                styles.boxDateandNail, styles.boxDatewtNoNail)}
              style={{margin: '12px 0 8px'}}>
              <div
                className={classnames(styles.boxCalendarNailDate)}>
                <span
                  className={classnames("fontContent", "weightBold", "colorLightGrey")}>
                  {loopMonth}
                </span>
                <span
                  className={classnames("fontContent", "weightBold", "colorLightGrey")}>
                  {". "}</span>
                <span
                  className={classnames("fontContent", "weightBold", "colorLightGrey")}>
                  {loopDate}
                </span>
              </div>
            </div>
          </div>
        );
      };
      if(latestUnitDate.toDateString() == currentLoopDate.toDateString()){ // check first before loopdate was reset
        if( // not yet to the last unit
          latestUnitInfo.groupIndex != (this.state.feedList.length -1) ||
          latestUnitInfo.indexInGroup != (this.state.feedList[latestUnitInfo.groupIndex].length -1)
        ){
          let nextGroupify = (latestUnitInfo.indexInGroup == this.state.feedList[latestUnitInfo.groupIndex].length -1) ? true : false;
          latestUnitInfo = {
            groupIndex: nextGroupify ? latestUnitInfo.groupIndex +1 : latestUnitInfo.groupIndex,
            indexInGroup: nextGroupify ? 0 : latestUnitInfo.indexInGroup +1
          };
          // we now assure there 'is' a next unit, set the new latestUnitDate
          latestUnitDate = new Date(this.state.feedList[latestUnitInfo.groupIndex][latestUnitInfo.indexInGroup].assignedDate);
        };
      };
      currentLoopDate.setDate(currentLoopDate.getDate() -1 );
    }

    return groupsDOM;
  }

  render(){
    return (
      <div className={styles.comSharedsFeed}>
        {
          (this.state.feedList.length > 0) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
            )}>
            {this._render_FeedNails()}
          </div>
        }
        {
          ((this.state.feedList.length == 0) &&
            !this.state.scrolled &&
            !this.state.axios
          ) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
            )}>
            <FeedEmpty
              {...this.props}/>
          </div>
        }

        <div ref={this.refScroll}/>
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
      this._set_feedUnits();
    }
  }

  _set_feedUnits(lastUnitTime){
    // feeds was selected by the last unit get last round
    if(!lastUnitTime && this.state.feedList.length > 0){ //only set the lastUnitTime again after the list had alreadyhad something
      let group, groupLength;
      let list = this.state.feedList;
      group = list[list.length-1];
      groupLength = group.length;
      lastUnitTime = this.state.unitsBasic[group[groupLength-1].unitId].createdAt;
    };

    const self = this;
    this.setState({axios: true});
    let paramsObj = {
      listUnitBase: lastUnitTime,
    };
    _axios_get_accumulatedList(this.axiosSource.token, paramsObj)
    .then((resObj)=>{
      // resObj: { unitsObjList: [{}], unitsList: [], scrolled: bool }
      if(resObj.main.unitsObjList.length > 0){
        self.setState((prevState, props)=>{
          let copyList = prevState.feedList.slice();
          copyList.push(resObj.main.unitsObjList);
          return {
            feedList: copyList,
            scrolled: resObj.main.scrolled
          }
        });
        return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList);
      }
      else{
        self.setState({scrolled: resObj.main.scrolled}) // don't forget set scrolled to false to indicate the list was end
        return { //just a way to deal with the next step, stop further request
          main: {
            nounsListMix: [],
            unitsBasic: {},
          }}
        };
    })
    .then((resObj)=>{
      //after res of axios_Units: call get nouns & users
      self.props._submit_NounsList_new(resObj.main.nounsListMix);
      //and final, update the data of units to state
      self.setState((prevState, props)=>{
        return ({
          axios: false,
          unitsBasic: {...prevState.unitsBasic, ...resObj.main.unitsBasic},
        });
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
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
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
)(Feed));
