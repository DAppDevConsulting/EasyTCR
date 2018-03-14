import { combineReducers } from 'redux';
import candidate from './candidate';
import consumer from './consumer';
import app from './app';
import parameterizer from './parameterizer';
import challenge from './challenge';
import commit from './commit';
import reveal from './reveal';
import tokenHolder from './tokenHolder';
import deposit from './deposit';

export default combineReducers({
  app,
  candidate,
  consumer,
  parameterizer,
  challenge,
  commit,
  reveal,
  tokenHolder,
  deposit
});
