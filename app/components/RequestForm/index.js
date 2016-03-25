import React from 'react';
import ReactDOM from 'react-dom';
import SuperRequest from 'superagent';
import update from 'react-addons-update';
const Link = require('react-router').Link

export default class Request extends React.Component {
	
	constructor(props){
		super(props);
		this.submitDetails = this.submitDetails.bind(this);
		this.submitDescription = this.submitDescription.bind(this);
		this.submitWouldPay = this.submitWouldPay.bind(this);
		this.submitFinal = this.submitFinal.bind(this);

		this.state = {
			link: null,
			finished: false,
			amount: 0,
			step: 0,
			title: "",
			tags: "",
			description: "",
			datasetFeatures: "",
			user: "",
			datasetTags: []
		}
	}

	submitDetails(ev){
		ev.preventDefault();
		let datasetName = ReactDOM.findDOMNode(this.refs.datasetName).value;
		let datasetTags = ReactDOM.findDOMNode(this.refs.datasetTags).value.split(",");
		let datasetFeatures = ReactDOM.findDOMNode(this.refs.datasetFeatures).value;
		this.setState({
			step: 1,
			title: datasetName,
			tags: datasetTags,
			datasetFeatures: datasetFeatures,
			user: 'test'
		});
	}

	submitDescription() {
		let datasetDescription = ReactDOM.findDOMNode(this.refs.datasetDescription).value;
		this.setState({
			description: datasetDescription,
			step: 2
		});
	}

	submitWouldPay(willingToPay, ev){
		if (willingToPay) {
			this.setState({
				step: 3
			})
		}
		else {
			this.submitFinal(willingToPay);
		}
	}

	submitFinal() {
		console.log('submitFinal, this.state: ', this.state);
		SuperRequest.post("/api/request/new")
			.send({
				title: this.state.title,
				url: this.state.url,
				img_url: this.state.img_url,
				tags: this.state.tags,
				description: this.state.description,
				user: 'test',
				user: this.props.userName
			})
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				this.setState({
					link: '/request/' + res.body._id,
					step: 1,
				});
			});
	}

	onChange(inputField, ev){
		let new_state = {};
		new_state[inputField] = ev.target.value;
		this.setState(new_state);
	}

	render() {
		let content,
			tags;
		
		if (this.state.tags.length > 0) {
			tags = this.state.tags.split(',').map((tag, index) => {
				return (
					<li key={index} className="tag-item">
							<span className="tag-text">
								{tag}
							</span>
					</li>
				);
			});
		}
		console.log('tags: ', tags);

		if (this.state.step === 0){
			content = (
				<div>
					<h2 style={{textAlign: 'center'}}>Request a dataset</h2>
					<div className="form-group">
						<label htmlFor="datasetName">Title (a short title describing the dataset you want)</label>
						<input
							className="form-control"
							value={this.state.datasetName} 
							onChange={this.onChange.bind(this, "title")} 
							type="text" 
							id="datasetName" 
							ref="datasetName"/>
					</div>
					<div className="form-group">
						<label htmlFor="datasetTags">Tags (separate with commas)</label>
						<input
							className="form-control"
							value={this.state.tags} 
							onChange={this.onChange.bind(this, "tags")}  
							type="text" 
							id="datasetTags" 
							ref="datasetTags"/>
						<ul className="tag-list">
							{tags}
						</ul>
					</div>
					<div className="form-group">
						<label htmlFor="description">Description</label>
						<textarea
							className="form-control"
							value={this.state.description} 
							onChange={this.onChange.bind(this, "description")}  
							type="text" 
							id="description" 
							ref="description"/>
					</div>
					<div className="submit-dataset-container">
						<button
							style={{marginTop: '30px'}} 
							onClick={this.submitFinal} 
							className="btn btn-success submit-dataset-button">
							Submit request
						</button>
					</div>
				</div>
			);
		}

		else if (this.state.step === 1) {
			content = (
				<div>
					<h3 style={{textAlign: 'center'}}>Well done!</h3>
					<p style={{textAlign: 'center'}}>You've created a dataset request. Now check it out and share it with the world.</p>
					<Link to={"/request/" + this.state.title.split(' ').join('-')}>
						<input 
							type="submit" 
							className="btn-success"
							style={{margin: '0 auto', display: 'block'}} 
							value="Check it out" />
					</Link>
				</div>);	

		} 
		return (
			<div>
				<div className="col-md-8 col-md-offset-2 
								col-sm-8 col-sm-offset-2 
								col-lg-8 col-lg-offset-2
								col-xs-8 col-lg-offset-2">
					<div style={{margin: '0 auto'}}>
					{content}
					</div>
				</div>
			</div>
		);
	}
}