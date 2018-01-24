import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import PublisherDomainsList from './PublisherDomainsList';

class TokenHolderContainer extends Component {
  componentWillMount () {
    this.props.getAdvertiserDomains();
  }

  render () {
    const { listings } = this.props.advertiser;
    return (
      <div className='ContentContainer'>
        <div>Overview</div>
        <h3> Publisher Application </h3>
        <Card>
          <PublisherDomainsList listings={listings} />
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
