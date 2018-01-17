const initialState = {
  transactions: [],
};

export default function publisher (state = initialState, action) {
  switch (action.type) {
    case 'ADD_TRANSACTIONS':
      return {...state, transactions: action.transactions};
    default:
      return state;
  }
}
