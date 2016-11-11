import React from 'react';


export default (props) => {
    return <html lang="">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
            <title>client-only-templates</title>
            <meta name="description" content=""/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="stylesheet" href="/style.css"/>
        </head>
        <body>
            <div id="client-only-template" dangerouslySetInnerHTML={{__html: props.content}}></div>
            <script type="text/javascript" src="/client-only-template.js"></script>
        </body>
    </html>;
}
