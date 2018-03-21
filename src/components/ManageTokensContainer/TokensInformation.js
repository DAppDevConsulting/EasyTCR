import React from 'react';
import PropTypes from 'prop-types';
import keys from '../../i18n';

const TokensInformation = ({
  tokens,
  approvedRegistry,
  approvedPLCR,
  approvedParameterizer,
  votingRights,
  isFetchingBalance,
  ethers
}) => {
  const balanceText = keys.formatString(
    keys.manageTokensPage_balanceText,
    { tokens, tokenName: keys.tokenName, ethers, eth: keys.eth }
  );

  const registryApproveText = keys.formatString(
    keys.manageTokensPage_approvedRegistryText,
    { tokens: approvedRegistry, tokenName: keys.tokenName }
  );
  const plcrApproveText = keys.formatString(
    keys.manageTokensPage_approvedPLCRText,
    { tokens: approvedPLCR, tokenName: keys.tokenName }
  );
  const parameterizerText = keys.formatString(
    keys.manageTokensPage_approvedParameterizerText,
    { tokens: approvedParameterizer, tokenName: keys.tokenName }
  );
  const votingRightsText = keys.formatString(
    keys.manageTokensPage_votingRightsText,
    { rights: votingRights }
  );

  return (
    <div>
      <h4 className='pageHeadline'>{keys.manageTokensPage_title}</h4>
      <h3 className='manageTokensTitle'> {keys.manageTokensPage_balanceHeader} </h3>
      <p className='balanceText'>{isFetchingBalance ? keys.updating : balanceText }</p>
      <p className='balanceText'>{approvedRegistry ? registryApproveText : keys.updating }</p>
      <p className='balanceText'>{approvedPLCR ? plcrApproveText : keys.updating }</p>
      <p className='balanceText'>{approvedParameterizer ? parameterizerText : keys.updating }</p>
      <p className='balanceText'>{votingRights ? votingRightsText : keys.updating }</p>
    </div>
  );
};

TokensInformation.propTypes = {
  tokens: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  approvedRegistry: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  approvedPLCR: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  approvedParameterizer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  votingRights: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ethers: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default TokensInformation;
