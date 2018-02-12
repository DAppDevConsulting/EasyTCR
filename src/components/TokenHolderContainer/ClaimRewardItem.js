import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as tokenHolderActions from '../../actions/TokenHolderActions';

class ClaimRewardItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      salt: ''
    };
  }

  claimReward (challengeId) {
    this.props.tokenHolderActions.claimReward(challengeId, this.state.salt);
  }

  render () {
    const { listing } = this.props;

    return (
      <div>
        <div style={{width: '270px', paddingBottom: 30}}>
          <h4 className='headline'>{listing.listing}</h4>
          <p className='challengeId'>Challenge ID: {listing.challengeId}</p>
          <TextField
            floatingLabelText='Enter secret phrase (salt)'
            floatingLabelFixed
            value={this.state.salt}
            onChange={(e, salt) => this.setState({salt})}
          />
          <RaisedButton
            style={{ marginTop: '20px' }}
            label='ClaimReward'
            backgroundColor='#66bb6a'
            labelColor='#fff'
            onClick={() => this.claimReward(listing.challengeId)}
          />
        </div>
      </div>
    );
  }
}

ClaimRewardItem.propTypes = {
  listing: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimRewardItem);
