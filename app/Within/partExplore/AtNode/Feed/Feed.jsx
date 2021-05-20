import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import NailFeedwtNone from '../../../../Components/Nails/NailFeedwtNone/NailFeedwtNone.jsx';
import NailFeedwtDate from '../../../../Components/Nails/NailFeedwtDate/NailFeedwtDate.jsx';
import FeedEmpty from './FeedEmpty.jsx';
import {_axios_get_nodeAccumulatedList} from '../axios.js';
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
      feedListToday: [],
      feedListPast: [],
      unitsBasic: {},
      unitsAssignedDate: {},
      scrolledToday: true,
      scrolledPast: true
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // if change the node bymodifying the nodeid in search, the page would only update
    let lastUrlParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    let lastNodeAtId = lastUrlParams.get('nodeid');
    if(this.nodeAtId != lastNodeAtId){
      this._set_feedUnits('today');
    };
    // check a special condition: feedListToday was empty & the scrolledToday just turn into false,
    // in case the very beginning, and the _check_Position() can not work.
    if(
      prevState.scrolledToday != this.state.scrolledToday &&
      this.state.feedListToday.length == 0
    ){
      this._set_feedUnits('past');
    }
  }

  componentDidMount(){
    // must set the nodeAtId first, before _set_feedUnits
    this._set_feedUnits('today');
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
    if (
      this.state.feedListToday.length > 0 ||
      this.state.feedListPast.length> 0
    ){
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

  _render_FeedNails(dayRange){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch

        nailsDOM.push (
          <div
            key={"key_NodeFeed_new_" + listByDayRange + "_"+ index}
            className={classnames(styles.boxModuleItem)}>
              <div
                className={classnames(stylesNail.boxNail)}
                style={ (dayRange == "today") ? {} : {margin: '0 0 8px'}  }>
                {
                  (dayRange == "today") ? (
                    <NailFeedwtNone
                      {...this.props}
                      unitId={unitId}
                      linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                      unitBasic={this.state.unitsBasic[unitId]} />
                  ) : (
                    <NailFeedwtDate
                      {...this.props}
                      unitId={unitId}
                      linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                      unitBasic={this.state.unitsBasic[unitId]}
                      assignedDate={this.state.unitsAssignedDate[unitId]}/>
                  )
                }
              </div>
          </div>
        );
      });

      return nailsDOM;
    };

    let listByDayRange = (dayRange == "today") ? "feedListToday" : "feedListPast";
    this.state[listByDayRange].forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_AtNode_FeedGroup"+index}>
          {_nailsGroup(unitGroup, index)}
        </div>
      );
    });
    if( (dayRange == 'today') && (groupsDOM.length == 0) ){
      groupsDOM.push(
        <div
          style={{
            margin: '8px 0 16px', color: '#b8b8b8', fontSize: '1.4rem'}}>
          {"---"}
        </div>
      )
    }

    return groupsDOM;
  }

  render(){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.nodeAtId = urlParams.get('nodeid');

    return (
      <div className={styles.comAtNodeFeed}>
        <div
          className={classnames(styles.boxRow, styles.boxFeedToday)}>
          <div
            style={{margin: '8px 0 12px'}}>
            <span
              className={classnames(
                "fontTitle", "lineHeight15", "weightBold", "colorEditBlack")}>
              { this.props.i18nUIString.catalog["title_DayFeed_dayrange"]['today'] }
            </span>
          </div>
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
            )}>
            {this._render_FeedNails('today')}
          </div>
        </div>
        {
          (this.state.feedListPast.length > 0) &&
          <div
            className={classnames(styles.boxRow, styles.boxFeedPast)}>
            <div
              className={classnames(styles.boxRowPastSubtitle)}>
              <span
                className={classnames(
                  "fontContent", "colorAssistGold")}>
                  {this.props.i18nUIString.catalog['subtitle_Node_pastStart']}
              </span>
            </div>
            <div
              className={classnames(
                styles.boxModule,
                styles.boxModuleSmall,
              )}>
              {this._render_FeedNails('past')}
            </div>
          </div>
        }
        {
          ((this.state.feedListPast.length == 0) &&
            this.state.feedListToday.length == 0 &&
            !this.state.scrolled &&
            !this.state.axios
          ) &&
          <div
            className={classnames(
              styles.boxModule,
              styles.boxModuleSmall,
              styles.boxRow
            )}>
            <FeedEmpty
              {...this.props}
              nodeAtId={this.nodeAtId}/>
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
      (this.state.scrolledToday || this.state.scrolledPast) // checkpoint from the backend, no items could be res if !scrolled
    ){
      //base on the concept that bottom of boxScroll should always lower than top of viewport,
      //and do not need to fetch if you have see the 'real' bottom.
      this._set_feedUnits( this.state.scrolledToday ? 'today' : 'past');
    }
  }

  _set_feedUnits(dayRange, lastUnitTime){
    // feeds was selected by the last unit get last round
    let listByDayRange = (dayRange == "today") ? "feedListToday" : "feedListPast";
    if(
      !lastUnitTime && (this.state[listByDayRange].length > 0)
    ){ //only set the lastUnitTime again after the list had alreadyhad something
      let group, groupLength;
      let list = this.state[listByDayRange];
      group = list[list.length-1];
      groupLength = group.length;
      lastUnitTime = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    const self = this;
    this.setState({axios: true});

    _axios_get_nodeAccumulatedList(this.axiosSource.token, {
      nodeId: this.nodeAtId,
      listUnitBase: lastUnitTime,
      dayRange: dayRange
    })
    .then((resObj)=>{
      if(resObj.main.unitsList.length > 0){
        self.setState((prevState, props)=>{
          let copyList = prevState[listByDayRange].slice();
          copyList.push(resObj.main.unitsList);
          let stateObj = {};
          stateObj[listByDayRange] = copyList;
          stateObj[(dayRange == "today") ? "scrolledToday" : "scrolledPast" ] = resObj.main.scrolled;
          stateObj['unitsAssignedDate'] = {...prevState.unitsAssignedDate, ...resObj.main.unitsAssignedDate};
          return stateObj;
        });

        return axios_get_UnitsBasic(self.axiosSource.token, resObj.main.unitsList);
      }
      else{
        let stateObj = {};
        stateObj[(dayRange == "today") ? "scrolledToday" : "scrolledPast" ] = resObj.main.scrolled;
        self.setState(stateObj) // don't forget set scrolled to false to indicate the list was end
        return { //just a way to deal with the next step, stop further request
          main: {
            nounsListMix: [],
            unitsBasic: {},
          }}};
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
