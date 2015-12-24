import React from 'react';
import ReactDOM from 'react-dom';
import Request from 'superagent';
import update from 'react-addons-update';

export default class Upload extends React.Component {
	
	constructor(props){
		super(props);
		this.submitDataset = this.submitDataset.bind(this);
		this.addFeatures = this.addFeatures.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.addArticle = this.addArticle.bind(this);

		this.state = {
			link: null,
			datasetName: '',
			datasetUrl: '',
			datasetTags: '',
			datasetImgUrl: '',
			uploaded: false,
			step: 0,
			features: [{
				name: "",
				description: "",
				example: ""
			}],
			datasetArticles: [{
				title: "",
				link: ""
			}]
		}
	}

	submitDataset(){
		Request.post("/api/dataset/new")
			.send({
				title: this.state.datasetName,
				url: this.state.datasetUrl,
				img_url: this.state.datasetImgUrl,
				tags: this.state.datasetTags,
				description: this.state.description,
				features: this.state.features,
				articles: this.state.datasetArticles
			})
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				this.setState({
					link: '/dataset/' + res.body._id,
					uploaded: true,
					step: 2
				});
			});

	}

	addFeatures(){
		let features = this.state.features;
		let new_features = update(features, {$push: [{name: "", description: "", example: ""}]});
		this.setState({
			features: new_features
		});
	}

	onChange(inputField, ev){
		let new_state = {};
		new_state[inputField] = ev.target.value;
		this.setState(new_state);
	}

	addArticle(){
		let datasetArticles = this.state.datasetArticles.concat();
		datasetArticles.push({
			title: "",
			link: ""
		});
		this.setState({
			datasetArticles: datasetArticles
		})
	}

	onArticlesChange(index, titleOrUrl, ev) {
		let datasetArticles = this.state.datasetArticles.concat();
		datasetArticles[index][titleOrUrl] = ev.target.value;
		
		this.setState({
			datasetArticles: datasetArticles
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

		let datasetArticles = this.state.datasetArticles.map((dataset, index) => {
			return (
				<div key={index}>
					<div className="form-group">
							<label htmlFor="datasetName">Link title</label>
							<input
								type="text"
								className="form-control"
								style={{marginTop: '5px'}}
								onChange={this.onArticlesChange.bind(this, index, 'title')}
								value={this.state.datasetArticles[index].title}
							/>
					</div>
					<div className="form-group">
							<label htmlFor="datasetName">Link url</label>
							<input
								type="text"
								className="form-control"
								style={{marginTop: '5px'}}
								onChange={this.onArticlesChange.bind(this, index, 'link')}
								value={this.state.datasetArticles[index].link}
							/>
					</div>
				</div>
			);
		});

		let featureboxes = this.state.features.map( (feature, index) => {
			return (
				<tr key={index} >
					<td>
						<input
							className="feature-form-input form-control"
							type="text" 
							onChange={this.handleChange.bind(this, index, "name")}/>
					</td>
					<td>
						<input
							className="feature-form-input form-control" 
							type="text" 
							onChange={this.handleChange.bind(this, index, "description")}/>
						</td>
					<td>
						<input 
							className="feature-form-input form-control"
							type="text" 
							onChange={this.handleChange.bind(this, index, "example")}/>
					</td>	
				</tr>
			);
		});

		if (this.state.step === 0){
			content = (
				<div>
					<h3 style={{textAlign: 'center'}}>Upload your dataset</h3>
					<div className="form-group">
						<label htmlFor="datasetName" >Name of dataset</label>
						<input
							className="form-control"
							value={this.state.datasetName} 
							onChange={this.onChange.bind(this, "datasetName")} 
							type="text" 
							id="datasetName" 
							ref="datasetName"/>
						</div>
					  	<div className="form-group">
							<label htmlFor="datasetUrl">Url</label>
							<input
								className="form-control"
								value={this.state.datasetUrl} 
								onChange={this.onChange.bind(this, "datasetUrl")}
								type="text" 
								id="datasetUrl" 
								ref="datasetUrl"/>
						</div>
					  	<div className="form-group">
							<label htmlFor="datasetImgUrl">Image URL</label>
							<input
								className="form-control"
								value={this.state.datasetImgUrl} 
								onChange={this.onChange.bind(this, "datasetImgUrl")} 
								type="text" 
								id="datasetImgUrl" 
								ref="datasetImgUrl"/>
						</div>
					  	<div className="form-group">
							<label htmlFor="datasetTags">Tags</label>
							<input
								className="form-control"
								value={this.state.datasetTags} 
								onChange={this.onChange.bind(this, "datasetTags")}  
								type="text" 
								id="datasetTags" 
								ref="datasetTags"/>
						</div>
					  	<div className="form-group">
							<label htmlFor="description">Description</label>
							<input
								className="form-control"
								value={this.state.description} 
								onChange={this.onChange.bind(this, "description")}  
								type="text" 
								id="description" 
								ref="description"/>
						</div>
					<div className="feature-form-container">
						<h3 style={{textAlign: 'center'}}>Please describe the dataset's features</h3>
						<table className="feature-form">
							<thead>
								<tr>
									<th>Feature</th>
									<th>Description</th>
									<th>Example</th>
								</tr>
							{featureboxes}
							</thead>
						</table>
					<button onClick={this.addFeatures} className="btn btn-default btn-sm">
						<span className="glyphicon glyphicon-plus"></span>
						Add new feature
					</button>
					<br/>
					</div>
						<div>
							<h3 style={{textAlign: 'center'}}>Add any relevant links about the dataset</h3>
							{datasetArticles}
						<button
							onClick={this.addArticle} 
							className="btn btn-default btn-sm">
							<span className="glyphicon glyphicon-plus"></span>
							Add new link
						</button>
					</div>
					<div className="submit-dataset-container">
						<button
							style={{marginTop: '30px'}} 
							onClick={this.submitDataset} 
							className="btn btn-success submit-dataset-button">
							Submit dataset
						</button>
					</div>
					</div>
				);
		}
		else if (this.state.step === 2 ){	
			content = (
				<div>
					<h3 style={{textAlign: 'center'}}>Well done!</h3>
					<p style={{textAlign: 'center'}}>You've uploaded your dataset.</p>
					<a href={this.state.link}>
						<button 
							type="submit" 
							className="btn btn-success"
							style={{margin: '0 auto', display: 'block'}} 
							value="Check it out">
						</button>
					</a>
				</div>
			);
		} 


		return (
			<div>
				<div className="col-md-8 col-md-offset-2 
								col-sm-8 col-sm-offset-2 
								col-lg-6 col-lg-offset-3
								col-xs-8 col-xs-offset-2">
					{content}
				</div>
			</div>
		);
	}
}
