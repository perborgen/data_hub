import React from "react";
import Request from 'superagent';

export default class Account extends React.Component {

	constructor(props){
		super(props);
	}

	render () {
		return (
			<div>
				<div className="col-md-10 col-md-offset-1 
								col-sm-10 col-sm-offset-1  
								col-lg-10 col-lg-offset-1 
								col-xs-10 col-xs-offset-1">
				<h5>{this.props.username}</h5>
				<img className="profile-img"src={this.props.img} />
				</div>
			</div>
		);
	}
}
