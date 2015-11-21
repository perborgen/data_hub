  
/**

 * client.js
 * =========
 * Client-side entry point.
 *
 * @author: Ben Gundersen
 */
'use strict';

// For ES6/Babel, this is the exact same thing as: var React = require('react');
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router'
import Main from "./components/Main";
import ContentContainer from "./components/Dataset/ContentContainer";
import LandingPage from "./components/LandingPage/LandingPage";
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Account from "./components/Account/Account";
import Upload from "./components/Upload/Upload";
// Renders to the 'root' div (see index.html)
//        <Route path="dataset" component={ContentContainer} >

var routes = (
	<Router history={createBrowserHistory()}>    
  	<Route path="/" component={Main}>
        <IndexRoute component={LandingPage} />
        <Route path="account" component={Account}/>
        <Route path="upload" component={Upload}/>
        <Route path="login" component={Main}/>
        <Route path=":datasetId" component={ContentContainer} />
      </Route>
    </Router>
);

render(routes, document.getElementById('root'));
