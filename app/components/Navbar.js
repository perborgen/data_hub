import React from "react";

export default class NavBar extends React.Component {
	
	constructor(props){
		super(props);
	}


	render () {
		let userName = this.props.user.userName || "Profile";
		let rightNavbar;
		if (this.props.user.logged_in){
			 rightNavbar = (				        
				<li className="dropdown">
		          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{userName} <span className="caret"></span></a>
		          <ul className="dropdown-menu">
		            <li><a href="/account">Profile</a></li>
		            <li><a href="/upload">Upload data</a></li>
		            <li role="separator" className="divider"></li>
		            <li><a href="/logout">Log out</a></li>
		          </ul>
		        </li>
		    );
		}
		else {
			rightNavbar = (<li><a href="/login">Github Login</a></li>);
		}
		

		return (
			<div>
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="navbar-header">
				      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
				        <span className="sr-only">Toggle navigation</span>
				        <span className="icon-bar"></span>
				        <span className="icon-bar"></span>
				        <span className="icon-bar"></span>
				      </button>
				      <a className="navbar-brand" href="/">datahub</a>
				    </div>
				    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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