import { combineReducers } from 'redux';
import publisher from './publisher';
import app from './app';
import parameterizer from './parameterizer';

export default combineReducers({
  app,
  publisher,
  parameterizer
});
