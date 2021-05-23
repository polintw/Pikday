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
import TodayNodes from './TodayNodes/FeedNodes.jsx';
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
      mainContentFixedTop: null,
      viewportHeight: window.innerHeight, // init static
      viewportWidth: window.innerWidth,
      opacityParam: 1
    };
    this.axiosSource = axios.CancelToken.source();
    this.refMainContent = React.createRef();
    this.wrapperAround = React.createRef();
    this._handleScroll_MainContent = this._handleScroll_MainContent.bind(this);
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
    let newViewportHeight = window.innerHeight;
    let newViewportWidth = window.innerWidth;
    if(
      prevState.viewportHeight != newViewportHeight &&
      prevState.viewportWidth != newViewportWidth
    ){
      let mainContentOffset = this.refMainContent.current.getBoundingClientRect();
      this.setState({
        mainContentFixedTop: mainContentOffset.top,
        viewportHeight: newViewportHeight,
        viewportWidth: newViewportWidth
      });
    };
  }

  componentDidMount(){
    let mainContentOffset = this.refMainContent.current.getBoundingClientRect();
    this.setState({
      mainContentFixedTop: mainContentOffset.top
    });
    window.addEventListener('scroll', this._handleScroll_MainContent, {passive: false});
    //because the modern browser set the 'passive' property of addEventListener default to true,
    //it would block the e.preventDefault() useage
    //so we could only add listener manually like this way

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
    //and don't forget to move any exist evetListener
    window.removeEventListener('scroll',this._handleScroll_MainContent);
  }

  render(){
    let mainBoxStyle = {
      top: !!this.state.mainContentFixedTop ? (this.state.mainContentFixedTop.toString() + "px") : "unset",
      opacity: this.state.opacityParam
    };
    let todayNodesStyle = {
      opacity: 1 - this.state.opacityParam
    };
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
                ref={this.refMainContent}
                className={classnames(
                  styles.boxRow, styles.boxMainContent)}
                style={mainBoxStyle}>
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
                className={classnames(styles.boxRow, styles.boxNavContent)}>
                <div
                  className={classnames(styles.boxNavFeed)}>
                  <NavFeed
                    {...this.props}
                    sideOpacityParam={this.state.opacityParam}/>
                </div>
                <div
                  className={classnames(styles.boxTodayNodes)}
                  style={todayNodesStyle}>
                  <TodayNodes/>
                </div>
              </div>
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

  _handleScroll_MainContent(event){
    // keep "default"
    event.stopPropagation();
    let viewportHeight = window.innerHeight;
    let scrollTop = window.scrollY;
    let opacityParam = 1;
    if(scrollTop == 0){
      this.setState({
        opacityParam: 1
      })
    }
    else if(scrollTop != 0 && scrollTop < (viewportHeight*2/5) ){
      opacityParam = (((viewportHeight*2/5) - scrollTop)/(viewportHeight*2/5)) * 0.8;
      this.setState({
        opacityParam: opacityParam
      });
    }
    else if(
      scrollTop != 0 && scrollTop > (viewportHeight*2/5) &&
      this.state.opacityParam // not '0'
    ){
      this.setState({
        opacityParam: 0
      })
    }
    else return ;
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
