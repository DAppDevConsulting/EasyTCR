import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './style.css';
import keys from '../../i18n';

import Inapplication from './statuses/Inapplication';
import Incommit1 from './statuses/Incommit-1';
import Incommit2 from './statuses/Incommit-2';
import Inreveal1 from './statuses/Inreveal-1';
import Inreveal2 from './statuses/Inreveal-2';
import RefreshInregistry1 from './statuses/Refresh-inregistry-1';
import RefreshInregistry2 from './statuses/Refresh-inregistry-2';
// import RefreshInregistryLast1 from './statuses/Refresh-inregistry-last-1'; //
// import RefreshRejected2 from './statuses/Refresh-rejected-2'; //
// import RefreshRejectedLast1 from './statuses/Refresh-rejected-last-1'; //
import Inregistry from './statuses/Inregistry';

const renderStatus = (status, whitelisted) => {
  switch (status) {
    case keys.VoteReveal:
      return whitelisted ? <Inreveal2 /> : <Inreveal1 />;
    case keys.VoteCommit:
      return whitelisted ? <Incommit2 /> : <Incommit1 />;
    case keys.inRegistry:
      return <Inregistry />;
    case keys.inApplication:
      return <Inapplication />;
    case keys.NeedRefresh:
      return whitelisted ? <RefreshInregistry2 /> : <RefreshInregistry1 />;
    default:
      return <p>{keys.notExists}</p>;
  }
};

class ListingStatus extends Component {
  constructor (props) {
    super();

    this.state = {
      isRefreshing: false
    };

    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh (name) {
    this.setState({
      isRefreshing: true
    });

    this.props.refreshListingStatus(name);
  }

  render () {
    const { status, whitelisted, name } = this.props.listing;

    return (
      <div className='listingStatus'>
        <p>{keys.statusLabel}:</p>
        { renderStatus(status, whitelisted)}
        { status === 'Need refresh'
          ? <div className='refreshStatus'>
              { this.state.isRefreshing
                ? <div className='loaderContainer'><RefreshIndicator
                    status="loading"
                    left={38}
                    top={28}
                  /></div>
                : <RaisedButton
                    label={keys.refreshLabel}
                    buttonStyle={{ backgroundColor: keys.refreshButtonColor }}
                    style={{ marginLeft: '20px' }}
                    labelStyle={{ textTransform: 'Capitalize', color: keys.tabLabelColor }}
                    onClick={() => this.handleRefresh(name)}
                  />
              }
              <p className='refreshText'>{keys.refreshNote}</p>
            </div>
          : null
        }
      </div>
    );
  }
}

ListingStatus.propTypes = {
  refreshListingStatus: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired,
};

export default ListingStatus;
