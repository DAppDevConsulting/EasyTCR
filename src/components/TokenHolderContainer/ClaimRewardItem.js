import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import keys from '../../i18n';

class ClaimRewardItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      salt: ''
    };
  }

  claimReward (challengeId) {
    this.props.claimReward(challengeId, this.state.salt);
  }

  render () {
    const { listing } = this.props;

    return (
      <div>
        <div style={{width: '270px', paddingBottom: 30}}>
          <h4 className='headline'>{listing.listing}</h4>
          <p className='challengeId'>{keys.challengeIdText}: {listing.challengeId}</p>
          <TextField
            floatingLabelText={keys.enterSaltText}
            floatingLabelFixed
            value={this.state.salt}
            onChange={(e, salt) => this.setState({salt})}
          />
          <RaisedButton
            style={{ marginTop: '20px' }}
            label={keys.claimRewardButtonText}
            backgroundColor={keys.successColor}
            labelColor={keys.buttonLabelColor}
            onClick={() => this.claimReward(listing.challengeId)}
          />
        </div>
      </div>
    );
  }
}

ClaimRewardItem.propTypes = {
  listing: PropTypes.object.isRequired,
  claimReward: PropTypes.func.isRequired,
};

export default ClaimRewardItem;
