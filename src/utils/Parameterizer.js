import keys from '../i18n';

export const getProposalValue = (proposals, parameterName) =>
  proposals.find(x => x.name === parameterName)
    ? proposals.find(x => x.name === parameterName).value
    : null;

export const getReadableStatus = status => {
  switch (status) {
    case 'NeedProcess':
      return keys.NeedProcess;
    case 'VoteCommit':
      return keys.VoteCommit;
    case 'VoteReveal':
      return keys.VoteReveal;
    default:
      return keys.inChallenge;
  }
};

export const getStatusStyle = status => {
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
    case keys.VoteCommit:
      return { ...style, backgroundColor: keys.inChallengeColor };
    default:
      return style;
  }
};

export const getActionButtonLabel = status => {
  switch (status) {
    case keys.inRegistry:
      return keys.actionEdit;
    case keys.VoteCommit:
      return keys.actionVote;
    case keys.VoteReveal:
      return keys.actionReveal;
    case keys.NeedProcess:
      return keys.actionProcess;
    default:
      return 'Action';
  }
};

export const numberWithSpaces = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
