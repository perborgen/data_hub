import React from "react";
import FeaturedContainer from "./FeaturedContainer";
import Request from 'superagent';

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
							<h1 style={{textAlign: 'center',marginTop: '0'}}>
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