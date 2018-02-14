import { UPDATE_PARAMETERIZER_INFORMATION, REQUEST_PARAMETERIZER_INFORMATION } from '../constants/actions';

const initialState = {
  parameters: {
    minDeposit: {
      value: 0,
      status: null,
      proposal: null,
    },
    applyStageLength: {
      value: 0,
      status: null,
      proposal: null,
    },
    commitStageLength: {
      value: 0,
      status: null,
      proposal: null,
    },
    revealStageLength: {
      value: 0,
      status: null,
      proposal: null,
    },
    dispensationPercent: {
      value: 0,
      status: null,
      proposal: null,
    },
    voteQuorum: {
      value: 0,
      status: null,
      proposal: null,
    },
  },
  isFetching: false,
};

export default function parameterizer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PARAMETERIZER_INFORMATION:
      return {...state, parameters: action.params, isFetching: false};
    case REQUEST_PARAMETERIZER_INFORMATION:
      return {...state, isFetching: true};
    default:
      return state;
  }
}
