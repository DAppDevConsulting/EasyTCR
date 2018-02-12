import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import ListingsList from '../ListingsList';
import ListingsToClaimReward from './ListingsToClaimReward';
import keys from '../../i18n';
import { bindActionCreators } from 'redux';
import * as consumerActions from '../../actions/ConsumerActions';
import { connect } from 'react-redux';
import * as tokenHolderActions from '../../actions/TokenHolderActions';

class TokenHolderContainer extends Component {
  constructor (props) {
    super(props);

    this.listConfig = {
      columns: [
        {propName: 'name', title: keys.tokenHolderPage_listingName, tooltip: keys.tokenHolderPage_listingTooltip},
        {propName: 'status', title: keys.tokenHolderPage_listingStatus, tooltip: keys.tokenHolderPage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.tokenHolderPage_listingDate, tooltip: keys.tokenHolderPage_listingDateTooltip},
        {propName: 'action', title: keys.tokenHolderPage_listingActions, tooltip: keys.tokenHolderPage_listingActionsTooltip}
      ]
    };
  }

  componentWillMount () {
    this.props.consumerActions.getConsumerListings();
    this.props.tokenHolderActions.requestListingsToClaimReward();
  }

  render () {
    const { listings } = this.props.consumer;
    const { listingsToClaimReward } = this.props.tokenHolder;
    const showRewardsBlock = listingsToClaimReward && listingsToClaimReward.length;
    return (
      <div className='ContentContainer'>
        <div>{keys.tokenHolderPage_title}</div>
        <div className='ListingContainer'>
          <Card>
            <ListingsList
              listings={listings}
              config={this.listConfig}
            />
          </Card>
          {showRewardsBlock
            ? <Card style={{width: 300, paddingLeft: 30, marginLeft: 30}}>
              <ListingsToClaimReward />
            </Card>
            : ''}
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    consumer: state.consumer,
    tokenHolder: state.tokenHolder
  };
}

function mapDispatchToProps (dispatch) {
  return {
    consumerActions: bindActionCreators(consumerActions, dispatch),
    tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
  };
}

TokenHolderContainer.propTypes = {
  consumer: PropTypes.object.isRequired,
  tokenHolder: PropTypes.object.isRequired,
  consumerActions: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenHolderContainer);
