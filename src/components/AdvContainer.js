import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';
import PublisherDomainsList from './PublisherDomainsList';
import PropTypes from 'prop-types';

class AdvContainer extends Component {
  componentWillMount () {
    this.props.getAdvertiserDomains();
  }

  render () {
    const { listings } = this.props.advertiser;
    return (
      <div className='PublisherContainer'>
        <div>Advertiser page</div>
        <h3> Advertiser Application </h3>
        <Card>
          <PublisherDomainsList listings={listings} />
        </Card>

        <FlatButton label='Subscribe' />
      </div>
    );
  }
}

AdvContainer.propTypes = {
  advertiser: PropTypes.object.isRequired,
  getAdvertiserDomains: PropTypes.func.isRequired
};

export default AdvContainer;
