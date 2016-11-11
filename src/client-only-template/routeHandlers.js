
import AppHandler from 'client-only-template/components/AppHandler';
import ErrorHandler from 'client-only-template/components/ErrorHandler';
import MainPage from 'client-only-template/components/MainPage';
import OtherPage from 'client-only-template/components/OtherPage';

// Use module exports here so it can be stubbed in webpack build.
// proxyquire doesn't like es6 exports
module.exports = {
    AppHandler,
    ErrorHandler,
    MainPage,
    OtherPage
};
