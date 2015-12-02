import React from "react";
import Navbar from "./Navbar";
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

	onSearch(searchText){
		Request.get("/api/search")
			.end( (err, res) => {
				if (err){
					throw err;
				}				
			});
	}

	componentWillMount(){
		Request.get("/api/user")
			.end( (err, res) => {
				if (err){
					throw err;
				}
				if (res.body) {
					this.setState({
						userName: res.body.profile.displayName,
						img: res.body.profile.raw.avatar_url,
						logged_in: true
					});
				} else {
					console.log('not logged in');
				}

			});
	}

	render () {
        let children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {
				logged_in: this.state.logged_in,
				userName: this.state.userName
			});
        });

		return (
		<div>
			<Navbar user={this.state} onSearch={this.onSearch} />
			{children}
		</div>
		);
	}
}

