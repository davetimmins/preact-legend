import './index.css'

import {h, render} from 'preact'

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

if (process.env.NODE_ENV === 'development') {
  // Enable preact devtools
  require('preact/devtools')
}

import AppReducers from './reducers/app-reducers';

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error
});

let root
function init() {
  let App = require('./components/app-main').default
  const store = createStore(AppReducers, applyMiddleware(thunk, logger));
  root = render(
    <Provider store={store}>
      <App />
    </Provider>, 
    document.querySelector('#app'), 
    root)
}

if (module.hot) {
  module.hot.accept('./components/app-main', init)
}

init()
