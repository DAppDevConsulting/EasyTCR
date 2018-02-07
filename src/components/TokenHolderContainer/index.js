import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import ListingsList from '../ListingsList';
import keys from '../../i18n';
import {bindActionCreators} from 'redux';
import * as advertiserActions from '../../actions/AdvertiserActions';
import {connect} from 'react-redux';

class TokenHolderContainer extends Component {
  constructor (props) {
    super(props);
    this.listConfig = {
      columns: [
        {propName: 'label', title: keys.tokenHolderPage_listingName, tooltip: keys.tokenHolderPage_listingTooltip},
        {propName: 'status', title: keys.tokenHolderPage_listingStatus, tooltip: keys.tokenHolderPage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.tokenHolderPage_listingDate, tooltip: keys.tokenHolderPage_listingDateTooltip},
        {propName: 'action', title: keys.tokenHolderPage_listingActions, tooltip: keys.tokenHolderPage_listingActionsTooltip}
      ]
    };
  }

  componentWillMount () {
    this.props.advertiserActions.getAdvertiserDomains();
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

function mapStateToProps (state) {
  return {
    advertiser: state.advertiser
  };
}

function mapDispatchToProps (dispatch) {
  return {
    advertiserActions: bindActionCreators(advertiserActions, dispatch)
  };
}

TokenHolderContainer.propTypes = {
  advertiser: PropTypes.object.isRequired,
  advertiserActions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenHolderContainer);
