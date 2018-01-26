const initialState = {
  transactions: [],
  registry: '',
  registries: []
};

export default function publisher (state = initialState, action) {
  switch (action.type) {
    case 'ADD_TRANSACTIONS':
      return {...state, transactions: action.transactions};
    case 'UPDATE_REGISTRIES_LIST':
      return {...state, registries: action.registries};
    case 'REGISTRY_CHANGED' :
      return {...state, registry: action.registry};
    default:
      return state;
  }
}
