import React from 'react';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  setMessageSingle,
} from "../../../../redux/actions/general.js";
import { messageDialogInit } from "../../../../redux/states/constants.js";

class BtnDayRange extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onBtn: false
    };
    this._render_rangeOptions = this._render_rangeOptions.bind(this);
    this._handleEnter_liItem = this._handleEnter_liItem.bind(this);
    this._handleLeave_liItem = this._handleLeave_liItem.bind(this);
    this._handleClick_option = this._handleClick_option.bind(this);
  }

  _handleClick_option(event){
    event.preventDefault();
    event.stopPropagation();
    let requestDateString = event.currentTarget.getAttribute('assigneddate');

    // then we were free to pass the e.nodeId to parent
    if(requestDateString != this.props.assignedDate){ // both this.props.assignedDate & requestDateString are dateString
      this.props._set_assignedDate(requestDateString);
    }
    else if(requestDateString == this.props.assignedDate){ // click on the one currently selected
      this.props._set_assignedDate();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  _render_rangeOptions(){
    let now = new Date();
    let todayDateObj = new Date(now.toDateString());
    let todayDate = now.getDate();
    let todayMonth = now.getMonth() +1;
    let yesterDay = new Date();
    yesterDay.setDate(yesterDay.getDate()-1);
    let yesterdayDateObj = new Date(yesterDay.toDateString());
    let yesterdayDate = yesterDay.getDate();
    let yesterdayMonth = yesterDay.getMonth() +1;

    let btnDOM =[];
    let propsRangeString = this.props.assignedDate ; // this.props.assignedDate could be 'null'
    for(let i =0; i < 2; i++){ // 0: 'today', 1: 'yesterday'
      let currentDayRange = ( (i == 0) ? todayDateObj : yesterdayDateObj );
      let currentRangeString = currentDayRange.toDateString();
      let chosenify = (currentRangeString == propsRangeString) ? true : false;
      btnDOM.push(
        <li
          key={'_key_btnAssignDate_' + i }
          assigneddate={currentRangeString}
          className={classnames(
            styles.boxListItem,
            {
              [styles.chosenListItem]: chosenify, // if the item was chosen
              [styles.mouseListItem]: ((this.state.onBtn == currentRangeString) && !chosenify ) //no chosen
            }
          )}
          onClick={this._handleClick_option}
          onTouchStart={this._handleEnter_liItem}
          onTouchEnd={this._handleLeave_liItem}
          onMouseEnter={this._handleEnter_liItem}
          onMouseLeave={this._handleLeave_liItem}>
          <span
            className={classnames(
              styles.spanListItem, "fontSubtitle_h5",
              {
                ['colorWhite']: (chosenify || (this.state.onBtn == currentRangeString) ), // chosen or mouse on
                ["colorGrey"]: (!chosenify && (this.state.onBtn != currentRangeString)), // the rest condition
              }
            )}>
            {
              (i == 0) ? todayMonth : yesterdayMonth
            }
          </span>
          <span
            className={classnames(
              styles.spanListItem, "fontSubtitle_h5",
              {
                ['colorWhite']: (chosenify || (this.state.onBtn == currentRangeString) ), // chosen or mouse on
                ["colorGrey"]: (!chosenify && (this.state.onBtn != currentRangeString)), // the rest condition
              }
            )}>
            {
              (i == 0) ? todayDate : yesterdayDate
            }
          </span>
        </li>
      );
    };

    return btnDOM;
  }

  render(){
    return(
      <div>
        {this._render_rangeOptions()}
      </div>
    )
  }

  _handleEnter_liItem(e){
    this.setState({
      onBtn: e.currentTarget.getAttribute('assigneddate')
    })
  }

  _handleLeave_liItem(e){
    this.setState({
      onBtn: ''
    })
  }

}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_SingleDialog: (obj) => { dispatch(setMessageSingle(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(BtnDayRange));
