import {getContractParamsNames, getParametrizerParamsNames} from '../utils/Parameterizer';
import {
  UPDATE_PARAMETERIZER_INFORMATION,
  REQUEST_PARAMETERIZER_INFORMATION,
  PARAMETERIZER_SHOW_TX_QUEUE,
  PARAMETERIZER_HIDE_TX_QUEUE,
  PROCESS_PROPOSAL,
  CANCEL_PARAMETERIZER_TX
} from '../constants/actions';
import keys from '../i18n';

const paramsList = (names) => {
  return names.map((value, index) => {
    return {displayName: keys.tableParameterNames[index], contractName: value, value: 0, status: null, proposal: null};
  });
};

const initialState = {
  parameters: paramsList(getContractParamsNames()),
  pParameters: paramsList(getParametrizerParamsNames()),
  pMinDeposit: 0,
  isFetching: false,
  showTxQueue: false,
  queue: null,
  isProcessing: false,
  transactionParameter: ''
};

export default function parameterizer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PARAMETERIZER_INFORMATION:
      return {
        ...state,
        parameters: action.params,
        pParameters: action.pParams,
        pMinDeposit: action.pMinDeposit,
        isFetching: false,
        showTxQueue: false,
        isProcessing: false
      };
    case REQUEST_PARAMETERIZER_INFORMATION:
      return { ...state, isFetching: true };
    case PARAMETERIZER_SHOW_TX_QUEUE:
      return { ...state, queue: action.queue, showTxQueue: true, transactionParameter: action.transactionParameter };
    case PARAMETERIZER_HIDE_TX_QUEUE:
      return { ...state, showTxQueue: false, transactionParameter: '' };
    case PROCESS_PROPOSAL:
      return { ...state, isProcessing: true };
    case CANCEL_PARAMETERIZER_TX:
      return { ...state, isProcessing: false };
    default:
      return state;
  }
}
