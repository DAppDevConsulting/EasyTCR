import { UPDATE_PARAMETERIZER_INFORMATION, REQUEST_PARAMETERIZER_INFORMATION } from '../constants/actions';
import keys from '../i18n';

const initialState = {
  parameters: [
    {
      name: keys.tableParameterNames[0],
      value: 0,
      status: null,
      proposal: null,
    },
    {
      name: keys.tableParameterNames[1],
      value: 0,
      status: null,
      proposal: null,
    },
    {
      name: keys.tableParameterNames[2],
      value: 0,
      status: null,
      proposal: null,
    },
    {
      name: keys.tableParameterNames[3],
      value: 0,
      status: null,
      proposal: null,
    },
    {
      name: keys.tableParameterNames[4],
      value: 0,
      status: null,
      proposal: null,
    },
    {
      name: keys.tableParameterNames[5],
      value: 0,
      status: null,
      proposal: null,
    },
  ],
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
