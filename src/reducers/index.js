import { combineReducers } from 'redux';
import publisher from './publisher';
import advertiser from './advertiser';
import app from './app';
import parameterizer from './parameterizer';

export default combineReducers({
  app,
  publisher,
  advertiser,
  parameterizer
});
