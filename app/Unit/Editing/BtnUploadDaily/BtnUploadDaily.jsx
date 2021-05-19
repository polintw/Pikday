import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import CreateShare from '../CreateShare.jsx';
import {
  cancelErr,
  uncertainErr
} from "../../../utils/errHandlers.js";

class BtnUploadDaily extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      axios: false,
      editingOpen: false,
      typeWriterText: '',
      onCreate: false,
      onCreateWideScreen: false,
      spaceFetched: false,
      spaceRemain: false
    };
    this.axiosSource = axios.CancelToken.source();
    this._handleEnter_Upload = this._handleEnter_Upload.bind(this);
    this._handleLeave_Upload = this._handleLeave_Upload.bind(this);
    this._handleEnter_UploadWideScreen = this._handleEnter_UploadWideScreen.bind(this);
    this._handleLeave_UploadWideScreen = this._handleLeave_UploadWideScreen.bind(this);
    this._setInterval_typeWriter = this._setInterval_typeWriter.bind(this);
    this._fetch_dailyLimit = this._fetch_dailyLimit.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.onCreateWideScreen && !prevState.onCreateWideScreen) this._setInterval_typeWriter();
  }

  componentDidMount() {
    this._fetch_dailyLimit();
  }

  componentWillUnmount() {
    if(this.state.axios){
      this.axiosSource.cancel("component will unmount.")
    }
  }

  render(){
    return(
      <div
        style={{width: '100%'}}>
        <div
          className={classnames(
            "smallDisplayNone",
            styles.comBtnUploadDaily, styles.btnBorderWide,
            {[styles.comMouseEnterWideScreen]: (this.state.onCreateWideScreen && this.state.spaceRemain)}
          )}
          onMouseEnter={this._handleEnter_UploadWideScreen}
          onMouseLeave={this._handleLeave_UploadWideScreen}>
          {
            this.state.spaceFetched &&
            <div
              className={classnames(
                styles.boxWriter)}>
                <span
                  className={classnames(
                    styles.spanWriter, 'fontNodesEqual', 'lineHeight15',
                    {
                      [styles.spanWriterTyping]: (this.state.spaceRemain && this.state.onCreateWideScreen),
                      ['colorStandard']: (this.state.spaceRemain && this.state.onCreateWideScreen),
                      ['colorGrey']: (this.state.spaceRemain && !this.state.onCreateWideScreen),
                      ['colorWhiteGrey']: !this.state.spaceRemain
                    }
                  )}>
                  {
                    this.state.spaceRemain ? ( this.state.onCreateWideScreen ? this.state.typeWriterText :
                    this.props.i18nUIString.catalog['title_upload_daily'] ) :
                    this.props.i18nUIString.catalog['title_upload_daily_noSpace']
                  }
                </span>
              </div>
          }
          {
            (this.state.spaceFetched && this.state.spaceRemain) &&
            <CreateShare
              {...this.props}
              forceCreate={this.state.editingOpen}/>
          }
        </div>
        <div
          className={classnames(
            "smallDisplayBox",
            styles.comBtnUploadDaily,
            {
              [styles.comMouseEnter]: (this.state.onCreate && this.state.spaceRemain),
              [styles.btnBorderSmall]: this.state.spaceRemain,
              [styles.btnBorderSmallNoSpace]: !this.state.spaceRemain
            }
          )}
          onTouchStart={this._handleEnter_Upload}
          onTouchEnd={this._handleLeave_Upload}
          onMouseEnter={this._handleEnter_Upload}
          onMouseLeave={this._handleLeave_Upload}>
          {
            this.state.spaceFetched &&
            <div
              className={classnames(
                styles.boxWriter)}>
                <span
                  className={classnames(
                    styles.spanWriter, 'lineHeight15',
                    {
                      ['colorWhite']: (this.state.spaceRemain && this.state.onCreate),
                      ['colorGrey']: (this.state.spaceRemain && !this.state.onCreate),
                      ['fontNodesEqual']: this.state.spaceRemain,
                      ['weightBold']: this.state.spaceRemain,
                      ['colorWhiteGrey']: !this.state.spaceRemain,
                      ['fontSubtitle']: !this.state.spaceRemain
                    }
                  )}>
                  {
                    this.state.spaceRemain ? this.props.i18nUIString.catalog['title_upload_daily'] :
                    this.props.i18nUIString.catalog['title_upload_daily_noSpace']
                  }
                </span>
              </div>
          }
          {
            (this.state.spaceFetched && this.state.spaceRemain) &&
            <CreateShare
              {...this.props}
              forceCreate={this.state.editingOpen}/>
          }
        </div>
      </div>
    )
  }

  _setInterval_typeWriter(){
    this._timer_typeWriter = setInterval(function(){
      let textShareUpload = this.props.i18nUIString.catalog["title_shareUpload_typewriter"];
      let currentTypeWriter = this.state.typeWriterText;

      if(currentTypeWriter.length < textShareUpload.length){
        this.setState((prevState,props)=>{
          return {typeWriterText: prevState.typeWriterText+ textShareUpload[prevState.typeWriterText.length]}
        })
      }
      else {
        clearInterval(this._timer_typeWriter)
      }
    }.bind(this), 200);
  }

  _handleEnter_Upload(e){
    this.setState({onCreate: true})
  }

  _handleLeave_Upload(e){
    clearInterval(this._timer_typeWriter);
    this.setState({
      typeWriterText: '',
      onCreate: false})
  }

  _handleEnter_UploadWideScreen(e){
    this.setState({onCreateWideScreen: true})
  }

  _handleLeave_UploadWideScreen(e){
    clearInterval(this._timer_typeWriter);
    this.setState({
      typeWriterText: '',
      onCreateWideScreen: false})
  }

  _fetch_dailyLimit(){
    const self = this;
    this.setState({axios: true});
    let localD = new Date();
    let header = {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'token': window.localStorage['token'] // must have token
    };

    axios({
      method: 'get',
      url: '/router/share/daily/space',
      params: {
        localTime: localD.getTime()
      },
      headers: header,
      cancelToken: this.axiosSource.token
    })
    .then((res)=>{
      let resObj = JSON.parse(res.data);

      self.setState((prevState, props)=>{
        return ({
          axios: false,
          spaceFetched: true,
          spaceRemain: resObj.main.remainDate
        });
      });
    })
    .catch(function (thrown) {
      self.setState({
        axios: false,
        spaceFetched: true
      });
      if (axios.isCancel(thrown)) {
        cancelErr(thrown);
      } else {
        let message = uncertainErr(thrown);
        if(message) alert(message);
      }
    });
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
)(BtnUploadDaily));
