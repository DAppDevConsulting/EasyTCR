const initialState = {
  transactions: [],
  transactionsModalOpened: false
};

export default function publisher (state = initialState, action) {
  switch (action.type) {
    case 'ADD_TRANSACTIONS':
      return {...state, transactions: action.transactions};
    case 'SHOW_TRANSACTIONS_MODAL':
      return {...state, transactionsModalOpened: true};
    case 'HIDE_TRANSACTIONS_MODAL':
      return {...state, transactionsModalOpened: false};
    default:
      return state;
  }
}
