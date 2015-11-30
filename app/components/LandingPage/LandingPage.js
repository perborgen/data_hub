import React from "react";
import Request from 'superagent';
import FeaturedContainer from "./FeaturedContainer";

export default class LandingPage extends React.Component {

	constructor(props){
		super(props);
	}
	render() {
		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12 
										col-sm-12 
										col-md-12 
										col-lg-12">
							<h1 className="landing-page-title">
								Data Sets for Data Geeks
							</h1>
							<p className="sub-title">Most upvotes data sets:</p>
							</div>
						</div>
					<FeaturedContainer/>
				</div>
			</div>
		);
	}
}