import keys from '../i18n';

export const getListingItemStatusStyle = status => {
  const style = {
    borderRadius: '3px',
    padding: '4px 7px',
    backgroundColor: '#c2cad4',
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: '10px'
  };

  switch (status) {
    case keys.inRegistry:
      return { ...style, backgroundColor: keys.successColor };
    case keys.inApplication:
      return { ...style, backgroundColor: keys.inChallengeColor };
    default:
      return style;
  }
};
