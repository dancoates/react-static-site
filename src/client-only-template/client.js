import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import store from 'client-only-template/store';
import routes from 'client-only-template/routes';
import 'client-only-template/sass/styles.scss';

const appElement = document.getElementById('client-only-template');

ReactDOM.render((
    <Provider store={store}>
        <Router history={browserHistory} routes={routes}/>
    </Provider>
), appElement);
