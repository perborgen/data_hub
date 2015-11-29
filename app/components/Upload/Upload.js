import React from 'react';
import ReactDOM from 'react-dom';
import Request from 'superagent';
import update from 'react-addons-update';

export default class Upload extends React.Component {
	
	constructor(props){
		super(props);
		this.preSubmit = this.preSubmit.bind(this);
		this.submitDataset = this.submitDataset.bind(this);
		this.addFeature = this.addFeature.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.state = {
			link: null,
			uploaded: false,
			step: 0,
			features: [{
				name: "",
				description: "",
				example: ""
			}]
		}
	}

	preSubmit(ev) {
		ev.preventDefault();
		var datasetName = ReactDOM.findDOMNode(this.refs.datasetName).value;
		var datasetUrl = ReactDOM.findDOMNode(this.refs.datasetUrl).value;
		var datasetImgUrl = ReactDOM.findDOMNode(this.refs.datasetImgUrl).value;
		var datasetTags = ReactDOM.findDOMNode(this.refs.datasetTags).value.split(",");
		var description = ReactDOM.findDOMNode(this.refs.description).value;
	
		this.setState({
			title: datasetName,
			url: datasetUrl,
			img_url: datasetImgUrl,
			tags: datasetTags,
			description: description,
			step: 1
		});
	}

	submitDataset(){
		Request.post("/api/dataset/new")
			.send({
				title: this.state.title,
				url: this.state.url,
				img_url: this.state.img_url,
				tags: this.state.tags,
				description: this.state.description,
				features: this.state.features
			})
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				this.setState({
					link: '/dataset/d/' + res.body._id,
					uploaded: true,
					step: 2
				});
			});

	}

	addFeature(){
		let features = this.state.features;
		let new_features = update(features, {$push: [{name: "", description: "", example: ""}]});
		this.setState({
			features: new_features
		});
	}

	handleChange(index, name, ev){
		let value = ev.target.value;
		let features = this.state.features.concat();
		features[index][name] = value;
		this.setState({
			features: features
		});
	}

	render() {
		let content;
		console.log(this.state.features);

		let featureboxes = this.state.features.map( (feature, index) => {
			return (
				<tr key={index} >
				<td>
				<input
					type="text" 
					onChange={this.handleChange.bind(this, index, "name")}/>
				</td>
				<td>
				<input 
					type="text" 
					onChange={this.handleChange.bind(this, index, "description")}/>
				</td>
				<td>
				<input 
					type="text" 
					onChange={this.handleChange.bind(this, index, "example")}/>
				</td>	
				</tr>
			);
		});

		if (this.state.step === 0){
			content = (
				<form onSubmit={this.preSubmit}>
						<h2 style={{textAlign: 'center'}}>Upload your dataset</h2>
						<table className="uploadTable">
						<tbody>
						<tr>
							<td>
								<label htmlFor="datasetName" >Name of dataset</label>
							</td>
							<td>
								<input type="text" id="datasetName" ref="datasetName"/>
							</td>
							</tr>
						<tr>
							<td>
								<label htmlFor="datasetUrl">Url</label>
							</td>
							<td>
								<input type="text" id="datasetUrl" ref="datasetUrl"/>
							</td>
						</tr>
						<tr>
							<td>
								<label htmlFor="datasetImgUrl">Image URL</label>
							</td>
							<td>
								<input type="text" id="datasetImgUrl" ref="datasetImgUrl"/>
							</td>
						</tr>
						<tr>
							<td>
								<label htmlFor="datasetTags">Tags</label>
							</td>
							<td>
								<input type="text" id="datasetTags" ref="datasetTags"/>
							</td>
						</tr>
						<tr>
							<td>
								<label htmlFor="description">Description</label>
							</td>
							<td>
								<input type="text" id="description" ref="description"/>
							</td>
						</tr>
						<tr>
							<td>
								<input type="submit" value="Submit dataset" />
							</td>
						</tr>
						</tbody>
						</table>
					</form>)
		} else if (this.state.step === 1){

			content = (
					<div>
					<h5>Please describe the dataset's features</h5>
					<table>
					<thead>
					<tr>
					<th>
					Feature
					</th>
					<th>
					Description
					</th>
					<th>
					Example
					</th>
					</tr>
					{featureboxes}
					</thead>
					</table>
					<button onClick={this.addFeature}>Add new feature</button>
					<br/>
					<button onClick={this.submitDataset}>Submit dataset</button>

					</div>
				);
		}

		else if (this.state.step === 2 ){
			content = (<div>
							<h3 style={{textAlign: 'center'}}>Well done!</h3>
							<p style={{textAlign: 'center'}}>You've uploaded your dataset.</p>
							<a href={this.state.link}>
								<input 
									type="submit" 
									className="btn-success"
									style={{margin: '0 auto', display: 'block'}} 
									value="Check it out" />
							</a>
						</div>);	

		} 
		return (
			<div>
				<div className="col-md-8 col-md-offset-2 
								col-sm-8 col-sm-offset-2 
								col-lg-8 col-lg-offset-2
								col-xs-8 col-lg-offset-2">
					{content}
				</div>
			</div>
		);
	}
}
