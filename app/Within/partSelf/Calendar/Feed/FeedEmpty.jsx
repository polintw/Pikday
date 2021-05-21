import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import classnames from 'classnames';
import styles from "./styles.module.css";
import BtnUploadDaily from '../../../../Unit/Editing/BtnUploadDaily/BtnUploadDaily.jsx';

class FeedEmpty extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot){

  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }

  render(){
    return (
      <div className={styles.comFeedEmpty}>
        <div
          className={classnames(styles.boxTitle, styles.boxEmptyDescript, "fontTitleSmall", "colorLightGrey")}>
          <span
            style={{display: 'inline-block', maxWidth: "180px"}}>
            {this.props.i18nUIString.catalog['guiding_noAccumulated_shareInvitation']}
          </span>
        </div>
        <div
          className={classnames(styles.boxInvite)}>
          <BtnUploadDaily
            {...this.props}
            _submit_Share_New={()=>{
              // close the Create by rm creating in url, and then refresh page
              let urlParams = new URLSearchParams(this.props.location.search); //we need value in URL query
              urlParams.delete('creating');
              this.props.history.replace({
                pathname: this.props.location.pathname,
                search: urlParams.toString(),
                state: {from: this.props.location}
              });
              window.location.reload();}}
            _refer_von_Create={this.props._refer_von_cosmic}/>
        </div>
      </div>
    )
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
)(FeedEmpty));
