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
    if(this.props.location.pathname != prevProps.location.pathname){ // make sure the btn return default when toggle between /yesterday & /today.
      this.setState({
        onDaySwitch: false
      });
    }
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
        className={classnames(styles.comNavTitle)}>
        <div>
          <span
            className={classnames(
              "fontTitle", "lineHeight15", "weightBold", "colorSignBlack")}>
            { this.props.i18nUIString.catalog["title_DayFeed_dayrange"][this.props.dayrange] }
          </span>
          <span
            className={classnames(
              styles.spanAlias,
              "fontSubtitle_h5", "colorEditBlack")}>
            {"to people"}
          </span>
        </div>
        <div
          className={classnames(styles.boxRowSubtitle)}>
          <div
            className={classnames(styles.boxSubtitleDate)}>
            <DateConverter
              styles={{fontSize: '1.6rem', lineHeight: '1.5', color: '#f3b55a'}}
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
              style={{ position: 'relative', padding: '0 12px' }}>
              {
                this.state.onDaySwitch &&
                <div
                  className={classnames(styles.boxLinkSwitchMouseOn)}/>
              }
              <span
                className={classnames(
                  "fontSubtitle_h5", styles.spanDaySwitch,
                  {
                    [styles.spanDaySwitchMouseon]: (this.state.onDaySwitch),
                    ["colorLightGrey"]: !this.state.onDaySwitch,
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
    this.setState({onDaySwitch: true});
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
