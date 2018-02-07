import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './style.css';
import keys from '../../i18n';

import Inapplication from './Inapplication';
import Incommit1 from './Incommit-1';
import Incommit2 from './Incommit-2';
import Inreveal1 from './Inreveal-1';
import Inreveal2 from './Inreveal-2';
import RefreshInregistry1 from './Refresh-inregistry-1';
import RefreshInregistry2 from './Refresh-inregistry-2';
// import RefreshInregistryLast1 from './Refresh-inregistry-last-1'; //
// import RefreshRejected2 from './Refresh-rejected-2'; //
// import RefreshRejectedLast1 from './Refresh-rejected-last-1'; //
import Inregistry from './Inregistry';


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
      return null;
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

  handleRefresh () {
    this.setState({
      isRefreshing: true
    });
  }

  render () {
    const { status, whitelisted } = this.props;

    return (
      <div className='listingStatus'>
        <p>Status:</p>
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
                    label='Refresh'
                    buttonStyle={{ backgroundColor: 'rgba(153, 153, 153, 0.2)' }}
                    style={{ marginLeft: '20px' }}
                    labelStyle={{ textTransform: 'Capitalize', color: '#3f536e' }}
                    onClick={this.handleRefresh}
                  />
              }
              <p>To update candidate’s status in TCR proceed with refresh transaction.</p>
            </div>
          : null
        }
      </div>
    );
  }
}

ListingStatus.propTypes = {
  status: PropTypes.string.isRequired,
  whitelisted: PropTypes.bool.isRequired
};

export default ListingStatus;
