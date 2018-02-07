import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import './style.css';
// todo: make one status component and pass props
import Inapplication from './Inapplication';
import Inreveal from './Inreveal';
import Incommit from './Incommit';
import Inregistry from './Inregistry';
// import InregistryAfter from './InregistryAfter';
import NeedRefresh from './NeedRefresh';
import Rejected from './Rejected';
import keys from '../../i18n';

const renderStatus = status => {
  switch (status) {
    case keys.VoteReveal:
      return <Inreveal />;
    case keys.VoteCommit:
      return <Incommit />;
    case keys.inRegistry:
      return <Inregistry />;
    // case keys:
    //   return <Rejected />;
    case keys.inApplication:
      return <Inapplication />;
    case keys.NeedRefresh:
      return <NeedRefresh />;
    // in application
    default:
      return null;
      // return <Inreveal />;
  }
};

const ListingStatus = ({ status }) => (
  <div className='listingStatus'>
    <p>Status:</p>
    { renderStatus(status)}
    { status === 'Need refresh'
      ? <div className='refreshStatus'>
          <RaisedButton
            label='Refresh'
            buttonStyle={{ backgroundColor: 'rgba(153, 153, 153, 0.2)' }}
            style={{ marginLeft: '20px' }}
            labelStyle={{ textTransform: 'Capitalize', color: '#3f536e' }}
            icon={<FontIcon className='fa fa-spinner fa-spin' />}
          />
          <p>To update candidate’s status in TCR proceed with refresh transaction.</p>
        </div>
      : null
    }
  </div>
);

ListingStatus.propTypes = {
  status: PropTypes.string.isRequired
};

export default ListingStatus;
