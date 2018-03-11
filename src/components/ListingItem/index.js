import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Icon from './icon';
import keys from '../../i18n';
import ListingHeader from './ListingHeader';

class ListingItem extends Component {
  render () {
    const { listing } = this.props;

    return (
      <div className='listing'>
        <ListingHeader {...this.props} />
        <div className='listingContent'>
          {
            listing.description
              ? <p>{listing.description}</p>
              : <div>
                <Icon color={keys.accentColor} />
                <p>{keys.contentNotAvailable}</p>
              </div>
          }
        </div>
      </div>
    );
  }
}

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired
};

export default ListingItem;
