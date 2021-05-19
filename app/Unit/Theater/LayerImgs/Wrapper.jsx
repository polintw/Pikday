import React from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import styles from './styles.module.css';
import ImgsFrame from './ImgsFrame.jsx';
import NodesExtensible from '../../NodesDisplay/NodesExtensible.jsx';

class Wrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    };
  }


  render(){
    let nodesTitleObj = this.props.unitCurrent.nouns;
    if(this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId) != (-1) ){ // guidingNails has its special title
      nodesTitleObj = {
        list: [4692], // an empty position in DB, to prevent a conflict between real node
        basic: {
          4692: {name: this.props.i18nUIString.catalog['title_onBoard_GuideNailTitle'][this.props.guidingNailsId.indexOf(this.props.unitCurrent.unitId)]}
        }
      }
    };

    return(
      <div
        className={classnames( styles.comWrapper)}>
        <div
          className={classnames(styles.boxContentWidth, styles.boxTitle)}>
          <NodesExtensible
            nouns={nodesTitleObj}
            _referNode={this.props._refer_toandclose}/>

        </div>
        <div
          className={classnames(
            styles.boxContentImgWidth, styles.boxFrame,
            {[styles.boxFrameAuthor]: (this.props.unitCurrent.identity == "author")}
            )}>
          <ImgsFrame
            moveCount={this.props.moveCount}
            lockify={this.props.lockify}
            marksStatus={this.props.marksStatus}
            _set_markOpened={this.props._set_markOpened}
            _set_layerstatus={this.props._set_layerstatus}/>
        </div>

      </div>
    )
  }

}

const mapStateToProps = (state)=>{
  return {
    userInfo: state.userInfo,
    guidingNailsId: state.guidingNailsId,
    unitCurrent: state.unitCurrent,
    i18nUIString: state.i18nUIString
  }
}

export default withRouter(connect(
  mapStateToProps,
  null
)(Wrapper));
