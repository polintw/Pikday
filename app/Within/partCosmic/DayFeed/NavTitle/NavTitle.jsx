import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import DateConverter from '../../../../Components/DateConverter.jsx';

class NavTitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      onDaySwitch: false
    };
    this._handleEnter_daySwitch = this._handleEnter_daySwitch.bind(this);
    this._handleLeave_daySwitch = this._handleLeave_daySwitch.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render(){
    let showedTime = new Date();
    if( this.props.dayrange == 'yesterday' ){
      showedTime.setDate(showedTime.getDate() - 1);
    };
    let linkDayRange = (this.props.dayrange == "today") ? "yesterday" : 'today' ;

    return(
      <div
        className={classnames(
          styles.boxTitle, styles.comNavTitle)}>
        <div>
          <span
            className={classnames(
              "fontTitle", "lineHeight15", "weightBold", "colorEditBlack")}>
            { this.props.i18nUIString.catalog["title_DayFeed_dayrange"][this.props.dayrange] }
          </span>
          <span>
            {"to people"}
          </span>
        </div>
        <div>
          <div>
            <span
              className={classnames(
                "fontSubtitle_h5", "colorEditBlack")}>
                {"on "}
              </span>
              <DateConverter
                styles={{color: '#545454'}}
                datetime={showedTime}/>
          </div>
          <div>
            <Link
              to={"/cosmic/" + linkDayRange}
              className={classnames('plainLinkButton')}
              onTouchStart={this._handleEnter_daySwitch}
              onTouchEnd={this._handleLeave_daySwitch}
              onMouseEnter={this._handleEnter_daySwitch}
              onMouseLeave={this._handleLeave_daySwitch}
              style={{ padding: '0 5px' }}>
              <span
                className={classnames(
                  "fontSubtitle_h5", "weightBold", styles.spanDaySwitch,
                  {
                    [styles.spanDaySwitchMouseon]: (this.state.onDaySwitch),
                    ["colorWhiteGrey"]: !this.state.onDaySwitch,
                    ["colorEditBlack"]: this.state.onDaySwitch
                  }
                )}>
                {
                  this.props.i18nUIString.catalog[
                    linkDayRange == 'today' ? "link_Today" : "link_Yesterday"
                  ]
                }
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  _handleEnter_daySwitch(e){
    let linkTo = e.currentTarget.getAttribute('topath');
    this.setState({onDaySwitch: linkTo});
  }

  _handleLeave_daySwitch(e){
    this.setState({onDaySwitch: false})
  }

}

const mapStateToProps = (state)=>{
  return {
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
)(NavTitle));
