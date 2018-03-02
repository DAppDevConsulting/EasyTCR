import {
  UPDATE_PARAMETERIZER_INFORMATION,
  REQUEST_PARAMETERIZER_INFORMATION,
  PARAMETERIZER_SHOW_TX_QUEUE,
  PARAMETERIZER_HIDE_TX_QUEUE,
  PROCESS_PROPOSAL
} from '../constants/actions';
import keys from '../i18n';

const initialState = {
  parameters: [
    {
      displayName: keys.tableParameterNames[0],
      contractName: keys.contractParameterNames[0],
      value: 0,
      status: null,
      proposal: null
    },
    {
      displayName: keys.tableParameterNames[1],
      contractName: keys.contractParameterNames[1],
      value: 0,
      status: null,
      proposal: null
    },
    {
      displayName: keys.tableParameterNames[2],
      contractName: keys.contractParameterNames[2],
      value: 0,
      status: null,
      proposal: null
    },
    {
      displayName: keys.tableParameterNames[3],
      contractName: keys.contractParameterNames[3],
      value: 0,
      status: null,
      proposal: null
    },
    {
      displayName: keys.tableParameterNames[4],
      contractName: keys.contractParameterNames[4],
      value: 0,
      status: null,
      proposal: null
    },
    {
      displayName: keys.tableParameterNames[5],
      contractName: keys.contractParameterNames[5],
      value: 0,
      status: null,
      proposal: null
    }
  ],
  pMinDeposit: 0,
  isFetching: false,
  showTxQueue: false,
  queue: null,
  isProcessing: false
};

export default function parameterizer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_PARAMETERIZER_INFORMATION:
      return {
        ...state,
        parameters: action.params,
        pMinDeposit: action.pMinDeposit,
        isFetching: false,
        showTxQueue: false,
        isProcessing: false
      };
    case REQUEST_PARAMETERIZER_INFORMATION:
      return { ...state, isFetching: true };
    case PARAMETERIZER_SHOW_TX_QUEUE:
      return { ...state, queue: action.queue, showTxQueue: true };
    case PARAMETERIZER_HIDE_TX_QUEUE:
      return { ...state, showTxQueue: false };
    case PROCESS_PROPOSAL:
      return { ...state, isProcessing: true };
    default:
      return state;
  }
}
