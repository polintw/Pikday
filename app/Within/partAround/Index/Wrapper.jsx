import React from 'react';
import {
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
    this.wrapperAround = React.createRef();
    this._createdRespond = this._createdRespond.bind(this);
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }

  _createdRespond(){

  }

  componentDidUpdate(prevProps, prevState, snapshot){
    let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
    let prevUrlParmas = new URLSearchParams(prevProps.location.search);
    if(
      urlParams.has('creating') &&
      !prevUrlParmas.has("creating")
    ){
      this.wrapperAround.current.style.display='none';
    }
    else if(
      !urlParams.has('creating') &&
      prevUrlParmas.has("creating")
    ){
      this.wrapperAround.current.style={};
    };
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
      axios_visit_Index(self.axiosSource.token);
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
  }

  render(){
    return(
      <div>
        {
          /*(this.props.userInfo.accountStatus == "newly") ? //should knew before React mount
          (
            this._render_Newly()
          ):*/(
            <div
              ref={this.wrapperAround}
              className={classnames(styles.comAroundWrapper)}>
              <div
                className={classnames(
                  styles.boxRow, styles.boxMainContent)}>
                <div
                  className={classnames(styles.boxIndexTitle)}>
                  <span
                    className={classnames(
                      "fontTitleBig", "colorSignBlack", "weightBold")}>
                    {this.props.i18nUIString.catalog['title_AroundIndex_']}
                  </span>
                </div>
                <div
                  className={classnames(styles.boxIndexShare)}>
                  <IndexShare
                    {...this.props}/>
                </div>
              </div>
              <div
                className={classnames(styles.boxRow, styles.boxNavFeed)}>
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

}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Wrapper));
