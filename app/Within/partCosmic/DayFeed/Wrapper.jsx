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
import Feed from './Feed/Feed.jsx';
import NavTitle from './NavTitle/NavTitle.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";
import {
  cancelErr,
  uncertainErr
} from '../../../utils/errHandlers.js';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      savedPosition: null
    };
    this.wrapperWithinCosmic = React.createRef();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(
      this.props.location.pathname != prevProps.location.pathname &&
      this.props.location.pathname.includes('/unit')
    ){
      let savedPosition = window.scrollY;
      this.setState((prevState, props)=>{
        return {
          savedPosition: savedPosition
        };
      }, ()=>{
        this.wrapperWithinCosmic.current.style.display='none';
      });
    }
    else if(
      this.props.location.pathname != prevProps.location.pathname &&
      prevProps.location.pathname.includes('/unit') &&
      !this.props.location.pathname.includes('/unit')
    ){
      this.wrapperWithinCosmic.current.style={};
      window.scroll(0, prevState.savedPosition);
      this.setState({
        savedPosition: null
      });
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return(
      <div>
        <div
          ref={this.wrapperWithinCosmic}
          className={classnames(styles.comWrapperDayFeed)}>
          <div
            className={classnames(styles.boxTopTitle)}>
            <NavTitle {...this.props}/>
          </div>
          <div>
            <Feed
              {...this.props}/>
          </div>
          <div className={classnames(styles.boxDecoBottom, "smallDisplayNone")}></div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in AtNode*/ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic} />
            )
          }
        }/>
      </div>
    )
  }

  _construct_UnitInit(match, location){
    let unitInit= {marksify: false, initMark: "all", layer: 0};
    return unitInit;
  }
}


const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    i18nUIString: state.i18nUIString,
    nounsBasic: state.nounsBasic
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
)(Wrapper));
