import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {match, createMemoryHistory, RouterContext} from 'react-router';
import {Provider} from 'react-redux';
import store from 'client-only-template/store';
import routes from 'client-only-template/routes';
import Index from 'client-only-template/index.static';


module.exports = (locals, callback) => {
    const history = createMemoryHistory();
    const location = history.createLocation(locals.path);

    // weird way to get css path but webpack doesn't expose 
    // extract-text-plugin's output in any other way
    const css = Object.keys(locals.webpackStats.compilation.assets)
        .filter(filename => filename.match(/\.css$/))
        .map(filename => '/' + filename);

    const scripts = Object.keys(locals.assets)
        .filter(key => locals.assets[key].match(/\.js$/) && !key.match(/^__/))
        .map(key => locals.assets[key]);


    match({routes, location}, (error, redirectLocation, renderProps) => {
        if(!error) {

            const pageContent = process.env.NODE_ENV === 'production' ? ReactDOMServer.renderToString(
                <Provider store={store}>
                    <RouterContext {...renderProps} />
                </Provider>
            ) : '';

            callback(
                null,
                '<!DOCTYPE html>' +
                ReactDOMServer.renderToString(<Index
                    content={pageContent}
                    scripts={scripts}
                    css={css}
                />)
            );
        }
    });
    
};

