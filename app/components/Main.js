import React from "react";
import Navbar from "./Navbar";
import Request from 'superagent';
import DisqusThread from 'react-disqus-thread';

export default class Main extends React.Component {

    contextTypes: {
        router: React.PropTypes.func.isRequired
    }

	constructor(props){

		super(props);
		this.state = {
			username: ""
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
					console.log('res.body: ', res.body);
					this.setState(res.body);
				} 
		});
	}
	handleNewComment(){
		console.log('handleNewComment: ', handleNewComment);
	}

	render () {
        let children = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, this.state);
        });

		return (
		<div>
			<Navbar {...this.state} onSearch={this.onSearch} />
			<div className="container-fluid">
				<div className="row">
					{children}
				</div>	
			</div>
		</div>
		);
	}
}

