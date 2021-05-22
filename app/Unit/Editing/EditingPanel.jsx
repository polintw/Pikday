import React from 'react';
import {
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import ContentEditor from './ContentEditor/ContentEditor.jsx';
import NodesView from './NodesEditor/NodesView/NodesView.jsx';
import AssignNodes from './NodesEditor/AssignNodes.jsx';
import AssignSwitch from './NodesEditor/AssignSwitch.jsx';
import Submit from './components/Submit/Submit.jsx';
import ImgImport from './components/ImgImport.jsx';
import BtnDayRange from './components/BtnDayRange/BtnDayRange.jsx';
import {
  setMessageBoolean,
} from "../../redux/actions/general.js";
import {messageDialogInit} from "../../redux/states/constants.js";

class EditingPanel extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      contentEditing: false,
      nodesShift: false,
      coverSrc: !!this.props.unitSet?this.props.unitSet.coverSrc:null,
      coverMarks: !!this.props.unitSet?this.props.unitSet.coverMarks:{list:[], data:{}},
      nodesSet: !!this.props.unitSet?this.props.unitSet.nodesSet:[],
      assignedDate: null,
      //beneath, is remaining for future use, and kept the parent comp to process submitting
      beneathSrc: null,
      beneathMarks: {list:[],data:{}},
    };
    this._set_newImgSrc = this._set_newImgSrc.bind(this);
    this._set_Mark_Complete = this._set_Mark_Complete.bind(this);
    this._set_statusEditing = this._set_statusEditing.bind(this);
    this._set_nodesEditView = this._set_nodesEditView.bind(this);
    this._set_assignedDate = this._set_assignedDate.bind(this);
    this._submit_new_node = this._submit_new_node.bind(this);
    this._submit_newShare = this._submit_newShare.bind(this);
    this._submit_deleteNodes= this._submit_deleteNodes.bind(this);
    this._render_importOrCover = this._render_importOrCover.bind(this);
    this._render_PanelView = this._render_PanelView.bind(this);
  }

  _submit_new_node(nodesArr){
    /*
    'nodesArr' was an arr composed of a chain of 'node' objs,
    and could replace the prevState directly
    */
    this.setState((prevState, props)=>{
      return {
        nodesSet: nodesArr
      }
    })
  }

  _submit_deleteNodes(target){
    this.setState((prevState, props)=>{
      let targetArr = prevState.nodesSet;
      let updateArr = [];
      //'target' is an index mark the unwanted node
      updateArr = targetArr.slice(); // copy to prevent modified state
      updateArr.splice(target, 1);

      return {
        nodesSet: updateArr
      }
    })
  }

  _set_newImgSrc(newImgObj){
    this.setState({
      coverSrc: newImgObj.resizedURL,
    });
  }

  _set_Mark_Complete(markData, layer){
    this.setState((prevState, props) => {
      return {coverMarks: markData, contentEditing: false};
    });
  }

  _set_statusEditing(bool){
    this.setState((prevState, props)=>{
      return {
        contentEditing: bool
      }
    });
  }

  _submit_newShare(){
    //shallow copy, prevent render init during the modifications
    let newObj = Object.assign({}, this.state);
    /*
      Going to check everything:
      - if the obj contain cover & nodes: give warn
      - no Unit was submitting: give warn
      - not editing: give warn
    */
    // beneath was an old 'wraning dialog' version
    if(!newObj["coverSrc"] || newObj['nodesSet'].length < 1) { // the 'img' & 'node assigned to' are required
      this.props._set_warningDialog([{text: this.props.i18nUIString.catalog['message_CreateShare_basicRequireWarn'],style:{}}], 'warning');
      return;
    }
    else if(!newObj['assignedDate']){ // not yet assigned a date
      this.props._set_warningDialog([{text: this.props.i18nUIString.catalog['message_CreateShare_dailyAssigned'],style:{}}], 'warning');
      return;
    }else if(this.props.unitSubmitting){
      this.props._set_warningDialog([{text: "submit is processing, please hold on ...",style:{}}], 'warning');
      return;
    }else if(this.state.contentEditing){
      this.props._set_warningDialog([{text: "your edit hasn't completed.", style:{}}], 'warning');
      return;
    };
    //Then if everything is fine
    //seal the mark obj by fill in the lasr undetermined value, 'layer'
    newObj.coverMarks.list.forEach((markKey, index)=>{
      newObj.coverMarks.data[markKey].layer = 0;
    });
    // and go for submit
    this.props._set_Submit(newObj);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_importOrCover(){
    if(!this.state.coverSrc ){
      return(
        <ImgImport
          _set_newImgSrc={this._set_newImgSrc}/>
      )
    }
    else if(!!this.state.coverSrc ){
      return(
        <ContentEditor
          key={"key_EditingPanel_ContentEditor_"}
          editing={this.state.contentEditing}
          imgSrc={this.state.coverSrc}
          marks={this.state.coverMarks}
          _set_statusEditing={this._set_statusEditing}
          _set_Mark_Complete={this._set_Mark_Complete}
          _set_warningDialog={this.props._set_warningDialog}/>
      )
    }
  }

  _render_PanelView(){
    switch (this.state.nodesShift) {
      case 'nodeEditor':
        return (
          <div
            className={classnames(
              styles.boxContent,
              styles.boxContentWidth, styles.boxPanelHeight, styles.boxPanelPadding)}>
            <NodesView
              nodesSet={this.state.nodesSet}
              _submit_new_node={this._submit_new_node}
              _set_nodesEditView={this._set_nodesEditView}/>
          </div>
        )
        break;
      default:
        return (
          <div
            key={"key_EditingPanel_default_"}
            className={classnames(
              styles.boxContent,
              styles.boxContentWidth, styles.boxPanelHeight, styles.boxPanelPadding)}>
            <div
              className={classnames(styles.boxSubmit)}>
              <Submit
                editing={this.state.contentEditing}
                contentPermit={(!this.state["coverSrc"] || this.state['nodesSet'].length < 1) ? false : true}
                confirmDialog={!!this.props.confirmDialog ? this.props.confirmDialog : false}
                warningDialog={!!this.props.warningDialog ? this.props.warningDialog : false}
                _set_Clear={this.props._set_Clear}
                _submit_newShare={this._submit_newShare} />
            </div>
            <div
              className={classnames(styles.boxFrame)}>
              {this._render_importOrCover()}
            </div>
            <div
              className={classnames(styles.boxOptionsRow)}>
              <div
                className={classnames(styles.boxNodesList)}>
                <div
                  className={classnames(styles.boxSubtitle)}>
                  <span
                    className={classnames("fontContent", "colorEditLightBlack")}>
                    {this.props.i18nUIString.catalog["subtitle_Create_assignedNodes"]}
                  </span>

                </div>
                <div
                  className={classnames(styles.boxAssignedNodes)}>
                  <div style={{display: 'flex', flex: '1'}}>
                    <AssignNodes
                      nodesSet={this.state.nodesSet}
                      nodeDelete={false}
                      _submit_deleteNodes={this._submit_deleteNodes} />
                    <AssignSwitch
                      nodesSet={this.state.nodesSet}
                      _set_nodesEditView={this._set_nodesEditView}/>
                  </div>
                </div>
              </div>
              <div>
                <div
                  className={classnames(styles.boxSubtitle)}>
                  <span
                    className={classnames("fontContent", "colorEditLightBlack")}>
                    {this.props.i18nUIString.catalog["subtitle_Create_dateAssigned"]}
                  </span>
                </div>
                <div>
                  <BtnDayRange
                    {...this.props}
                    assignedDate={this.state.assignedDate}
                    _set_assignedDate={this._set_assignedDate}/>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  render(){
    return(
      <div
        className={classnames(styles.comEditingPanel)}
        onClick={(e)=>{e.preventDefault();e.stopPropagation();/*prevent bubbling to bg of wherever it was called*/}}>
        {
          this._render_PanelView()
        }

        {
          this.props.unitSubmitting &&
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0',
              left:'0',
              backgroundColor: 'rgba(230,230,230,0.5)'
            }}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation();}}/>
        }
      </div>
    )
  }

  _set_nodesEditView(viewStr){
    this.setState((prevState, props)=>{
      return {
        nodesShift: viewStr
      };
    })
  }

  _set_assignedDate(assignedDate){
    this.setState((prevState, props)=>{
      return {
        assignedDate: !!assignedDate ? assignedDate : null
      };
    });
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
    i18nUIString: state.i18nUIString,
    unitSubmitting: state.unitSubmitting,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _submit_BooleanDialog: (obj)=>{dispatch(setMessageBoolean(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditingPanel));
