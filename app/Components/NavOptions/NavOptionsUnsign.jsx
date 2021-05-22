import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import SvgLogo from '../Svg/SvgLogo.jsx';

class NavOptionsUnsign extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_NavSmallScreen = this._render_NavSmallScreen.bind(this);
  }

  _render_NavSmallScreen(){
    /*
    basically charge for screen width < 860
    depend on css class '.smallDisplayBox'
    */
    let currentPath = this.props.location.pathname;

    return(
      <div
        className={classnames(styles.boxNavSmall)}>
        <div
          className={classnames(styles.selfCom_NavOptions_svg_)}>
          <div
            className={classnames(styles.boxLogo)}
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); window.location.assign('/')}}>
            <SvgLogo/>
          </div>
        </div>
        <div
          className={classnames(styles.selfCom_NavOptions_svg_)}
          style={{height: '19.33px'} /* height of 1.6rem fontSize */ }>
          { /* No use, just easier for CSS alignment */ }
        </div>
      </div>
    );
  }

  render(){
    return(
      <div
        className={classnames(styles.comNavOption)}>
        <div
          className={classnames(
            "smallDisplayBox", styles.boxNavOptionsSmall)}>
          {
            /*Notice, this render method actually deal with only situation the screen width < 860px
            and the rest (>860px) would rely on the next DOM beneath*/
            this._render_NavSmallScreen()
          }
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    tokenStatus: state.token,
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
)(NavOptionsUnsign));
