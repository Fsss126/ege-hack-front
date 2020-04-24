import 'definitions/polyfills';
import 'definitions/mixins';

import App from 'components/App';
import {APP_BASE_URL} from 'definitions/constants';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {createAppStore} from 'store';

import * as serviceWorker from './serviceWorker';

const store = createAppStore();

ReactDOM.render(
  <Provider store={store}>
    <Router basename={APP_BASE_URL}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
