import { combineReducers } from 'redux';
import publisher from './publisher';
import advertiser from './advertiser';
import app from './app';
import parameterizer from './parameterizer';
import challenge from './challenge';

export default combineReducers({
  app,
  publisher,
  advertiser,
  parameterizer,
  challenge
});
