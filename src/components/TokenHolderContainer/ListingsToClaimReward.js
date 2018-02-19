import React from 'react';
import PropTypes from 'prop-types';
import ClaimRewardItem from './ClaimRewardItem';
import keys from '../../i18n';

const ListingsToClaimReward = ({ listingsToClaimReward, claimReward }) => (
  <div>
    <h3>{keys.claimRewardText}</h3>
    { listingsToClaimReward.map((item, index) =>
        <ClaimRewardItem listing={item} key={index} claimReward={claimReward} />
    )}
  </div>
);

ListingsToClaimReward.propTypes = {
  listingsToClaimReward: PropTypes.array.isRequired,
  claimReward: PropTypes.func.isRequired,
};

export default ListingsToClaimReward;
