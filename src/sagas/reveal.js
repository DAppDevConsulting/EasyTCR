import { takeEvery, put, call } from 'redux-saga/effects';
import BN from 'bn.js';
import { revealVote as getRevealVoteTx } from '../transactions';
import { REVEAL_SHOW_TX_QUEUE, REVEAL_SEND } from '../constants/actions';

export function * revealVote (action) {
  // action: {id: Number, salt: Number, option: Number}
  let queue = yield call(getRevealVoteTx, action.id, action.option, new BN(action.salt, 16));

  yield put({ type: REVEAL_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(REVEAL_SEND, revealVote);
};
