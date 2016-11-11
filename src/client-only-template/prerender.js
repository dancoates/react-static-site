import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {match, createMemoryHistory, RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import store from 'client-only-template/store';
import routes from 'client-only-template/routes';
import Index from 'client-only-template/index.static';


export default (locals, callback) => {
    const history = createMemoryHistory();
    const location = history.createLocation(locals.path);

    match({routes, location}, (error, redirectLocation, renderProps) => {
        if(!error) {

            const pageContent = ReactDOMServer.renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            );

            callback(null, '<!DOCTYPE html>' +  ReactDOMServer.renderToString(<Index content={pageContent}/>));
        }
    });
    
};

