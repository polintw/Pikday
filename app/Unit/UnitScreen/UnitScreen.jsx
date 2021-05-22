import React from 'react';
import {
  Link,
  withRouter,
  Redirect
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import Theater from '../Theater/Theater.jsx';
import {
  _axios_getUnitData,
  _axios_getUnitImgs,
} from '../utils.js';
import ModalBox from '../../Components/ModalBox.jsx';
import ModalBackground from '../../Components/ModalBackground.jsx';
import {
  setUnitView,
} from "../../redux/actions/unit.js";
import {
  setUnitCurrent,
  updateNodesBasic,
} from "../../redux/actions/general.js";
import {unitCurrentInit} from "../../redux/states/constants.js";
import {
  initUnit
} from "../../redux/states/statesUnit.js";
import {
  cancelErr,
  uncertainErr
} from '../../utils/errHandlers.js';

class UnitScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      close: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this.boxUnitFrame = React.createRef();
    this._close_modal_Unit = this._close_modal_Unit.bind(this);
    this._set_UnitCurrent = this._set_UnitCurrent.bind(this);
    this._reset_UnitMount = this._reset_UnitMount.bind(this);
    //And! we have to 'hide' the scroll bar and preventing the scroll behavior to the page one for all
    //so dismiss the scroll ability for <body> here
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:hidden;");
  }

  _close_modal_Unit(){
    //close the whole Unit Modal
    //different from the one in Theater, which used only for closing Theater
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this.setState((prevState, props)=>{
      return {
        close: true
      }
    })
  }

  _reset_UnitMount(){
    //Don't worry about the order between state reset, due to the Redux would keep always synchronized
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this._set_UnitCurrent();
    this.boxUnitFrame.current.scrollTop = 0; // make the Unit view area back to top
  }

  _set_UnitCurrent(){
    const self = this;
    this.setState({axios: true});

    let promiseArr = [
      new Promise((resolve, reject)=>{_axios_getUnitData(this.axiosSource.token, this.unitId).then((result)=>{resolve(result);});}),
      new Promise((resolve, reject)=>{_axios_getUnitImgs(this.axiosSource.token, this.unitId).then((result)=>{resolve(result);});})
    ];
    Promise.all(promiseArr)
    .then(([unitRes, imgsBase64])=>{
      self.setState({axios: false});
      let resObj = JSON.parse(unitRes.data);

      // api GET unit data was totally independent, even the nodesBasic & userBasic
      //But we still update the info to redux state, for other comp. using
      let nodesBasic = {};
      resObj.main.nouns.list.forEach((nodeKey, index) => {
        nodesBasic[nodeKey] = resObj.main.nouns.basic[nodeKey];
      });
      self.props._submit_Nodes_insert(nodesBasic);

      //actually, beneath part might need to be rewritten to asure the state could stay consistency
      self.props._set_store_UnitCurrent({
        unitId:self.unitId,
        coverSrc: imgsBase64.cover,
        nouns: resObj.main.nouns,
        createdAt: resObj.main.createdAt
        /*
        Properties are not used after revision in 2021 May.
        Keep to wait for re opened in the future.
        */
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

  componentDidUpdate(prevProps, prevState, snapshot){
    //becuase there is chance we jump to another Unit from Related but using the same component
    //so we check if the unit has changed
    //but Notice! always check the diff between the current & pre id from 'path search'
    //due to this is the only reliable and stable source (compare to the unitCurrent)
    let prevParams = new URLSearchParams(prevProps.location.search); //we need value in URL query
    if(this.unitId !== prevParams.get('unitId')){
      this._reset_UnitMount(); //reset UnitCurrent to clear the view
    }
    else if(this.urlParams.get('unitView') !== prevParams.get('unitView')){
      this.boxUnitFrame.current.scrollTop = 0; // make the Unit view area back to top
    };
  }

  componentDidMount(){
    //because we fetch the data of Unit only from this file,
    //now we need to check if it was necessary to fetch or not in case the props.unitCurrent has already saved the right data we want
    this._set_UnitCurrent();
  }

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //reset UnitCurrent before leaving
    // It's Important !! next Unit should not have a 'coverSrc' to prevent children component render in UnitModal before Unit data response!
    let unitCurrentState = Object.assign({}, unitCurrentInit);
    this.props._set_store_UnitCurrent(unitCurrentState);
    this.props._set_state_UnitView('theater'); // it's default for next view
    //last, recruit the scroll ability back to <body>
    document.getElementsByTagName("BODY")[0].setAttribute("style","overflow-y:scroll;");
  }


  render(){
    if(this.state.close){
      let toPath=this.props.location.pathname.replace("/unit", "");
      let toSearch = new URLSearchParams(this.props.location.search);
      toSearch.delete('unitId');
      toSearch.delete('unitView');
      return <Redirect to={{
        pathname: (toPath.length > 0) ? toPath: '/', // totally empty would cause error,
        search: toSearch.toString(),
        state: {from: this.props.location}
        }}/>
    }

    this.urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    this.unitId = this.urlParams.get('unitId');
    let paramUnitView = this.urlParams.get('unitView');

    return(
      <ModalBox containerId="root">
        <ModalBackground
          _didMountSeries={()=>{window.addEventListener('touchmove', (e)=>{e.stopPropagation();});}}
          _willUnmountSeries={()=>{window.removeEventListener('touchmove', (e)=>{e.stopPropagation();});}}
          onClose={()=>{this._close_modal_Unit();}}
          style={{
            position: "fixed",
            backgroundColor: 'rgba(51, 51, 51, 0.85)' }}>
            <div
              id={"unitSignFrame"}
              className={classnames(styles.boxUnitSignFrame)}/>
            <div
              id={"unitFrame"}
              ref={this.boxUnitFrame}
              className={classnames(styles.boxUnitFrame)}
              onClick={this._close_modal_Unit}>
              <div
                className={classnames(styles.boxUnitContent)}>
                <Theater
                  {...this.props}
                  _reset_UnitMount={this._reset_UnitMount}
                  _close_theaterHeigher={this._close_modal_Unit}/>
              </div>
            </div>
        </ModalBackground>
      </ModalBox>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    unitView: state.unitView,
    unitCurrent: state.unitCurrent,
    unitSubmitting: state.unitSubmitting
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    _submit_Nodes_insert: (obj) => { dispatch(updateNodesBasic(obj)); },
    _set_state_UnitView: (expression)=>{dispatch(setUnitView(expression));},
    _set_store_UnitCurrent: (obj)=>{dispatch(setUnitCurrent(obj));},
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitScreen));
