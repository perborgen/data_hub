import React from "react";
import Request from 'superagent';

export default class Account extends React.Component {

	constructor(props){
		super(props);
	}

	render () {
		return (
			<div>
				<div >
				<h5>{this.props.username}</h5>
				<img className="profile-img"src={this.props.img} />
				</div>
			</div>
		);
	}
}
