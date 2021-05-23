import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import stylesNail from "../../../stylesNail.module.css";
import FeedEmpty from './FeedEmpty.jsx';
import NailFeedwtNodes from '../../../../Components/Nails/NailFeedwtNodes/NailFeedwtNodes.jsx';
import {_axios_get_accumulatedList} from '../axios.js';
import {axios_get_UnitsBasic} from '../../../../utils/fetchHandlers.js';
import {
  handleNounsList,
} from "../../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from "../../../../utils/errHandlers.js";
import {
  domain
} from '../../../../../config/services.js';

class Feed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      feedList: [],
      unitsBasic: {},
      scrolled: true,
    };
    this.refScroll = React.createRef();
    this.axiosSource = axios.CancelToken.source();
    this._set_feedUnits = this._set_feedUnits.bind(this);
    this._check_Position = this._check_Position.bind(this);
    this._render_FeedNails = this._render_FeedNails.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.dayrange != prevProps.dayrange){
      this.setState((prevState,props)=> {
        return {
          feedList: [],
          unitsBasic: {},
          scrolled: true,
        };
      }, ()=>{
        this._set_feedUnits();
      });
    };
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

  _render_FooterHint(){
    // by feed length, we gave users some message about the thing they could do
    if (this.state.feedList.length> 0){
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

  _render_FeedNails(){
    let groupsDOM = [];
    const _nailsGroup = (unitGroup, groupIndex)=>{
      let nailsDOM = [];
      unitGroup.forEach((unitId, index) => {
        //render if there are something in the data
        if( !(unitId in this.state.unitsBasic)) return; //skip if the info of the unit not yet fetch

        nailsDOM.push (
          <div
            key={"key_NodeFeed_new_"+index}
            className={classnames(styles.boxModuleItem)}>
              <div
                className={classnames(stylesNail.boxNail)}
                style={{margin: '0 0 8px'}}>
                <NailFeedwtNodes
                  {...this.props}
                  unitId={unitId}
                  linkPath={this.props.location.pathname + ((this.props.location.pathname == '/') ? 'unit' : '/unit')}
                  unitBasic={this.state.unitsBasic[unitId]} />
              </div>
          </div>
        );
      });

      return nailsDOM;
    };

    this.state.feedList.forEach((unitGroup, index)=>{
      groupsDOM.push(
        <div
          key={"key_PathProject_FeedGroup"+index}
          className={classnames(
            styles.boxModule,
            styles.boxModuleSmall,
          )}>
          {_nailsGroup(unitGroup, index)}
        </div>
      );
    });

    return groupsDOM;
  }

  render(){
    return (
      <div className={styles.comFocusBoardFeed}>
        <div>
          {
            (this.state.feedList.length > 0) &&
            <div
              className={classnames(
                styles.boxRow
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
                styles.boxRow
              )}>
              <FeedEmpty
                {...this.props}/>
            </div>
          }

          <div ref={this.refScroll}/>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {this._render_FooterHint()}
          </div>
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
      this._set_feedUnits();
    }
  }

  _set_feedUnits(lastUnitTime){
    // feeds was selected by the last unit get last round
    if(!lastUnitTime && this.state.feedList.length > 0){
      //set the lastUnitTime if no assigned, after the list had already had something
      let group, groupLength;
      let list = this.state.feedList;
      group = list[list.length-1];
      groupLength = group.length;
      lastUnitTime = this.state.unitsBasic[group[groupLength-1]].createdAt;
    };
    const self = this;
    this.setState({axios: true});
    let now = new Date();
    if(this.props.dayrange == "yesterday"){
      // if yesterday desired, minus 1 on date before trun into string
      now.setDate(now.getDate()-1);
    };
    let dateString = now.toDateString();

    _axios_get_accumulatedList(this.axiosSource.token, {
      listUnitBase: lastUnitTime,
      dateString: dateString
    })
    .then((resObj)=>{
      if(resObj.main.unitsList.length > 0){
        self.setState((prevState, props)=>{
          let copyList = prevState.feedList.slice();
          copyList.push(resObj.main.unitsList);
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
    nounsBasic: state.nounsBasic,
    pathsBasic: state.pathsBasic
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
