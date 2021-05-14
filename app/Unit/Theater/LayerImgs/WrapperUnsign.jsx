import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ImgsFrame from './ImgsFrame.jsx';
import NodesExtensible from '../../NodesDisplay/NodesExtensible.jsx';
import {
  setMessageBoolean,
} from "../../../redux/actions/general.js";
import {messageDialogInit} from "../../../redux/states/constants.js";

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._set_inviteDialog = this._set_inviteDialog.bind(this);
  }


  render(){
    let nodesTitleObj = this.props.unitCurrent.nouns;
    if(this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) != (-1) ){ // guidingNails has its special title
      nodesTitleObj = {
        list: [4692], // an empty position in DB, to prevent a conflict between real node
        basic: {
          4692: {name: this.props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId)]}
        }
      }
    };

    return(
      <div
        className={classnames( styles.comWrapper)}>
        <div
          className={classnames(styles.boxContentWidth, styles.boxTitle)}>
          <NodesExtensible
            nouns={nodesTitleObj}
            _referNode={this.props._refer_toandclose}
            _set_noTokenDialog={this._set_inviteDialog}/>

        </div>
        <div
          className={classnames(styles.boxContentWidth, styles.boxFrame)}>
          <ImgsFrame
            moveCount={this.props.moveCount}
            lockify={this.props.lockify}
            marksStatus={this.props.marksStatus}
            _set_markOpened={this.props._set_markOpened}
            _set_layerstatus={this.props._set_layerstatus} />
        </div>

      </div>
    )
  }

  _set_inviteDialog(source){
    let message, messsageTail = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind'];
    switch (source) {
      case "respond":
        message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_respond'];
        break;
      case "author":
        message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_author'];
        break;
      case "more":
        message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_more'];
        break;
      case "inspired":
        message = this.props.i18nUIString.catalog['message_UnitUnsign_SigninRemind_inspired'];
        break;
      default:
        message=""
    }
    message = message + "\xa0" + messsageTail;

    this.props._submit_BooleanDialog({
      render: true,
      customButton: "sign",
      message: [{
        text: message,
        style:{}}], //Original:'current input would not be saved after leaving, are you sure going to leave?'
      handlerPositive: ()=>{
        this.props._submit_BooleanDialog(messageDialogInit.boolean);
        this.props._refer_toandclose("/"); // basically all the condition are the same result
      },
      handlerNegative: ()=>{this.props._submit_BooleanDialog(messageDialogInit.boolean);return;}
    });
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));},
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
