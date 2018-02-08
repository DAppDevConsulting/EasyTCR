import { combineReducers } from 'redux';
import publisher from './publisher';
import advertiser from './advertiser';
import app from './app';
import parameterizer from './parameterizer';
import challenge from './challenge';
import commit from './commit';
import reveal from './reveal';
import refreshStatus from './refreshStatus';

export default combineReducers({
  app,
  publisher,
  advertiser,
  parameterizer,
  challenge,
  commit,
  reveal,
  refreshStatus,
});
