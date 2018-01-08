import { combineReducers } from 'redux';
import publisher from './publisher';
import app from './app';

export default combineReducers({
  app,
  publisher
});
