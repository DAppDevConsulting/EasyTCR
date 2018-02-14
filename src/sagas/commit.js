import { takeEvery, put, call } from 'redux-saga/effects';
import { PLCRVoting } from 'ethereum-tcr-api';
import BN from 'bn.js';
import { commitVote as getCommitVoteTx } from '../transactions';
import { COMMIT_SHOW_TX_QUEUE, COMMIT_SEND } from '../constants/actions';

export function * commitVote (action) {
  // {id: Number, salt: Number, option: Number, stake: Number}
  let hash = PLCRVoting.makeSecretHash(action.option, new BN(action.salt, 16));
  let queue = yield call(getCommitVoteTx, action.id, hash, action.stake);

  yield put({ type: COMMIT_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(COMMIT_SEND, commitVote);
};
