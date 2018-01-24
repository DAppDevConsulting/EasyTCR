import React, { Component } from 'react';
import Card from 'material-ui/Card';
import ListingsList from './ListingsList';
import PropTypes from 'prop-types';
import keys from '../i18n';

class AdvContainer extends Component {
  componentWillMount () {
    this.props.getAdvertiserDomains();
  }

  render () {
    const { listings } = this.props.advertiser;
    const listConfig = {
      columns: [
        {propName: 'name', title: keys.consumerPage_listingName, tooltip: keys.consumerPage_listingTooltip},
        {propName: 'status', title: keys.consumerPage_listingStatus, tooltip: keys.consumerPage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.consumerPage_listingDate, tooltip: keys.consumerPage_listingDateTooltip},
        {propName: 'action', title: keys.consumerPage_listingActions, tooltip: keys.consumerPage_listingActionsTooltip}
      ]
    };
    return (
      <div className='ContentContainer'>
        <div>{keys.consumerPage_title}</div>
        <Card>
          <ListingsList
            listings={listings}
            config={listConfig}
            onListingAction={() => {}} />
        </Card>
      </div>
    );
  }
}

AdvContainer.propTypes = {
  advertiser: PropTypes.object.isRequired,
  getAdvertiserDomains: PropTypes.func.isRequired
};

export default AdvContainer;
