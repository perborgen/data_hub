import React from "react";
import Request from 'superagent';

export default class Account extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			userName: null,
			img: null
		};
	}

	componentWillMount(){
		Request.get("/api/user")
			.end( (err, res) => {
				if (err){
					throw err;
				}
				this.setState({
					userName: res.body.profile.displayName,
					img: res.body.profile.raw.avatar_url
				});
			});
	}

	render () {
		return (
		<div>
			<p>{this.state.userName}</p>
			<img src={this.state.img} />
		</div>
		);
	}
}
