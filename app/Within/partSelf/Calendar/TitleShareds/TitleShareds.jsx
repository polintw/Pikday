import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";

class TitleShareds extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
    this._render_Greet = this._render_Greet.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  _render_Greet(){
    let d = new Date();
    let currentHour = d.getHours();

    if(currentHour > 6 && currentHour < 12){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][0]
    }
    else if(currentHour >= 12 && currentHour < 19){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][1]
    }
    else if(currentHour >= 19 || currentHour < 2){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][2]
    }
    else if(currentHour >= 2 && currentHour < 6){
      return this.props.i18nUIString.catalog['message_SelfShareds_greet'][3]
    };
  }

  render(){
    return (
      <div className={styles.comTitleShareds}>
        <div
          className={classnames(styles.boxUpperRow)}>
          <div
            className={classnames(styles.rowTitleText)}>
            <span
              className={classnames("fontTitle", "colorEditBlack", "weightBold")}>
              {this.props.i18nUIString.catalog['title_yourShareds']}
            </span>
          </div>
          <span
            className={classnames("fontContent", "colorEditBlack")}>
            {this._render_Greet()}
          </span>
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
)(TitleShareds));
