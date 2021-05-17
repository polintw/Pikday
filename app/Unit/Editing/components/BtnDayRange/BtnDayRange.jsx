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
    if(this.props.unitView=="editing") {
      // AssignNodes was not allowed change after first release to public
      this.props._submit_SingleDialog({
        render: true,
        message: [{text: this.props.i18nUIString.catalog['message_Unit_Editing_AssignNotAllowed'],style:{}}], //format follow Boolean, as [{text: '', style:{}}]
        handlerPositive: ()=>{this.props._submit_SingleDialog(messageDialogInit.single)},
        buttonValue: this.props.i18nUIString.catalog['submit_understand']
      });
      return;
    };

    let targetId = event.currentTarget.getAttribute('nodeid'); //type of attribute always be a 'string'
    // we'd better turn it into 'int', the type the DB saved, so did the tpye the props.belongTypes saved
    targetId = parseInt(targetId); //now the type of targetId is 'int'
    // and the type of nodeId saved in assigned from  props were int, too
    /*
    then the point is, we won't update anything if:
    - click the one used in another type, not for this type
    */
    if(this.props.allSelection.indexOf(targetId) > (-1) && targetId != this.props.selected) return;
    // then we were free to pass the e.nodeId to parent
    if(targetId != this.props.selected){ // going to replace current one or total new one
      this.props._submit_new_node({ nodeId: targetId, type: this.props.assignType });
    }
    else if(targetId == this.props.selected){ // click on the one currently selected
      this.props._submit_deleteNodes( targetId, this.props.assignType);
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
    let propsRangeString = this.props.assignedDate.toDateString();
    for(let i =0; i < 2; i++){
      let currentDayRange = (i == 0) ? todayDateObj : yesterdayDateObj;
      let currentRangeString = currentDayRange.toDateString();
      let chosenify = (currentRangeString == propsRangeString) ? true : false;
      btnDOM.push(
        <li
          key={'_key_btnAssignDate_' + i }
          dayrange={currentDayRange}
          className={classnames(
            styles.boxListItem,
            {
              [styles.chosenListItem]: chosenify, // if the item was chosen
              [styles.mouseListItem]: (this.state.onBtn == i && !chosenify ) //no chosen
            }
          )}
          onClick={this._handleClick_option}
          onMouseEnter={this._handleEnter_liItem}
          onMouseLeave={this._handleLeave_liItem}>
          <span
            className={classnames(
              styles.spanListItem, "fontContent",
              {
                ['colorEditBlack']: chosenify,
                ['colorWhite']: (this.state.onBtn == i && !chosenify), //mouse on but not assigned in other type
                ["colorGrey"]: !chosenify && this.state.onBtn != i, // the rest condition
              }
            )}>

          </span>
        </li>
      );
    });
    if(nodesDOM.length == 0){ // nodesList was empty, means the user hasn't register belong of this type
      nodesDOM.push(
        <div>
          <span
            className={classnames(
              styles.spanListItem, "fontContent", "colorGrey")}>
            {
              this.props.i18nUIString.catalog['guidingCreateShare_AssignNull'] +
              this.props.i18nUIString.catalog[(this.props.assignType=='homeland') ? "text_home":"text_resid"]
            }
          </span>
        </div>
      )
    }

    return nodesDOM;
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
      onBtn: e.currentTarget.getAttribute('dayrange')
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
    belongsByType: state.belongsByType
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
