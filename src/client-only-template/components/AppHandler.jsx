import React from 'react';
import {Link} from 'react-router';

export default (props) => {
    return <div>
        <h1>client-only-template</h1>
        <Link to="/">Main Page</Link>
        <Link to="/other">Other Page</Link>
        {props.children}
    </div>
}
