import React from "react";
const Link = require('react-router').Link;

export default class About extends React.Component {

render() {
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
							<h3 style={{textAlign: 'center'}}>Contribute</h3>
							<br/>
							<p>Datasets.co needs one thing: more datasets!</p>
							<p>So if you want to contribute, simply find a dataset you like and <Link to="upload">register it here</Link> on the site. It only takes a couple of minutes.</p>
							<p>If you're interested in helping with developing the site, you can check out the GitHub repo 
							<a href="https://github.com/perborgen/data_hub"> here. </a>
							Feel free to raise an issue, suggest a new feature or contribute to the code base. You can also
							submit your suggestions <Link to="feedback">using this form.</Link>
							</p>
							<p>To read more about Dataset.co's mission, head over to the <Link to="about">about page.</Link></p>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		);
	}

}