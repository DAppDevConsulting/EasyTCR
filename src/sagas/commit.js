import { takeEvery, put, call, select, apply } from 'redux-saga/effects';
import { PLCRVoting } from 'ethereum-tcr-api';
import { commitVote as getCommitVoteTx } from '../transactions';
import { REVEAL_SHOW_TX_QUEUE, COMMIT_SEND } from '../constants/actions';

export function * commitVote (action) {
  // {id: Number, salt: Number, option: Number, stake: Number}
  let hash = PLCRVoting.makeSecretHash(action.option, action.salt);
  let queue = yield call(getCommitVoteTx, action.id, hash, action.stake);

  yield put({ type: COMMIT_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(COMMIT_SEND, commitVote);
};
