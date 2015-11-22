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
								<div className="row">
									<div>
									<input
										type="text" 
										style={{width: '200px', margin: '0 auto'}}
										className="form-control" 
										placeholder="Search for dataset..." />
									</div>
								</div>
							</div>
						</div>
					<FeaturedContainer/>
				</div>
			</div>
		);
	}
}