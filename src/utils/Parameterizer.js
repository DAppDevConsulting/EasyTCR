import keys from '../i18n';

export const getReadableStatus = status => {
  switch (status) {
    case 'NeedProcess':
      return keys.NeedProcess;
    case 'VoteCommit':
      return keys.VoteCommit;
    case 'VoteReveal':
      return keys.VoteReveal;
    case 'NeedProcessToReject':
      return keys.NeedProcessToReject;
    default:
      return keys.NewValue;
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
    case keys.Actual:
      return { ...style, backgroundColor: keys.successColor };
    case keys.NewValue:
      return { ...style, backgroundColor: keys.inChallengeColor };
    default:
      return style;
  }
};

export const getActionButtonLabel = status => {
  switch (status) {
    case keys.Actual:
      return keys.actionEdit;
    case keys.NewValue:
      return keys.actionChallenge;
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

export const getContractParamsNames = () => {
  return ['minDeposit', 'applyStageLen', 'commitStageLen', 'revealStageLen', 'dispensationPct', 'voteQuorum'];
};

export const getParametrizerParamsNames = () => {
  return ['pMinDeposit', 'pApplyStageLen', 'pCommitStageLen', 'pRevealStageLen', 'pDispensationPct', 'pVoteQuorum'];
};

export const numberWithSpaces = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
