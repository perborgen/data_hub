import React from "react";
import Navbar from "./Navbar";
import ContentContainer from "./ContentContainer";
import Request from 'superagent';
export default class Main extends React.Component {

    contextTypes: {
        router: React.PropTypes.func.isRequired
    }

	constructor(props){
		super(props);
		this.state = {
			userName: null,
			img: null,
			logged_in: false
		};
	}

	componentWillMount(){
		Request.get("/api/user")
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				if (res) {
					this.setState({
						userName: res.body.profile.displayName,
						img: res.body.profile.raw.avatar_url,
						logged_in: true
					});

				}

			});
	}

	render () {
		return (
		<div>
			<Navbar user={this.state} />
			{this.props.children}
		</div>
		);
	}
}

