import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router'
import Main from "./components/Main";
import Dataset from "./components/Dataset/Dataset";
import ContentContainer from "./components/Dataset/ContentContainer";
import LandingPage from "./components/LandingPage/LandingPage";
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Account from "./components/Account/Account";
import Upload from "./components/Upload/Upload";
import Tag from "./components/Tag/Tag";
import Tags from "./components/Tag/Tags";
import Search from "./components/Search/Search";
import SearchResults from "./components/Search/SearchResults";


var routes = (
	<Router history={createBrowserHistory()}>
        <Route path="/" component={Main}>
            <IndexRoute component={LandingPage} />
            <Route path="account" component={Account}/>
            <Route path="upload" component={Upload}/>
            <Route path="tag" component={Tag}>
            	<Route path="t/:tagId" component={Tags} />
            </Route>
            <Route path="login" component={Main}/>
            <Route path="dataset" component={Dataset}>
                <Route path="d/:datasetId" component={ContentContainer} />
            </Route>
            <Route path="search" component={Search}>
                <Route path=":searchQuery" component={SearchResults} />
            </Route>
        </Route>
    </Router>
);

render(routes, document.getElementById('root'));


