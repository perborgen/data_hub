import React from "react";
import Request from 'superagent';

export default class About extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			text : "",
			submitted : false
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange(ev){
		this.setState({
			text: ev.target.value
		});
	}

	handleClick() {
		Request.post('/api/feedback')
			.send({
				text: this.state.text
			})
			.end( (err, res) => {
				if (err) {
					throw err;
				}
				this.setState({
					submitted: true
				});
			});
	}

	render() {

		let content;

		if (this.state.submitted === false) {
			content = (
				<div className="form-group">
					<h3 style={{textAlign: 'center'}}>Leave your feedback</h3>
					<br/>
					<p>Our goal is to make it easier for data scientist and hobbyists to navigate through the worlds data.
					To do that, we'll need your help. Please tell us how we can improve Datasets.co in the form below.</p>
					<textarea
						style={{marginBottom: '10px'}} 
						onChange={this.handleChange} 
						className="form-control">
					</textarea>
					<button 
						onClick={this.handleClick} 
						className="btn btn-default">
					Submit
					</button>
				</div>
			);
		} else if (this.state.submitted === true ) {
			content = <h3 style={{textAlign: 'center'}}>Thank you for your feedback!</h3>
		}

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
								{content}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}