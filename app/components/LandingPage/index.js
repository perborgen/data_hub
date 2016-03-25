import React from "react";
import Request from 'superagent';
import FeaturedDatasets from "./FeaturedDatasets";
import FeaturedRequests from "./FeaturedRequests";

export default class LandingPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			datasets: [],
			viewDatasets: true
		}
		this.toggleView = this.toggleView.bind(this);
	}

	componentDidMount(){
		Request.get("/api/datasets/featured")
			.end((err, datasets) => {
				if (err) {
					throw err;
				}
				console.log('datasets: ', datasets);
				Request.get('/api/requests/featured')
					.end((err, requests) => {
						if (err) {
							throw err;
						}
						console.log('requests: ', requests);
						this.setState({
							datasets: datasets.body,
							requests: requests.body
						});
					})
				});
	}

	toggleView() {
		this.setState({
			viewDatasets: !this.state.viewDatasets
		});
	}

	render() {
		let content,
			requestStyle,
			datasetStyle;	
		if (this.state.viewDatasets === true) {
			content = <FeaturedDatasets datasets={this.state.datasets} />;
			datasetStyle = {
				fontWeight: 'bold'
			};
		} else {
			content = <FeaturedRequests request={this.state.requests} />;
			requestStyle = {
				fontWeight: 'bold'
			};
		}
		return (
			<div>
				<div className="container-fluid">
					<div className="row" style={{marginBottom: '40px'}}>
						<div className="col-xs-12 
										col-sm-12 
										col-md-12 
										col-lg-12">
							<h1 className="landing-page-title">
								Datasets for Data Geeks
							</h1>
							<p className="landing-page-description">The easiest way to share and discover new machine learning datasets</p>	
							<div className="btn-group featured-toggle" role="group" aria-label="..." >
								<button onClick={this.toggleView} type="button" className="btn btn-default btn-lg" style={datasetStyle}>Datasets</button>
								<button onClick={this.toggleView} type="button" className="btn btn-default btn-lg" style={requestStyle}>Requests</button>
							</div>
						</div>
					</div>
				{content}
				</div>
			</div>
		);
	}
}