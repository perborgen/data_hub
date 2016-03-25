import React from "react";
import SuperAgent from 'superagent';
import DisqusThread from 'react-disqus-thread';

export default class Request extends React.Component {
	
	constructor(props) {
		super(props);
		this.upvote = this.upvote.bind(this);
		this.updateUpvotes = this.updateUpvotes.bind(this);
	}

	upvote() {
		if (this.props.logged_in){
			SuperAgent.post("/api/request/upvote")
			.send({id : this.state._id})
			.end( (err, res) => {
				if (err) {
					console.log('err: ', err);
				}
				if (res.body !== false) {
					this.updateUpvotes(res.body.upvotes);				
				}
			});
		}
	}

	updateUpvotes (upvotes) {
		this.setState({
			upvotes: upvotes,
			num_upvotes: upvotes.length	
		});
	}

  	componentDidMount(){
  		var path = this.props.params.requestId;
  		console.log('this: ', this);
  		SuperAgent.get("/api/request/" + path)
  			.end((err, res) => {
  				console.log('dataset: ', res);
  				this.setState(res.body);
  			});
  	}

	render () {
		let identifier = this.props.params.datasetTitle;
		let url = "http://www.datasets.co/requests/" + identifier;        
		let children = React.Children.map(this.props.children, (child) => {
	        return React.cloneElement(child, {
				logged_in: this.props.logged_in,
				data: this.state,
				upvote: this.upvote
			});
        });

		return (
			<div className="col-md-10 col-md-offset-1 
				col-sm-10 col-sm-offset-1  
				col-lg-10 col-lg-offset-1 
				col-xs-10 col-xs-offset-1">
				{children}
			<br/>
			<h4>Please leave a comment if you know how to get this dataset!</h4>
			<DisqusThread
					shortname="datasetsco"
					identifier={identifier}
					title="Datasets Comments"
					url={url}
			        />	
			</div>
		);
	}
}




