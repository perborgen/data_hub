import React from "react";
import ReactDOM from 'react-dom';

export default class NavBar extends React.Component {

	constructor(props){
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.state = {
			searchText: ""
		}
	}

	onSearch(ev) {
		//ev.preventDefault();
		let searchText = ReactDOM.findDOMNode(this.refs.searchText).value;
		this.props.onSearch(searchText);
		this.setState({
			searchText: searchText
		});
	}

	render () {
		let userName = this.props.user.userName || "Profile";
		let rightNavbar;
		if (this.props.user.logged_in) {
			 rightNavbar = (				        
				<li className="dropdown">
		          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{userName} <span className="caret"></span></a>
					<ul className="dropdown-menu">
						<li><a href="/account">Profile</a></li>
						<li role="separator" className="divider"></li>
						<li><a href="/logout">Log out</a></li>
					</ul>
		        </li>
		    );
		}
		else {
			rightNavbar = (<li><a href="/login">Github Login</a></li>);
		}
		let searchLink = "/search/" + this.state.searchText;

		return (
			<div>
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="navbar-header">
				      	<button 
				      		type="button" 
				      		className="navbar-toggle collapsed" 
				      		data-toggle="collapse" 
				      		data-target="#bs-example-navbar-collapse-1" 
				      		aria-expanded="false">
					        <span className="sr-only">Toggle navigation</span>
					        <span className="icon-bar"></span>
					        <span className="icon-bar"></span>
					        <span className="icon-bar"></span>
				      	</button>
				      	<a 
				      		className="navbar-brand" 
				      		href="/">Datasets.co
				      	</a>
				    </div>
				    <div
				    	className="collapse navbar-collapse" 
				    	id="bs-example-navbar-collapse-1">
				    <ul className="nav navbar-nav">	
					    <form 
					    	action={searchLink}
					    	onSubmit={this.onSearch}
					    	className="navbar-form navbar-left" 
					    	role="search">
				        	<input 
				        		type="text"
				        		ref="searchText"
				        		className="form-control" 
				        		placeholder="Search" />
				        	<button style={{marginLeft: '5px'}}type="submit" className="btn btn-default">Search</button>
			      	</form>
			      	 <li><a href="/upload" style={{fontSize: '15px'}}>Upload dataset</a></li>
				   </ul>
				    <ul className="nav navbar-nav navbar-right">
				      	{rightNavbar}
				    </ul>
				    </div>
				  </div>
				</nav>
			</div>
		);
	}
}

/*
				    <ul className="nav navbar-nav">
				    	<li><a href="/request">Request dataset</a></li>
					</ul>*/