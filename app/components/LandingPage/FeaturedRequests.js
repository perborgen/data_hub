import React from "react";
import Request from 'superagent';


export default class FeaturedRequests extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			requests: []
		}; 
	}

	componentDidMount(){
		Request.get("/api/requests/featured")
			.end( (err, res) =>{
				this.setState({
					requests: res.body
				});
			});
	}

	render() {
		let requests = this.state.requests.map( (request, index) => {
			return (
				<div key={index} className="col-xs-10 col-xs-offset-1 
											col-sm-6 col-sm-offset-0
											col-md-4 col-lg-4">
					
					<div className="featured-request">
					<a href={"/request/" + request._id}>
						<h5 style={{textAlign: 'center'}}>{request.title}</h5>
						<span style={{margin: '0 auto'}} className="request-dataset-offer">{request.paymentAmount} USD</span>
					</a>
					</div>
				</div>
			);
		});


		return ( 
			<div className="row" style={{margin: '0px 0px'}}>
				<div className="col-md-12 
								col-sm-12 
								col-lg-12 
								col-xs-12">
					<p className="sub-title">New dataset requests:</p>

				{requests}
				</div>
			</div>
		)
	}
}