import React from 'react';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import Feed from './Feed/Feed.jsx';
import TitleShareds from './TitleShareds/TitleShareds.jsx';
import UnitScreen from '../../../Unit/UnitScreen/UnitScreen.jsx';
import {
  handleNounsList,
} from "../../../redux/actions/general.js";

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this.axiosSource = axios.CancelToken.source();
    this._construct_UnitInit = this._construct_UnitInit.bind(this);
    this._render_FooterHint = this._render_FooterHint.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_FooterHint(){
    return (
      <span
        className={classnames(styles.spanFooterHint, "fontTitleSmall", "colorLightGrey")}>
        {this.props.i18nUIString.catalog['descript_AroundIndex_footer']}</span>
    );
  }

  render(){
    return(
      <div>
        <div
          className={classnames(styles.comSelfWrapper)}>
          <div
            className={classnames(styles.boxRow, styles.boxRow40Top)}>
            <TitleShareds
              {...this.props}/>
          </div>
          <div
            className={classnames(styles.boxRow)}>
            <Feed {...this.props}/>
          </div>
          <div
            className={classnames(styles.boxRow, styles.boxFooter)}>
            {
              this._render_FooterHint()
            }
          </div>
        </div>

        <Route
          path={((this.props.location.pathname =="/") ? '' : this.props.location.pathname.slice(0, -5))+ '/unit' }
          render={(props)=> {
            return (
              <UnitScreen
                {...props}
                _createdRespond= {()=>{/* no need to give any flad in /self. */ }}
                _construct_UnitInit={this._construct_UnitInit}
                _refer_von_unit={this.props._refer_von_cosmic}/>
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
