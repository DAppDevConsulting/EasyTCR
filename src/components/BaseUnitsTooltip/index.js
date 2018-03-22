import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';

const BaseUnitsTooltip = ({ style }) => {
  let size = 36;
  let padding = 5;

  return (
    <IconButton
      style={{width: size, height: size, marginLeft: -size + padding, padding, ...style}}
      iconStyle={{width: size / 2, height: size / 2, color: 'rgb(229, 229, 229)'}} tooltip='Amount in base units'>
      <HelpIcon />
    </IconButton>
  );
};

BaseUnitsTooltip.defaultProps = {
  style: {}
};

BaseUnitsTooltip.propTypes = {
  style: PropTypes.object
};

export default BaseUnitsTooltip;
