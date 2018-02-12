import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ClaimRewardItem from './ClaimRewardItem';

import * as tokenHolderActions from '../../actions/TokenHolderActions';

class ListingsToClaimReward extends Component {
  /*componentWillMount () {
    console.log('i will mount')
    this.props.tokenHolderActions.requestListingsToClaimReward();
  }*/

  render () {
    const { listingsToClaimReward } = this.props.tokenHolder;

    return (
      <div>
        <h3>Listings to claim reward</h3>
        {listingsToClaimReward.map((item, index) => {
          return (<ClaimRewardItem listing={item} key={index} />);
        })}
      </div>
    );
  }
}
ListingsToClaimReward.propTypes = {
  tokenHolder: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  tokenHolder: state.tokenHolder
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingsToClaimReward);
