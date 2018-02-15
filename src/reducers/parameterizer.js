import { UPDATE_PARAMETERIZER_INFORMATION } from '../constants/actions';

const initialState = {
  minDeposit: 0
};

export default function parameterizer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PARAMETERIZER_INFORMATION:
      return {...state, ...action.params};

    default:
      return state;
  }
}
