import React from "react";

export default class About extends React.Component {

render() {
	console.log('render');
		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12 
										col-sm-12 
										col-md-12 
										col-lg-12">
							<div className="col-xs-12 
											col-sm-10 col-sm-offset-1 
											col-md-6 col-md-offset-3 
											col-lg-4 col-lg-offset-4">
								<h3 style={{textAlign: 'center'}}>About Datasets.co</h3>
								<br/>
								<p>Datasets.co aims to become the easiests and most engaging way for data scientists and hobbyists to
								discover and share new datasets.</p>
								<p>We plan to do this by eliminating all the frustrations related to finding the right datasets,
								like identify their qualities and shortcomings, and quickly being able to discover their areas of usage.</p>
								<p>We also want to encourage people to share their datasets, as we all become smarter if we share our data.</p>
								<p>The page is built open source. You can check out the GitHub repo 
								<a href="https://github.com/perborgen/data_hub"> here.</a>
								</p>
								<p>
								By <i>we</i>, I actually mean <i>me</i>, as I'm the only one working on it at the moment. 
								But I'd be more than happy to invole other people who share the same mission.
								</p>
								<p>If you're interested in contributing, just send me on email at perhborgen[at]gmail.com</p>
								<p>Cheers</p>
								<p>Per Harald Borgen</p>
								<p>
								<a href="https://no.linkedin.com/in/per-harald-borgen-b3901327">LinkedIn </a> 
								<a href="https://github.com/perborgen"> GitHub </a> 
								<a href="https://twitter.com/OsloKommunePer"> Twitter</a> 
								</p>
								<img  
									className="profile-img"
									src="https://avatars3.githubusercontent.com/u/2429547?v=3&s=460"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}