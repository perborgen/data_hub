import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router'
import Main from "./components/Main";
import Dataset from "./components/Dataset";
import ContentContainer from "./components/Dataset/ContentContainer";
import LandingPage from "./components/LandingPage";
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Account from "./components/Account/Account";
import DatasetForm from "./components/DatasetForm";
import RequestForm from "./components/RequestForm";
import Request from "./components/Request/index";
import RequestDescription from "./components/Request/RequestDescription";
import Tag from "./components/Tag/Tag";
import Tags from "./components/Tag/Tags";
import Search from "./components/Search/Search";
import SearchResults from "./components/Search/SearchResults";
import TestUpload from './components/TestUpload';

var routes = (
	<Router history={createBrowserHistory()}>
        <Route path="/" component={Main}>
            <IndexRoute component={LandingPage} />
            <Route path="account" component={Account}/>
            <Route path="upload" component={DatasetForm}/>
            <Route path="tag" component={Tag}>
            	<Route path=":tagId" component={Tags} />
            </Route>
            <Route path="login" component={Main}/>
            <Route path="request" component={RequestForm}/>
            <Route path="dataset" component={Dataset}>
                <Route path=":datasetId" component={ContentContainer} />
            </Route>
            <Route path="request" component={Request}>
                <Route path=":requestId" component={RequestDescription} />
            </Route>
            <Route path="search" component={Search}>
                <Route path=":searchQuery" component={SearchResults} />
            </Route>
            <Route path="testupload" component={TestUpload}/>

        </Route>
    </Router>
);

render(routes, document.getElementById('root'));


