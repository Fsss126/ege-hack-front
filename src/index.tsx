import 'definitions/polyfills';
import 'definitions/mixins';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";
import {APP_BASE_URL} from "definitions/constants";
import {createAppStore} from "store";

const store = createAppStore();

ReactDOM.render((
    <Provider store={store}>
        <Router basename={APP_BASE_URL}>
            <App/>
        </Router>
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
