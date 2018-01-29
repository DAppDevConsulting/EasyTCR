import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import ListingsList from '../ListingsList';
import keys from '../../i18n';

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
    this.props.getAdvertiserDomains();
  }

  render () {
    const { listings } = this.props.advertiser;
    return (
      <div className='ContentContainer'>
        <div>{keys.tokenHolderPage_title}</div>
        <Card>
          <ListingsList
            listings={listings}
            config={this.listConfig}
          />
        </Card>
      </div>
    );
  }
}

TokenHolderContainer.propTypes = {
  advertiser: PropTypes.object.isRequired,
  getAdvertiserDomains: PropTypes.func.isRequired
};

export default TokenHolderContainer;
