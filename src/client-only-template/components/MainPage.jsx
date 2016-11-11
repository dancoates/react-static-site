import React from 'react';
import {connect} from 'react-redux';

class MainPage extends React.Component {
    render() {
        return <div>fdsasfd{this.props.foo}</div>
    }
}


export default connect((state) => ({
    foo : state.testReducer.foo
}))(MainPage);