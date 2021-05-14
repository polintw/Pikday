import React from 'react';
import {
  Link,
  Switch,
  Route,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import {
  axios_visit_GET_last,
  axios_visit_Index
} from './utils.js';
import NavFeed from "./NavFeed/NavFeed.jsx";
import IndexShare from './IndexShare/IndexShare.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  initAround
} from '../../../redux/states/statesWithin.js';
import {
  setIndexList,
} from "../../../redux/actions/within.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      lastVisit: false,
    };
    this.axiosSource = axios.CancelToken.source();
    this._createdRespond = this._createdRespond.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_Newly = this._render_Newly.bind(this);
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _createdRespond(){

  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){
    const self = this;
    this.setState({axios: true});

    //get the last visit situation for child component
    axios_visit_GET_last(self.axiosSource.token)
    .then(function(lastVisitRes){
      self.setState({
        axios: false,
        lastVisit: lastVisitRes.main.lastTime
      });
      axios_visit_Index(this.axiosSource.token);
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

  componentWillUnmount(){
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
    //clear & reset to init when Unmount, make sure the list would not render anything when retrun to index
    this.props._set_IndexLists(initAround.indexLists);
  }

  render(){
    return(
      <div>
        {
          (this.props.userInfo.accountStatus == "newly") ? //should knew before React mount
          (
            this._render_Newly()
          ):(
            <div
              className={classnames(styles.comAroundWrapper)}>
              <div
                className={classnames(styles.boxRow)}>
                <div>
                  {"What's the scene to your day today?"}
                </div>
                <div
                  className={classnames(styles.boxIndexShare)}>
                  <IndexShare
                    {...this.props}/>
                </div>

              </div>
              <div
                className={classnames(styles.boxRow)}>
                <NavFeed {...this.props}/>

              </div>
              <div
                className={classnames(styles.boxRow, styles.boxFooter)}/>

            </div>
          )
        }

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {this._createdRespond}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
            )
          }
        }/>
      </div>
    )
  }

  _render_Newly(){
    return this.props.belongsByType.fetched ? // already recieved the res of belonstype
    (
      ( (!("homeland" in this.props.belongsByType) || (!this.props.belongsByType['homeland'])) && //no set homeland
        (!("residence" in this.props.belongsByType) || (!this.props.belongsByType["residence"])) // no set residence
      ) ? (
        <div
          className={classnames(styles.comAroundWrapper)}>

          <div
            className={classnames(styles.boxFooter)}
            style={{marginBottom: '6vh'}}></div>
        </div>
      ) : (
        <div
          className={classnames(styles.comAroundWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRowTop)}>

          </div>
          <div
            className={classnames(styles.boxRow)}>

          </div>
          <div
            className={classnames(styles.boxRow)}
            style={{margin: '4px 0 0'}}>

          </div>
          <div
            className={classnames(styles.boxFooter)}
            style={{marginBottom: '6vh'}}></div>
        </div>
      )
    ) :
    null;
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    belongsByType: state.belongsByType,
    indexLists: state.indexLists,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    _set_IndexLists: (obj) => { dispatch(setIndexList(obj)); },
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
